import { View, Image, TouchableOpacity } from '@components';
import { BadgesDomain, Times } from '@data/constants';
import { Toasts, Theme } from '@metro/common';
import { wrapInHooks } from '@utilities';
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
  const Badges = getByName('ProfileBadges', { default: false });

  Patcher.after(Badges, 'default', (_, [{ user, isEnmity, ...rest }], res) => {
    if (isEnmity) return;
    const [badges, setBadges] = React.useState([]);
    React.useEffect(() => {
      try {
        fetchUserBadges(user.id).then(setBadges);
      } catch (e) {
        console.error(`Failed to request/parse badges for ${user.id}`);
      }
    }, []);

    if (!badges.length) return res;
    if (!res) {
      res = wrapInHooks(Badges.default)({
        user: new Proxy({}, {
          get: (_, prop) => {
            if (prop === 'flags') {
              return -1;
            }

            return user[prop];
          }
        }),
        isEnmity: true,
        ...rest
      });

      if (res?.props) {
        res.props.badges = [];
      }
    }

    if (!res) return res;
    res.props.badges.push(...badges.map(badge => <View
      key={badge}
      __enmity={true}
      style={{
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-end'
      }}
    >
      <Badge type={badge} />
    </View>));

    return res;
  });

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

function Badge({ type }: { type: string; }): JSX.Element {
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

  return <TouchableOpacity
    onPress={() => {
      Toasts.open({
        content: badge.name,
        source: { uri: badge.url[Theme.theme] }
      });
    }}
  >
    <Image
      source={{ uri: badge.url[Theme.theme] }}
      style={{
        width: 24,
        height: 24,
        resizeMode: 'contain',
        marginHorizontal: 2
      }}
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