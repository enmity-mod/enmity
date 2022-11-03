import { FormArrow, FormDivider, FormRow, FormSection } from '@components';
import { connectComponent } from '@api/settings';
import { Locale, Scenes } from '@metro/common';
import { findInReactTree } from '@utilities';
import * as Screens from '@screens/index';
import { getByName } from '@metro';
import { create } from '@patcher';
import React from 'react';

import ThemeIcon from '@screens/partials/ThemeIcon';
import PluginIcon from '@screens/partials/PluginIcon';

const Patcher = create('enmity-settings');

export default function (): void {
  patchScreens();
  patchSettings();
}

function patchScreens() {
  Patcher.after(Scenes, 'default', (_, args, res) => {
    return {
      ...res,
      Enmity: {
        key: 'Enmity',
        title: 'Enmity',
        render: connectComponent(Screens.Enmity.Page, 'enmity')
      },
      EnmityPlugins: {
        key: 'EnmityPlugins',
        title: 'Plugins',
        render: Screens.Plugins.Page,
        headerRight: Screens.Plugins.HeaderRight
      },
      EnmityThemes: {
        key: 'EnmityThemes',
        title: 'Themes',
        render: Screens.Themes.Page,
        headerRight: Screens.Themes.HeaderRight
      }
    };
  });
}

function patchSettings() {
  const Settings = getByName('UserSettingsOverviewWrapper', { default: false });

  const unpatch = Patcher.after(Settings, 'default', (_, __, ret) => {
    const Overview = findInReactTree(ret, m => m.type?.name === 'UserSettingsOverview');

    Patcher.after(Overview.type.prototype, 'render', ({ props: { navigation } }, __, res) => {
      const { children } = res.props;

      const searchable = [Locale.Messages.BILLING_SETTINGS, Locale.Messages.PREMIUM_SETTINGS];
      const index = children.findIndex(c => searchable.includes(c.props.title));

      children.splice(index === -1 ? 4 : index, 0, <>
        <FormSection key='Enmity' title='Enmity'>
          <FormRow
            label='General'
            leading={<FormRow.Icon source={{ uri: 'https://files.enmity.app/icon-64.png' }} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('Enmity', { navigation })}
          />
          <FormDivider />
          <FormRow
            label='Plugins'
            leading={<PluginIcon width={24} height={24} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('EnmityPlugins', { navigation })}
          />
          <FormDivider />
          <FormRow
            label='Themes'
            leading={<ThemeIcon width={24} height={24} />}
            trailing={<FormArrow />}
            onPress={() => void navigation.push('EnmityThemes', { navigation })}
          />
        </FormSection>
      </>);

      // Remove "Upload Debug Logs" button
      const supporter = children.find(c => c.props.title === Locale.Messages.SUPPORT);
      const entries = supporter?.props.children;

      if (entries) {
        supporter.props.children = entries.filter(e => e?.type?.name !== 'UploadLogsButton');
      }
    });

    unpatch();
  });
}
