import { getModule, getModules } from '../utils/modules';
import { PluginPage } from '../screens/plugins';
import { create } from '../utils/patcher';
import { reloadDiscord } from '../api/native';
import { showDialog } from '../api/dialog';

import {
  Button,
  Form,
  FormArrow,
  FormDivider,
  FormLabel,
  FormRow,
  FormSection,
  FormText,
  React,
  StatusBar,
  Text,
  View,
  useState,
} from '../api/react';

const navigationModule = getModule(m => m.default?.pushLazy);

export function patchSettings(): void {
  const Patcher = create('SettingsPatch');

  let UserSettingsOverview;
  const Settings = getModule(m => m.default?.name === 'UserSettingsOverviewWrapper');
  const unpatch = Patcher.after(Settings, 'default', (_, args, res) => {
    if (UserSettingsOverview !== undefined) {
      return;
    }

    unpatch();

    UserSettingsOverview = res.type;

    Patcher.after(UserSettingsOverview.prototype, 'render', (_, args, res) => {
      const children = res.props.children;
      const Messages = getModule(x => x.default?.Messages).default.Messages;
      const nitroIndex = children.findIndex(x => x.props.title === Messages['PREMIUM_SETTINGS']);
      const nitro = children[nitroIndex];

      const { openURL } = getModule(m => m.handleSupportedURL);
      const { version } = window['enmity'];

      const enmitySection =
        <><FormSection title="Enmity">
          <FormRow label="Enmity" trailing={<FormLabel text={version}/>} onPress={(): void => {
            openURL(`https://github.com/enmity-mod/enmity/commit/${version}`);
          }}></FormRow>
          <FormDivider />
          <FormRow label="Plugins" trailing={<FormArrow/>} onPress={(): void => {
            navigationModule.default.push(PluginPage, {});
          }}></FormRow>
          <FormDivider />
          <FormRow label="Themes" trailing={<FormArrow/>} onPress={(): void => {
            showDialog({
              title: 'Coming soon',
              confirmText: 'Okay',
            });
          }}></FormRow>
          <FormDivider />
          <FormRow label={<FormLabel style={{ color: '#FFC0CB' }} text={'Reload Discord'}/>} arrowShown={true} onPress={(): void => {
            showDialog({
              title: 'Are you sure you want to reload Discord?',
              confirmText: 'Yes',
              cancelText: 'No',
              onConfirm() {
                reloadDiscord();
              },
            });
          }}></FormRow>
        </FormSection>
        <FormSection>
          <FormRow label={<FormLabel text={'GitHub'}/>} trailing={<FormArrow/>} onPress={(): void => {
            openURL('https://github.com/enmity-mod/enmity');
          }}></FormRow>
          <FormDivider />
          <FormRow label={<FormLabel text={'Twitter'}/>} trailing={<FormArrow/>} onPress={(): void => {
            openURL('https://twitter.com/smolzoey');
          }}></FormRow>
          <FormDivider />
        </FormSection></>;

      children.splice(nitroIndex, 0, enmitySection);
    });
  });
}
