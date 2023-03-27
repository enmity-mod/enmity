import { View, Image, TouchableOpacity } from '@components';
import { BadgesDomain, Times } from '@data/constants';
import { Toasts, Theme } from '@metro/common';
import { wrapInHooks } from '@utilities';
import { version } from '@api/native';
import { getByName } from '@metro';
import { create } from '@patcher';
import React from 'react';

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
  const Badges = getByName('ProfileBadges', { all: true, default: false });

  for (const ProfileBadges of Badges) {
    Patcher.after(ProfileBadges, 'default', (_, [{ user, isEnmity, style, ...rest }], res) => {
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
        res = wrapInHooks(ProfileBadges.default)({
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

      return res;
    });
  }

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
    enmity={true}
    key={badge}
    style={styles.wrapper}
  >
    <Badge 
      type={badge}
      size={Array.isArray(style) 
        ? style.find(r => r.paddingVertical && r.paddingHorizontal)
          ? 16
          : 24
        : 18}
      margin={Array.isArray(style)
        ? 2
        : 6}
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
      marginHorizontal: margin
    }
  };

  const uri = badge.url[Theme.theme];

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
  }).then(r => r.json()).catch(() => { });

  if (res?.url) {
    cache.badges[type] = {
      data: res,
      date: Date.now()
    };
  }

  return res;
}