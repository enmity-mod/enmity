import { FormArrow, FormDivider, FormLabel, FormRow, FormSection, React } from "../api/react";
import { PluginPage } from "../screens/plugins";
import { ThemePage } from "../screens/themes";
import { reloadDiscord } from "../api/native";
import { getModule } from "../utils/modules";
import { showDialog } from "../api/dialog";
import { create } from "../utils/patcher";

const Navigation = getModule(m => m.default?.pushLazy);

export function patchSettings(): void {
   const Patcher = create("enmity-settings");

   let UserSettingsOverview;
   const Settings = getModule(m => m.default?.name === "UserSettingsOverviewWrapper");
   const unpatch = Patcher.after(Settings, "default", (_, args, res) => {
      if (UserSettingsOverview !== void 0) {
         return;
      }

      unpatch();

      UserSettingsOverview = res.type;

      const { openURL } = getModule(m => m.handleSupportedURL);
      const Messages = getModule(x => x.default?.Messages).default.Messages;

      Patcher.after(UserSettingsOverview.prototype, "render", (_, args, { props: { children } }) => {
         const index = children.findIndex(x => x.props.title === Messages["PREMIUM_SETTINGS"]);
         const { version } = window["enmity"];

         children.splice(index, 0, <>
            <FormSection title="Enmity">
               <FormRow
                  label="Enmity"
                  trailing={<FormLabel text={version} />}
                  onPress={(): void => {
                     openURL(`https://github.com/enmity-mod/enmity/commit/${version}`);
                  }}
               />
               <FormDivider />
               <FormRow
                  label="Plugins"
                  trailing={<FormArrow />}
                  onPress={(): void => {
                     Navigation.default.push(PluginPage, {});
                  }}
               />
               <FormDivider />
               <FormRow
                  label="Themes"
                  trailing={<FormArrow />}
                  onPress={(): void => {
                     Navigation.default.push(ThemePage, {});
                  }}
               />
               <FormDivider />
               <FormRow
                  label={<FormLabel style={{ color: "#FFC0CB" }} text={"Reload Discord"} />}
                  arrowShown={true}
                  onPress={(): void => {
                     showDialog({
                        title: "Are you sure you want to reload Discord?",
                        confirmText: "Yes",
                        cancelText: "No",
                        onConfirm: reloadDiscord,
                     });
                  }}
               />
            </FormSection>
            <FormSection>
               <FormRow
                  label={<FormLabel text={"Discord"} />}
                  trailing={<FormArrow />}
                  onPress={(): void => {
                     openURL("https://discord.gg/rMdzhWUaGT");
                  }}
               />
               <FormDivider />
               <FormRow
                  label={<FormLabel text={"GitHub"} />}
                  trailing={<FormArrow />}
                  onPress={(): void => {
                     openURL("https://github.com/enmity-mod/enmity");
                  }}
               />
               <FormDivider />
               <FormRow
                  label={<FormLabel text={"Twitter"} />}
                  trailing={<FormArrow />}
                  onPress={(): void => {
                     openURL("https://twitter.com/enmityapp");
                  }}
               />
               <FormDivider />
            </FormSection>
         </>);
      });
   });
}
