import { Toasts, Dialog, StyleSheet, ColorMap } from '@metro/common';
import { AddonChannels } from '@data/constants';
import * as Plugins from '@managers/plugins';
import * as Themes from '@managers/themes';
import { getIDByName } from '@api/assets';
import SheetPatcher from '@patcher/sheet';
import { getByTypeName } from '@metro';
import { FormRow } from '@components';
import { reload } from '@api/native';
import React from 'react';

const Icon = getByTypeName('Icon');
const { colors } = ColorMap;
const styles = StyleSheet.createThemedStyleSheet({
  icon: {
    color: colors.INTERACTIVE_NORMAL
  }
});

export default function () {
  SheetPatcher.after('enmity-downloader', 'MessageLongPressActionSheet', (_, [{ channel, message }, items]) => {
    if (AddonChannels.Plugins.includes(channel.id)) {
      const url = message.content.match(/http(|s).+.js/gmi)?.[0];
      if (!url) return;

      items.unshift(<FormRow
        label='Install Plugin'
        leading={<Icon
          {...styles.icon}
          size='medium'
          disableColor={false}
          source={getIDByName('ic_download_24px')}
        />}
        onPress={() => {
          Plugins.installPlugin(url, ({ data }) => {
            const res = { icon: null, text: null };
            switch (data) {
              case 'fucky_wucky':
                res.text = 'Failed plugin installation.';
                res.icon = getIDByName('ic_close_16px');
                break;
              case 'installed_plugin':
                res.text = 'Plugin has been installed.';
                res.icon = getIDByName('Check');
                break;
              case 'overridden_plugin':
                res.text = 'Plugin has been overriden.';
                res.icon = getIDByName('Check');
                break;
            }

            Toasts.open({ content: res.text, source: res.icon });
          });
        }
        } />
      );
    }

    if (AddonChannels.Themes.includes(message.channel_id)) {
      const url = message.content.match(/http(|s).+.json/gmi)?.[0];
      if (!url) return;

      items.unshift(<FormRow
        label='Install Theme'
        leading={<Icon
          {...styles.icon}
          size='medium'
          disableColor={false}
          source={getIDByName('ic_download_24px')}
        />}
        onPress={() => {
          Themes.installTheme(url, ({ data, restart }) => {
            const res = { icon: null, text: null, restart: false };
            switch (data) {
              case 'fucky_wucky':
                res.text = 'Failed theme installation.';
                res.icon = getIDByName('ic_close_16px');
                break;
              case 'installed_theme':
                res.text = 'Theme has been installed.';
                res.icon = getIDByName('Check');
                res.restart = restart;
                break;
              case 'overridden_theme':
                res.text = 'Theme has been overriden.';
                res.icon = getIDByName('Check');
                res.restart = restart;
                break;
            }

            Toasts.open({ content: res.text, source: res.icon });
            if (res.restart) {
              return Dialog.show({
                title: 'Theme Replaced',
                body: 'Replacing the theme you previously had applied requires a restart, would you like to restart Discord to reload the theme values?',
                confirmText: 'Yes',
                cancelText: 'No',
                onConfirm: reload,
              });
            }
          });
        }} />
      );
    }
  });
}