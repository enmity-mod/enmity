import { getModule, getModules } from '../utils/modules';
import { create } from '../utils/patcher';
import { reloadDiscord } from '../api/native';
import { showDialog } from '../api/dialog';

import { FormArrow, FormDivider, FormLabel, FormRow, FormSection, React, Text, View } from '../api/react';
import { getModuleByProps } from 'enmity-api/module';

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

      const Navigator = getModule(m => m.NavButton);

      const enmitySection =
        <><FormSection title="Enmity">
          <FormRow label="Enmity" trailing={<FormLabel text={version}/>} onPress={(): void => {
            openURL(`https://github.com/enmity-mod/Enmity/commit/${version}`);
          }}></FormRow>
          <FormDivider />
          <FormRow label="Plugins" trailing={<FormArrow/>} onPress={(): void => {
            showDialog({
              title: 'Coming soon',
              confirmText: 'Okay',
            });
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
            openURL('https://github.com/enmity-mod/Enmity');
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
