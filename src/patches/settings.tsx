import { showDialog } from '../api/dialog';
import { reloadDiscord } from '../api/native';
import { getModule, getModules } from '../utils/modules';
import { create } from '../utils/patcher';

function patchSettings() {
  const Patcher = create('SettingsPatch');

  let UserSettingsOverview;
  const Settings = getModule(m => m.default?.name == 'UserSettingsOverviewWrapper');
  const unpatch = Patcher.after(Settings, 'default', (_, args, res) => {
    if (UserSettingsOverview !== undefined) {
      return;
    }

    unpatch();

    UserSettingsOverview = res.type;

    Patcher.after(UserSettingsOverview.prototype, "render", (_, args, res) => {
      const children = res.props.children;
      const Messages = getModule(x => x.default?.Messages).default.Messages;
      const React = getModule(m => m.createElement, true);
      const nitroIndex = children.findIndex(x => x.props.title === Messages["PREMIUM_SETTINGS"]);
      const nitro = children[nitroIndex];

      const { View, Text } = getModule(m => m.View);
      const { FormSection, FormRow, FormDivider, FormArrow, FormLabel } = getModule(m => m.FormSection);
      const { openURL } = getModule(m => m.handleSupportedURL);
      const { version } = window["enmity"];

      const Navigator = getModule(m => m.NavButton);

      Patcher.after(Navigator, "handleSectionSelect", (_, args, res) => { 
        console.log(_);
        console.log(args);
        console.log(res);
      });

      const enmitySection = 
        <><FormSection title="Enmity">
          <FormRow label="Enmity" trailing={<FormLabel text={version}/>} onPress={() => {
            openURL(`https://github.com/enmity-mod/Enmity/commit/${version}`);
          }}></FormRow>
          <FormDivider />
          <FormRow label="Plugins" trailing={<FormArrow/>} onPress={() => {
            showDialog({
              title: "Coming soon",
              confirmText: "Okay",
              onConfirm() {},
            });
          }}></FormRow>
          <FormDivider />
          <FormRow label="Themes" trailing={<FormArrow/>} onPress={() => {
            showDialog({
              title: "Coming soon",
              confirmText: "Okay",
              onConfirm() {},
            });
          }}></FormRow>
          <FormDivider />
          <FormRow label={<FormLabel style={{color: "#FFC0CB"}} text={"Reload Discord"}/>} arrowShown={true} onPress={() => {
            showDialog({
              title: "Are you sure you want to reload Discord?",
              confirmText: "Yes",
              cancelText: "No",
              onConfirm() {
                reloadDiscord();
              },
              onCancel() {}
            });
          }}></FormRow>
        </FormSection>
        <FormSection>
          <FormRow label={<FormLabel style={{color: "#6e5494"}} text={"GitHub"}/>} trailing={<FormArrow/>} onPress={() => {
            openURL("https://github.com/enmity-mod/Enmity");
          }}></FormRow>
          <FormDivider />
          <FormRow label={<FormLabel style={{color: "#1da1f2"}} text={"Twitter"}/>} trailing={<FormArrow/>} onPress={() => {
            openURL("https://twitter.com/smolzoey");
          }}></FormRow>
          <FormDivider />
        </FormSection></>;

      children.splice(nitroIndex, 0, enmitySection);
    });
  });
}

export {
  patchSettings
}