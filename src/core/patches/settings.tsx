import { FormArrow, FormDivider, FormRow, FormSection } from '@components';
import { connectComponent } from '@api/settings';
import { Locale, NavigationNative, Scenes, React, Toasts, Assets, Dialog } from '@metro/common';
import { findInReactTree } from '@utilities';
import * as Plugins from "@managers/plugins"
import * as Themes from "@managers/themes"
import { getByName } from '@metro';
import { create } from '@patcher';

import Enmity from "@screens/Enmity"
import Page from "@screens/partials/DataPage"
import HeaderRight from '@screens/partials/HeaderRight';
import ThemeIcon from '@screens/partials/ThemeIcon';
import PluginIcon from '@screens/partials/PluginIcon';
import { reload } from '@api/native';

const Patcher = create('enmity-settings');

export default function (): void {
  patchScreens();
  patchSettings();
}

function patchScreens() {
  Patcher.after(Scenes, 'default', (_, __, res) => {
    return {
      ...res,
      Enmity: {
        key: 'Enmity',
        title: 'Enmity',
        render: connectComponent(Enmity, 'enmity')
      },
      EnmityPlugins: {
        key: 'EnmityPlugins',
        title: 'Plugins',
        render: () => <Page data={"plugin"} />,
        // headerRight: () => <HeaderRight
        //   data={"plugin"}
        //   onConfirm={(url: string) => {
        //     if (!url.endsWith('js')) {
        //       return Toasts.open({
        //         content: 'Invalid URL for plugin',
        //         source: Assets.getIDByName('ic_close_16px')
        //       });
        //     }

        //     try {
        //       Plugins.installPlugin(url, ({ data }) => {
        //         const res = { icon: null, text: null };
        //         switch (data) {
        //           case 'fucky_wucky':
        //             res.text = 'Failed plugin installation.';
        //             res.icon = Assets.getIDByName('ic_close_16px');
        //             break;
        //           case 'installed_plugin':
        //             res.text = 'Plugin has been installed.';
        //             res.icon = Assets.getIDByName('Check');
        //             break;
        //           case 'overridden_plugin':
        //             res.text = 'Plugin has been overriden.';
        //             res.icon = Assets.getIDByName('Check');
        //             break;
        //         }
    
        //         Toasts.open({ content: res.text, source: res.icon });
        //       });
        //     } catch (e) {
        //       Toasts.open({ content: e.message });
        //     }
        //   }}
        // />
      },
      EnmityThemes: {
        key: 'EnmityThemes',
        title: 'Themes',
        render: () => <Page data={"theme"} />,
        headerRight: () => <HeaderRight 
          data={"theme"}
          onConfirm={(url: string) => {
            if (!url.endsWith('json')) {
              return Toasts.open({
                content: 'Invalid URL for theme',
                source: Assets.getIDByName('ic_close_16px')
              });
            }
  
            try {
              Themes.installTheme(url, ({ data, restart }) => {
                const res = { icon: null, text: null, restart: false };
                switch (data) {
                  case 'fucky_wucky':
                    res.text = 'Failed theme installation.';
                    res.icon = Assets.getIDByName('ic_close_16px');
                    break;
                  case 'installed_theme':
                    res.text = 'Theme has been installed.';
                    res.icon = Assets.getIDByName('Check');
                    res.restart = restart;
                    break;
                  case 'overridden_theme':
                    res.text = 'Theme has been overriden.';
                    res.icon = Assets.getIDByName('Check');
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
            } catch (e) {
              Toasts.open({ content: e.message });
            }
          }}        
        />
      },
      EnmityCustomPage: {
        key: 'EnmityCustomPage',
        title: 'Page',
        render: ({ pageName, pagePanel }: { pageName: string, pagePanel: React.ComponentType }) => {
          const navigation = NavigationNative.useNavigation();
          const Component = pagePanel;

          React.useEffect(() => {
            if (pageName) {
              navigation.setOptions({ title: pageName });
            }
          }, []);

          return <Component />;
        }
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
