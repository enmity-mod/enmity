import { Alert, FlatList, FormRow, FormSwitch, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from '@components';
import { Dialog, Clipboard, StyleSheet, ColorMap, Constants, Toasts } from '@metro/common';
import * as Themes from '@managers/themes';
import Authors from './partials/Authors';
import { reload } from '@api/native';
import { getModule } from '@metro';
import Assets from '@api/assets';
import React from 'react';

const { createThemedStyleSheet } = StyleSheet;
const { colors } = ColorMap;

interface ThemeCardProps {
  theme: any;
}

export function ThemeCard({ theme }: ThemeCardProps) {
  const currentTheme = Themes.getTheme();
  const [enabled, setEnabled] = React.useState(currentTheme === theme.name);

  const styles = StyleSheet.createThemedStyleSheet({
    container: {
      backgroundColor: colors.BACKGROUND_FLOATING,
      borderRadius: 5,
      borderLeftColor: theme.color ?? '#524FBF',
      borderLeftWidth: 5,
      marginBottom: 15,
    },
    name: {
      color: colors.HEADER_PRIMARY,
      fontFamily: Constants.Fonts.PRIMARY_SEMIBOLD,
      fontSize: 16
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
    }
  });

  return (
    <View style={styles.container}>
      <View>
        <FormRow
          label={() => <View style={styles.info}>
            <Text
              adjustsFontSizeToFit
              style={styles.name}
            >
              {theme.name}
            </Text>
            {theme.version && <Text
              adjustsFontSizeToFit
              style={styles.version}
            >
              {theme.version} {theme.authors && 'by'}
            </Text>}
            <Authors authors={theme.authors} />
          </View>}
          trailing={() => <View style={styles.actions}>
            <TouchableOpacity
              style={styles.delete}
              onPress={(): void => {
                Themes.uninstallTheme(theme.name, () => {
                  if (enabled) Dialog.show({
                    title: 'Theme Uninstalled',
                    body: 'Uninstalling the theme you previously had applied requires a restart, would you like to restart Discord to remove the theme?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    onConfirm: reload,
                  });
                });
              }}
            >
              <Image style={styles.trashIcon} source={Assets.getIDByName('ic_trash_filled_16px')} />
            </TouchableOpacity>
            <FormSwitch
              value={enabled}
              onValueChange={(value): void => {
                setEnabled(value);

                Toasts.open({
                  content: `${theme.name} has been ${value ? 'enabled' : 'disabled'}.`,
                });

                if (value) {
                  Themes.applyTheme(theme.name);
                  Dialog.show({
                    title: 'Theme Applied',
                    body: 'Applying a theme requires a restart, would you like to restart Discord to apply the theme?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    onConfirm: reload,
                  });
                } else {
                  Themes.removeTheme();
                  Dialog.show({
                    title: 'Theme Removed',
                    body: 'Removing the applied theme requires a restart, would you like to restart Discord to remove the applied theme?',
                    confirmText: 'Yes',
                    cancelText: 'No',
                    onConfirm: reload,
                  });
                }
              }}
            />
          </View>}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.description}>
          {theme.description ?? 'No description provided.'}
        </Text>
      </View>
    </View>
  );
};

export function HeaderRight() {
  const styles = createThemedStyleSheet({
    header: {
      tintColor: colors.HEADER_PRIMARY,
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
        'Install a theme',
        'Please enter the URL of a theme to install.',
        (url: string) => {
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
  const [themes, setThemes] = React.useState(Themes.listThemes().sort((a, b) => a.name.localeCompare(b.name)));
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState(null);

  React.useEffect(() => {
    function onChange() {
      forceUpdate({});
    }

    Themes.on('installed', onChange);
    Themes.on('uninstalled', onChange);

    return () => {
      Themes.off('installed', onChange);
      Themes.off('uninstalled', onChange);
    };
  }, []);

  const entities = search ? themes.filter(p => {
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
  }) : themes;

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
      color: colors.TEXT_MUTED,
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
      placeholder='Search themes...'
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
              setThemes(Themes.listThemes());
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
                You don't have any themes.
              </Text>
              <Text style={{ ...styles.notFoundText, marginTop: 0 }}>
                Install some by clicking the + icon!
              </Text>
            </View>
          : <FlatList
            data={entities}
            renderItem={({ item }) => <ThemeCard theme={item} />}
            keyExtractor={theme => theme.name}
          />
        }
      </ScrollView>
    </View>
  </>);
};
