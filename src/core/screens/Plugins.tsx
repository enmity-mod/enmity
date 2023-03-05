import { Alert, FlatList, FormRow, FormSwitch, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from '@components';
import { StyleSheet, Clipboard, ColorMap, Constants, Toasts, NavigationNative } from '@metro/common';
import { Plugin } from 'enmity/managers/plugins';
import { connectComponent } from '@api/settings';
import * as Plugins from '@managers/plugins';
import Authors from './partials/Authors';
import { getModule } from '@metro';
import Assets from '@api/assets';
import React from 'react';

const { createThemedStyleSheet } = StyleSheet;
const { ThemeColorMap } = ColorMap;

interface PluginCardProps {
  plugin: Plugin;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const plugins = Plugins.getEnabledPlugins();
  const [enabled, setEnabled] = React.useState(plugins.includes(plugin.name));
  const navigation = NavigationNative.useNavigation();

  const styles = StyleSheet.createThemedStyleSheet({
    container: {
      backgroundColor: ThemeColorMap.BACKGROUND_FLOATING,
      borderRadius: 5,
      borderLeftColor: plugin.color ?? '#524FBF',
      borderLeftWidth: 5,
      marginBottom: 15,
    },
    name: {
      color: ThemeColorMap.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      fontSize: 16,
    },
    version: {
      color: ThemeColorMap.HEADER_SECONDARY,
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
      color: ThemeColorMap.HEADER_SECONDARY,
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
      tintColor: ThemeColorMap.INTERACTIVE_NORMAL
    },
    settingsIcon: {
      width: 22,
      height: 22,
      tintColor: ThemeColorMap.INTERACTIVE_NORMAL
    }
  });

  const Settings = plugin.getSettingsPanel as unknown as React.ComponentType;

  return (
    <View style={styles.container}>
      <View>
        <FormRow
          label={() => <View style={styles.info}>
            <Text
              adjustsFontSizeToFit
              style={styles.name}
            >
              {plugin.name}
            </Text>
            {plugin.version && <Text
              adjustsFontSizeToFit
              style={styles.version}
            >
              {plugin.version} {plugin.authors && 'by'}
            </Text>}
            <Authors authors={plugin.authors} />
          </View>}
          trailing={() => <View style={styles.actions}>
            {Settings && <TouchableOpacity
              style={styles.delete}
              onPress={(): void => {
                navigation.push('EnmityCustomPage', {
                  pageName: plugin.name,
                  pagePanel: connectComponent(Settings, plugin.name)
                });
              }}
            >
              <Image style={styles.settingsIcon} source={Assets.getIDByName('settings')} />
            </TouchableOpacity>}
            <TouchableOpacity
              style={styles.delete}
              onPress={(): void => void Plugins.uninstallPlugin(plugin.name)}
            >
              <Image style={styles.trashIcon} source={Assets.getIDByName('ic_trash_filled_16px')} />
            </TouchableOpacity>
            <FormSwitch
              value={enabled}
              onValueChange={(value): void => {
                setEnabled(value);

                Toasts.open({
                  content: `${plugin.name} has been ${value ? 'enabled' : 'disabled'}.`,
                });

                if (value) {
                  Plugins.enablePlugin(plugin.name);
                } else {
                  Plugins.disablePlugin(plugin.name);
                }
              }}
            />
          </View>}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          {plugin.description ?? 'No description provided.'}
        </Text>
      </View>
    </View>
  );
};

export function HeaderRight() {
  const styles = createThemedStyleSheet({
    header: {
      tintColor: ThemeColorMap.HEADER_PRIMARY,
      marginRight: 15,
      width: 18,
      height: 18
    },
    wrapper: {
      marginRight: 15,
      width: 32,
      height: 32
    }
  });

  return (
    <TouchableOpacity styles={styles.wrapper} onPress={async (): Promise<void> => {
      const clipboard = await Clipboard.getString();

      Alert.prompt(
        'Install a plugin',
        'Please enter the URL of the plugin to install.',
        (url: string) => {
          if (!url.endsWith('js')) {
            return Toasts.open({
              content: 'Invalid URL for plugin',
              source: Assets.getIDByName('ic_close_16px')
            });
          }

          Plugins.installPlugin(url, ({ data }) => {
            const res = { icon: null, text: null };
            switch (data) {
              case 'fucky_wucky':
                res.text = 'Failed plugin installation.';
                res.icon = Assets.getIDByName('ic_close_16px');
                break;
              case 'installed_plugin':
                res.text = 'Plugin has been installed.';
                res.icon = Assets.getIDByName('Check');
                break;
              case 'overridden_plugin':
                res.text = 'Plugin has been overriden.';
                res.icon = Assets.getIDByName('Check');
                break;
            }

            Toasts.open({ content: res.text, source: res.icon });
          });
        },
        undefined,
        clipboard.endsWith('.js') ? clipboard : null
      );
    }}>
      <Image
        style={styles.header}
        source={Assets.getIDByName('add_white')}
      />
    </TouchableOpacity>
  );
}

const Search = getModule(m => m.name === 'StaticSearchBarContainer');

export function Page() {
  const forceUpdate = React.useState(null)[1];
  const [plugins, setPlugins] = React.useState(Plugins.getPlugins().sort((a, b) => a.name.localeCompare(b.name)));
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState(null);

  React.useEffect(() => {
    function onChange() {
      forceUpdate({});
    }

    Plugins.on('installed', onChange);
    Plugins.on('uninstalled', onChange);

    return () => {
      Plugins.off('installed', onChange);
      Plugins.off('uninstalled', onChange);
    };
  }, []);

  const entities = search ? plugins.filter(p => {
    if (p.name.toLowerCase().includes(search.toLowerCase())) {
      return true;
    };

    if (p.description?.toLowerCase().includes(search.toLowerCase())) {
      return true;
    };

    if ((p.authors as any[])?.find?.(a => (a.name ?? a).toLowerCase().includes(search.toLowerCase()))) {
      return true;
    };

    return false;
  }) : plugins;

  const styles = createThemedStyleSheet({
    container: {
      flex: 1,
      padding: 5
    },
    notFound: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: '50%'
    },
    notFoundText: {
      marginTop: 10,
      color: ThemeColorMap.TEXT_MUTED,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      textAlign: 'center'
    },
    search: {
      margin: 0,
      marginBottom: 0,
      paddingBottom: 5,
      paddingRight: 10,
      paddingLeft: 10,
      backgroundColor: 'none',
      borderBottomWidth: 0,
      background: 'none'
    }
  });

  return (<>
    <Search
      style={styles.search}
      placeholder='Search plugins...'
      onChangeText={v => setSearch(v)}
    />
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={(): void => {
              setRefreshing(true);
              setPlugins(Plugins.getPlugins());
              setRefreshing(false);
            }}
          />
        }
      >
        {!entities.length ?
          search ?
            <View style={styles.notFound}>
              <Image source={Assets.getIDByName('img_no_results_dark')} />
              <Text style={styles.notFoundText}>
                We searched far and wide.
              </Text>
              <Text style={{ ...styles.notFoundText, marginTop: 0 }}>
                Unfortunately, no results were found.
              </Text>
            </View>
            :
            <View style={styles.notFound}>
              <Image source={Assets.getIDByName('img_connection_empty_dark')} />
              <Text style={styles.notFoundText}>
                You don't have any plugins.
              </Text>
              <Text style={{ ...styles.notFoundText, marginTop: 0 }}>
                Install some by clicking the + icon!
              </Text>
            </View>
          : <FlatList
            data={entities}
            renderItem={({ item }) => <PluginCard plugin={item} />}
            keyExtractor={plugin => plugin.name}
          />
        }
      </ScrollView>
    </View>
  </>);
};
