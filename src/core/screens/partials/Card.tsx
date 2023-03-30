import { Plugin } from 'enmity/managers/plugins';
import { Theme } from 'enmity/managers/themes';
import { NavigationNative, React, StyleSheet, ColorMap, Constants, Toasts, Dialog } from '@metro/common';
import { FormRow, View, Text, TouchableOpacity, Image, FormSwitch } from '@components';
import Authors from './Authors';
import { connectComponent } from '@api/settings';
import * as Plugins from "@managers/plugins"
import * as Themes from "@managers/themes"
import { reload } from '@api/native';
import { getIDByName } from '@api/assets';

const { colors } = ColorMap;
const styles = StyleSheet.createThemedStyleSheet({
    container: {
      backgroundColor: colors.BACKGROUND_FLOATING,
      borderRadius: 5,
      borderLeftWidth: 5,
      marginBottom: 15,
    },
    name: {
      color: colors.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      fontSize: 16,
    },
    version: {
      color: colors.HEADER_SECONDARY,
      fontSize: 16,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      marginLeft: 2.5,
      marginRight: 2.5
    },
    content: {
      height: 'auto',
      paddingBottom: 10,
      paddingLeft: 10,
      paddingRight: 10
    },
    actions: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
      alignItems: 'center'
    },
    description: {
      color: colors.HEADER_SECONDARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
    },
    info: {
      marginLeft: -6,
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      width: '100%'
    },
    delete: {
      marginRight: 7.5
    },
    trashIcon: {
      width: 22,
      height: 22,
      tintColor: colors.INTERACTIVE_NORMAL
    },
    settingsIcon: {
      width: 22,
      height: 22,
      tintColor: colors.INTERACTIVE_NORMAL
    }
});

export function Card({ data }: { data: Plugin | Theme }) {
    const [enabled, setEnabled] = React.useState(data["getSettingsPanel"] 
        ? Plugins?.getEnabledPlugins()?.includes(data.name)
        : Themes?.getTheme() === data.name)
    const navigation = NavigationNative?.useNavigation();
    const Settings = data["getSettingsPanel"] 
        ? data["getSettingsPanel"] as unknown as React.ComponentType 
        : undefined;

    return (
      <View style={[styles.container, { borderLeftColor: data?.color ?? '#524FBF' }]}>
        <View>
          <FormRow
            label={() => <View style={styles.info}>
              <Text
                adjustsFontSizeToFit
                style={styles.name}
              >
                {data.name}
              </Text>
              {data.version && <Text
                adjustsFontSizeToFit
                style={styles.version}
              >
                {data.version}
              </Text>}
              {data.authors && <Text style={styles.version}>by</Text>}
              <Authors authors={data.authors} />
            </View>}
            trailing={() => {
                try {
                    return <View style={styles.actions}>
                        {Settings && <TouchableOpacity
                            style={styles.delete}
                            onPress={(): void => {
                            navigation?.push('EnmityCustomPage', {
                                pageName: data.name,
                                pagePanel: connectComponent?.(Settings, data.name)
                            });
                            }}
                        >
                            <Image style={styles.settingsIcon} source={getIDByName('settings')} />
                        </TouchableOpacity>}
                        <TouchableOpacity
                            style={styles.delete}
                            onPress={(): void => void (data["getSettingsPanel"] 
                                ? Plugins?.uninstallPlugin(data.name) 
                                : Themes?.uninstallTheme(data.name))}
                        >
                            <Image style={styles.trashIcon} source={getIDByName('ic_trash_filled_16px')} />
                        </TouchableOpacity>
                        <FormSwitch
                            value={enabled}
                            onValueChange={(value: boolean): void => {
                                setEnabled(value);
                
                                const showThemeDialog = () => Dialog?.show({
                                    title: `Theme ${value ? "Enabled" : "Disabled"}`,
                                    body: `${value ? "Enabling" : "Disabling"} a theme requires a restart, would you like to restart Discord to ${value ? "apply" : "remove"} the theme?`,
                                    confirmText: 'Yes',
                                    cancelText: 'No',
                                    onConfirm: reload,
                                    onCancel: setEnabled((previous: boolean) => !previous)
                                });

                                Toasts.open({
                                    content: `${data.name} has been ${value ? 'enabled' : 'disabled'}.`,
                                });
                
                                if (value) {
                                    data["getSettingsPanel"] 
                                        ? Plugins.enablePlugin(data.name) 
                                        : Themes.applyTheme(data.name);
                                } else {
                                    data["getSettingsPanel"] 
                                        ? Plugins.disablePlugin(data.name) 
                                        : Themes.removeTheme();
                                }

                                !data["getSettingsPanel"] && showThemeDialog()
                            }}
                        />
                    </View>
                } catch (e) {
                    console.log("A " + e + " has occured")
                }
            }}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.description}>
            {data.description ?? 'No description provided.'}
          </Text>
        </View>
      </View>
    );
  };