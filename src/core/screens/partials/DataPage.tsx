import { RefreshControl, ScrollView, View, Image, Text, FlatList } from "@components";
import { getModule } from "@metro";
import { Assets, ColorMap, Constants, React, StyleSheet } from "@metro/common";
import { Plugin } from "enmity/managers/plugins";
import { Theme } from "enmity/managers/themes";
import * as Plugins from "@managers/plugins";
import * as Themes from "@managers/themes";
import { Card } from "./Card";

const { colors } = ColorMap;
const { createThemedStyleSheet } = StyleSheet;
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

const Search = getModule(m => m.name === 'StaticSearchBarContainer');

export default function Page({ data }: { data: "plugin" | "theme" }) {
  const isPlugin = data === "plugin"

  const forceUpdate = React.useState(null)[1];
  const [entries, setEntries] = React.useState(
    (isPlugin
        ? Plugins.getPlugins() 
        : Themes.listThemes()).sort((a, b) => a.name.localeCompare(b.name)));
  const [refreshing, setRefreshing] = React.useState(false);
  const [search, setSearch] = React.useState(null);

  React.useEffect(() => {
    function onChange() {
      forceUpdate({});
    }

    (isPlugin ? Plugins : Themes).on('installed', onChange);
    (isPlugin ? Plugins : Themes).on('uninstalled', onChange);

    return () => {
      (isPlugin ? Plugins : Themes).off('installed', onChange);
      (isPlugin ? Plugins : Themes).off('uninstalled', onChange);
    };
  }, []);

  const entities = search ? (entries as any[])?.filter(p => {
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
  }) : entries;

  return (<>
    <Search
      style={styles.search}
      placeholder={`Search ${isPlugin ? "Plugins" : "Themes"}...`}
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
              setEntries(isPlugin ? Plugins.getPlugins() : Themes.listThemes());
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
            renderItem={({ item }) => <Card data={item} />}
            keyExtractor={plugin => plugin.name}
          />
        }
      </ScrollView>
    </View>
  </>);
};