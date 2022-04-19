import * as Modules from '../utils/modules';
import {
  Alert,
  Button,
  Form,
  FormRow,
  React,
  Text,
  TouchableOpacity,
  View,
  useEffect,
  useState,
} from '../api/react';
import { applyTheme, getTheme, listThemes, removeTheme } from '../api/themes';
import { installTheme, uninstallTheme } from '../utils/themes';
import { reloadDiscord } from '../api/native';
import { showDialog } from '../api/dialog';
import { showToast } from '../api/toast';

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

interface ThemeCardProps {
  theme: string;
  deleteTheme: (name: string) => void;
}

const ThemeCard = ({ theme, deleteTheme }: ThemeCardProps): void => (
  <View style={cardStyle.cardContainer}>
    <View style={cardStyle.cardHeader}>
      <FormRow
        label={theme}
        trailing={
          <TouchableOpacity
            onPress={(): void => {
              uninstallTheme(theme, data => {
                showToast({
                  content: data,
                });

                deleteTheme(theme);
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
        label="Apply"
        onPress={(): void => {
          applyTheme(theme, data => {
            showDialog({
              title: 'Theme Applied',
              body: 'Applying a theme requires a restart, would you like to restart Discord to apply the new theme?',
              confirmText: 'Yes',
              cancelText: 'No',
              onConfirm: reloadDiscord,
            });
          });
        }}
      />
    </View>
  </View>
);

const ThemesScreen = (): void => {
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    setThemes(listThemes());
  }, []);

  const deleteTheme = (name): void => {
    if (getTheme() === name) {
      removeTheme();
    }

    setThemes(themes.filter(theme => theme !== name));
  };

  return (<View style={{
    flex: 1,
  }}>
    <Form>
      {getTheme() !== '' &&
        <FormRow
          label="Remove applied theme"
          onPress={(): void => {
            removeTheme().then(() => {
              showDialog({
                title: 'Theme Removed',
                body: 'Removing the applied theme requires a restart, would you like to restart Discord to remove the applied theme?',
                confirmText: 'Yes',
                cancelText: 'No',
                onConfirm: reloadDiscord,
              });
            });
          }}
        />
      }
      {themes.map(theme => <ThemeCard theme={theme} deleteTheme={deleteTheme} />)}
    </Form>
  </View>);
};

const Stack = createStackNavigator();

export const ThemePage = (): void => (
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
        name="Themes"
        component={ThemesScreen}
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
                'Install a theme',
                'Please enter the URL of the theme to install.',
                (url: string) => {
                  if (!url.includes('json')) {
                    showToast({
                      content: 'Invalid url for theme.',
                    });
                    return;
                  }

                  installTheme(url, data => {
                    showToast({
                      content: data,
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
