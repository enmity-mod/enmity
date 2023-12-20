import { View, Image, TouchableOpacity } from '@components';
import { BadgesDomain, Times } from '@data/constants';
import { Toasts, Theme, React } from '@metro/common';
import { build, version } from '@api/native';
import { getByName, getByProps } from '@metro';
import { create } from '@patcher';
import { wrapInHooks } from '@utilities';

interface Badge {
  name: string;
  id: string;
  url: {
    dark: string;
    light: string;
  };
}

const Patcher = create('badges');

const cache = {
  user: {},
  badges: {}
};

export default function () {
  const OldBadges = getByName('ProfileBadges', { all: true, default: false });
  const NewBadges = getByName("ProfileBadges", { default: false });

  const patchBadges = ({ user, isEnmity, style, rest, res, kind }) => {
    if (isEnmity) return;
    const [badges, setBadges] = React.useState([]);

    React.useEffect(() => {
      try {
        fetchUserBadges(user.id).then(setBadges);
      } catch (e) {
        console.error(`Failed to request/parse badges for ${user.id}`);
      }
    }, []);

    const payload = badges.map((badge) => makeBadge(badge, style));

    if (!badges.length) return res;
    if (!res && Number(version) >= 151) {
      res = wrapInHooks(kind)({
        user: new Proxy({}, {
          get: (_, prop) => {
            if (prop === 'flags') {
              return -1;
            }

            if (prop === 'hasFlag') {
              return () => true;
            }

            return user[prop];
          }
        }),
        isEnmity: true,
        ...rest
      });

      res.props.children = [];
      if (res.props.badges) {
        res.props.badges = [];
      }
    } else if (!res) {
      return payload;
    }

    if (res.props.badges) {
      res.props.badges.push(...payload);
    } else {
      res.props.children.push(...payload);
    }
  }
 
  if (build >= "42235") {
    Patcher.after(NewBadges, 'default', (_, [{ user, isEnmity, style, ...rest }], res) => {
      const oldRes = res;
        if (!res) {
          res = <View 
            style={[style, { 
              flexDirection: "row", 
              flexWrap: 'wrap', 
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              paddingVertical: 2
            }]} 
            accessibilityRole={"list"}
            accessibilityLabel={"User Badges"}
          />;

          res.props.children = [];
        }

        patchBadges({ user, isEnmity, style, rest, res, kind: NewBadges.default });

        if (!oldRes) {
          return res;
        }
    });

    return Patcher.unpatchAll;
  }

  for (const ProfileBadges of OldBadges) {
    Patcher.after(ProfileBadges, "default", (_, [{ user, isEnmity, style, ...rest }], res) => {
      patchBadges({ user, isEnmity, style, rest, res, kind: ProfileBadges.default })
    })
  };

  return Patcher.unpatchAll;
};

async function fetchUserBadges(id: string): Promise<string[]> {
  // Refresh badge cache hourly
  if (cache.user[id]?.date && (Date.now() - cache.user[id].date) < Times.HOUR) {
    return cache.user[id].badges;
  }

  const res = await fetch(BadgesDomain + id + '.json', {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }).then(r => r.json()).catch(() => []);

  if (Array.isArray(res)) {
    cache.user[id] = {
      badges: res,
      date: Date.now()
    };
  }

  return res;
}

const makeBadge = (badge, style): JSX.Element => {
  const styles = {
    wrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'flex-end'
    }
  };

  return <View
    enmity
    key={badge}
    style={styles.wrapper}
  >
    <Badge 
      type={badge}
      size={Array.isArray(style) 
        ? style.find(r => r.paddingVertical && r.paddingHorizontal)
          ? 18
          : 24
        : 20}
      margin={Array.isArray(style)
        ? 4
        : 8}
    />
  </View>;
};

const Badge = ({ type, size, margin }: { type: string; size: number; margin: number; }): JSX.Element => {
  const [badge, setBadge] = React.useState(null);

  React.useEffect(() => {
    try {
      fetchBadge(type).then(setBadge);
    } catch (e) {
      console.error(`Failed to get badge data for ${type}.`, e.message);
    }
  }, []);

  if (!badge?.url) {
    return null;
  }

  const styles = {
    image: {
      width: size,
      height: size,
      resizeMode: 'contain',
      marginLeft: margin,
      marginRight: margin + 1
    }
  };

  const uri = badge.url[Theme.theme === "light" ? "light" : "dark"];

  return <TouchableOpacity
    onPress={() => Toasts.open({
      content: badge.name,
      source: { uri }
    })}
  >
    <Image
      source={{ uri }}
      style={styles.image}
    />
  </TouchableOpacity>;
};

async function fetchBadge(type: string): Promise<Badge> {
  // Refresh badge cache hourly
  if (cache.badges[type]?.date && (Date.now() - cache.badges[type].date) < Times.HOUR) {
    return cache.badges[type].data;
  }

  const res = await fetch(BadgesDomain + `data/${type}.json`, {
    headers: {
      'Cache-Control': 'no-cache'
    }
  }).then(r => r.json()).catch(() => {});

  if (res?.url) {
    cache.badges[type] = {
      data: res,
      date: Date.now()
    };
  }

  return res;
}