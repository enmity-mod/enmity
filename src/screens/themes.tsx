import {
  Alert,
  Button,
  Form,
  FormCTAButton,
  FormRow,
  FormSwitch,
  React,
  Text,
  TouchableOpacity,
  View,
  useEffect,
  useState,
} from '../api/react';
import { applyTheme, getTheme, listThemes, removeTheme } from '../api/themes';
import { installTheme, uninstallTheme } from '../utils/themes';
import { getModule } from '../utils/modules';
import { showDialog } from '../api/dialog';
import { showToast } from '../api/toast';

const navigationModule = getModule(m => m.default?.pushLazy);
const reactNavigationNative = getModule(m => m.NavigationContainer);
const reactNavigationStack = getModule(m => m.createStackNavigator);
const themedStylesheet = getModule(m => m.createThemedStyleSheet);
const colorMap = getModule(m => m.ThemeColorMap);

const { NavigationContainer } = reactNavigationNative;
const { createStackNavigator } = reactNavigationStack;
const { createThemedStyleSheet } = themedStylesheet;
const { ThemeColorMap } = colorMap;

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
            showDialog({ title: 'Theme has been applied, please restart Discord to apply the new theme.' });
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
              showDialog({ title: 'Theme has been removed, please restart Discord to remove the theme.' });
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
            onPress={(): void => navigationModule.default.pop()}
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
