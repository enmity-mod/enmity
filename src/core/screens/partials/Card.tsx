import { Plugin } from 'enmity/managers/plugins';
import { Theme } from 'enmity/managers/themes';
import { NavigationNative, React, StyleSheet, Constants, Toasts, Dialog, Navigation } from '@metro/common';
import { FormRow, View, Text, TouchableOpacity, Image, FormSwitch } from '@components';
import Authors from './Authors';
import { connectComponent } from '@api/settings';
import * as Plugins from "@managers/plugins"
import * as Themes from "@managers/themes"
import { reload } from '@api/native';
import { getIDByName } from '@api/assets';
import { isTablet } from "./modules";

const { Fonts, ThemeColorMap } = Constants;
// @ts-expect-error displayName property no longer exists on Theme
const getThemeName = (theme: Theme) => theme.displayName ?? theme.name
const styles = StyleSheet.createThemedStyleSheet({
    container: {
      backgroundColor: ThemeColorMap.BACKGROUND_FLOATING,
      borderRadius: 5,
      borderLeftWidth: 5,
      marginBottom: 15,
    },
    name: {
      color: ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Fonts.PRIMARY_SEMIBOLD,
      fontSize: 16,
    },
    version: {
      color: ThemeColorMap.HEADER_SECONDARY,
      fontSize: 16,
      fontFamily: Fonts.PRIMARY_SEMIBOLD,
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
      color: ThemeColorMap.HEADER_SECONDARY,
      fontFamily: Fonts.PRIMARY_SEMIBOLD,
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
      tintColor: ThemeColorMap.INTERACTIVE_NORMAL
    },
    settingsIcon: {
      width: 22,
      height: 22,
      tintColor: ThemeColorMap.INTERACTIVE_NORMAL
    }
});

export function Card({ data, type }: { data: Plugin | Theme, type: "plugin" | "theme" }) {
    const [enabled, setEnabled] = React.useState(type === "plugin"
        ? Plugins?.getEnabledPlugins()?.includes(data.name)
        : Themes?.getTheme() === data.name)
    const navigation = NavigationNative?.useNavigation();
    const dataName = type === "theme" ? getThemeName(data as Theme) : data.name
    const Settings = type === "plugin"
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
                {/* If the data type is a theme and the theme has a "displayName", then display that. */}
                {/* In all other circumstances, display the "name" property instead. */}
                {dataName}
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
                        {Settings && enabled && <TouchableOpacity
                            style={styles.delete}
                            onPress={(): void => {
                                navigation?.push?.('EnmityCustomPage', {
                                    pageName: data.name,
                                    pagePanel: connectComponent?.(Settings, data.name)
                                });
                            }}
                        >
                            <Image style={styles.settingsIcon} source={getIDByName('settings')} />
                        </TouchableOpacity>}
                        <TouchableOpacity
                            style={styles.delete}
                            onPress={() => {
                              isTablet() && Navigation.pop();

                              const uninstallData = () => (type === "plugin"
                                ? Plugins.uninstallPlugin
                                : Themes.uninstallTheme)(data.name, (res) => {
                                  const outcomes = {
                                    fucky_wucky: {
                                      content: `Invalid ${type}`,
                                      source: getIDByName('ic_close_16px')
                                    },
                                    [`uninstalled_${type}`]: {
                                      content: `${dataName} has been uninstalled.`,
                                      source: getIDByName('Check')
                                    }
                                  }

                                  if (!Object.keys(outcomes).includes(res)) return console.log(`Uninstall returned early with outcome: ${res}`);
                                  Toasts.open(outcomes[res]);
                                })

                                isTablet() ? setTimeout(uninstallData) : uninstallData();
                            }}
                        >
                            <Image style={styles.trashIcon} source={getIDByName('ic_trash_filled_16px')} />
                        </TouchableOpacity>
                        <FormSwitch
                            value={enabled}
                            onValueChange={(value: boolean): void => {
                                const oldTheme = Themes.getTheme();

                                setEnabled(value);
                                Toasts.open({
                                    content: `${dataName} has been ${value ? 'enabled' : 'disabled'}.`,
                                });
                
                                if (value) {
                                    type === "plugin"
                                        ? Plugins.enablePlugin(data.name) 
                                        : Themes.applyTheme(data.name);
                                } else {
                                    type === "plugin"
                                        ? Plugins.disablePlugin(data.name) 
                                        : Themes.removeTheme();
                                }

                                type === "theme" && Dialog?.show({
                                    title: `Theme ${value ? "Enabled" : "Disabled"}`,
                                    body: `${value ? "Enabling" : "Disabling"} a theme requires a restart, would you like to restart Discord to ${value ? "apply" : "remove"} the theme?`,
                                    confirmText: 'Restart',
                                    cancelText: 'Later',
                                    onConfirm: reload,
                                    onCancel: () => {
                                        setEnabled((previous: boolean) => !previous)
                                        Themes.applyTheme(oldTheme);
                                    }
                                });
                            }}
                        />
                    </View>
                } catch (e) {
                    console.log("An exception has been raised: " + e);
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