import {
  Alert,
  Button,
  Form,
  FormRow,
  FormSwitch,
  React,
  Text,
  TouchableOpacity,
  View,
  useEffect,
  useState,
} from '../api/react';
import { disablePlugin, enablePlugin, getEnabledPlugins, getPlugins, installPlugin, uninstallPlugin } from '../api/plugins';
import * as Modules from '../utils/modules';
import { sendCommand } from '../utils/native';
import { showToast } from '../api/toast';

import { Plugin } from 'enmity-api/plugins';

const Navigation = Modules.common.navigation;
const NavigationNative = Modules.common.navigationNative;
const NavigationStack = Modules.common.navigationStack;
const StyleSheet = Modules.common.stylesheet;
const ColorMap = Modules.common.colorMap;

const { NavigationContainer } = NavigationNative;
const { createStackNavigator } = NavigationStack;
const { createThemedStyleSheet } = StyleSheet;
const { ThemeColorMap } = ColorMap;

const navbarStyle = createThemedStyleSheet({
  container: {
    backgroundColor: ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    flex: 1,
  },
  cardStyle: {
    backgroundColor: 'transparent',
  },
  header: {
    backgroundColor: ThemeColorMap.BACKGROUND_MOBILE_SECONDARY,
    shadowColor: 'transparent',
    elevation: 0,
  },
  headerTitleContainer: {
    color: ThemeColorMap.HEADER_PRIMARY,
  },
});

const cardStyle = createThemedStyleSheet({
  cardContainer: {
    padding: 15,
    width: '100%',
    flex: 1,
    flexDirection: 'column',
  },

  cardHeader: {
    height: 45,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: ThemeColorMap.BACKGROUND_SECONDARY_ALT,
  },

  cardBody: {
    padding: 5,
    backgroundColor: ThemeColorMap.BACKGROUND_SECONDARY,
  },

  text: {
    color: ThemeColorMap.TEXT_DANGER,
  },
});

interface PluginCardProps {
  plugin: Plugin;
  removePlugin: (name: string) => void;
}

const PluginCard = ({ plugin, removePlugin }: PluginCardProps): void => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const isEnabled = getEnabledPlugins().includes(plugin.name);
    setEnabled(isEnabled);
  }, []);

  return (
    <View style={cardStyle.cardContainer}>
      <View style={cardStyle.cardHeader}>
        <FormRow
          label={plugin.name}
          trailing={
            <TouchableOpacity
              onPress={(): void => {
                uninstallPlugin(plugin.name, data => {
                  showToast({
                    content: `${plugin.name} has been uninstalled.`,
                  });

                  removePlugin(plugin.name);
                });
              }}
            >
              <Text style={cardStyle.text}>Uninstall</Text>
            </TouchableOpacity>
          }
        />
      </View>
      <View style={cardStyle.cardBody}>
        <FormRow
          label="Enabled"
          trailing={
            <FormSwitch
              value={enabled}
              onValueChange={(value): void => {
                setEnabled(value);
                showToast({
                  content: `${plugin.name} has been ${value ? 'enabled' : 'disabled'}.`,
                });
                if (value) {
                  enablePlugin(plugin.name);
                } else {
                  disablePlugin(plugin.name);
                }
              }}
            />
          }
        />
      </View>
    </View>
  );
};

const PluginsScreen = (): void => {
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    setPlugins(getPlugins);
  }, []);

  const removePlugin = (pluginName): void => {
    setPlugins(plugins.filter(plugin => plugin.name !== pluginName));
  };

  return (<View style={{
    flex: 1,
  }}>
    <Form>
      {plugins.map(plugin => <PluginCard plugin={plugin} removePlugin={removePlugin} />)}
    </Form>
  </View>);
};

const Stack = createStackNavigator();

export const PluginPage = (): void => (
  <NavigationContainer>
    <Stack.Navigator
      style={navbarStyle.container}
      screenOptions={{
        cardOverlayEnabled: !1,
        cardShadowEnabled: !1,
        cardStyle: navbarStyle.cardStyle,
        headerStyle: navbarStyle.header,
        headerTitleContainerStyle: navbarStyle.headerTitleContainer,
        headerTitleAlign: 'center',
        safeAreaInsets: {
          top: 0,
        },
      }}
    >
      <Stack.Screen
        name="Plugins"
        component={PluginsScreen}
        options={{
          headerTitleStyle: {
            color: 'white',
          },
          headerLeft: (): void => (<Button
            color="#fff"
            title="Close"
            onPress={(): void => Navigation.pop()}
          />),
          headerRight: (): void => (<Button
            color="#fff"
            title="Add"
            onPress={(): void => {
              Alert.prompt(
                'Install a plugin',
                'Please enter the URL of the plugin to install.',
                (url: string) => {
                  installPlugin(url, data => {
                    showToast({
                      content: `Plugin has been installed. Please reload Discord.`,
                    });
                  });
                },
              );
            }}
          />),
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
