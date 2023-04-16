import { getIDByName } from "@api/assets";
import { TouchableOpacity, Text, View, FormInput, Image } from "@components";
import { StyleSheet, Clipboard, Dialog, Constants, React, Toasts, Navigation } from "@metro/common";
import * as Plugins from "@managers/plugins";
import * as Themes from "@managers/themes";
import { reload } from "@api/native";
import { getByProps } from "@metro";

const { Fonts, ThemeColorMap } = Constants;
const { isTablet } = getByProps("isTablet", "getDevice");
const styles = StyleSheet.createThemedStyleSheet?.({
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
    },
    text: {
        fontFamily: Fonts.DISPLAY_BOLD,
        color: ThemeColorMap.TEXT_NORMAL,
        opacity: 0.975,
        letterSpacing: 0.25,
        fontSize: 16,
        paddingTop: 10, 
        marginLeft: 0
    }
});

const showAlert = ({ type, url }: { type: string, url: string }) => {
    if (!url?.endsWith(type === "plugin" ? ".js" : ".json")) url = "";

    Dialog?.show({
        title: `Install ${type}`,
        children: <>
            <Text style={styles.text}>
                Paste {type} URL here:
            </Text>
            <View style={{
                paddingHorizontal: 0,
                paddingVertical: -5,
                marginTop: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "rgba(120, 120, 120, 0.3)",
            }}>
                <View style={{ marginBottom: -25 }} />
                <FormInput
                    placeholder={type === "plugin"
                        ? "https://github.com/discord-modifications/enmity-addons/blob/main/Plugins/ShowHiddenChannels/dist/ShowHiddenChannels.js"
                        : "https://raw.githubusercontent.com/discord-modifications/enmity-addons/main/Themes/AMOLED.json"}
                    value={url ?? ""}
                    onChangeText={(value: string) => {
                        url = value 
                    }}
                    autoFocus={true}
                    showBorder={true}
                    inputMode={"url"}
                />
            </View>
        </>,
        confirmText: "Install",
        cancelText: "Cancel",
        onConfirm: () => {
            if (!url?.endsWith(type === "plugin" ? 'js' : 'json')) {
                return Toasts.open({
                    content: `Invalid URL for ${type}`,
                    source: getIDByName('ic_close_16px')
                });
            }

            isTablet() && Navigation.pop();
      
            try {
              (type === "plugin"
                ? Plugins.installPlugin
                : Themes.installTheme)(url, ({ data: res, restart, name }) => {
                    const outcomes = {
                        fucky_wucky: {
                            content: `Failed ${type} installation of ${name}.`,
                            source: getIDByName('ic_close_16px'),
                            restart: false
                        },
                        [`installed_${type}`]: {
                            content: `${name} has been installed.`,
                            source: getIDByName('Check'),
                            restart
                        },
                        [`overridden_${type}`]: {
                            content: `${name} has been overriden.`,
                            source: getIDByName('Check'),
                            restart
                        }
                    }

                    const { restart: shouldRestart, ...rest } = outcomes[res];
                    Toasts.open(rest);

                    if (shouldRestart) {
                        Dialog.show({
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
        }
    })
}

export default function ({ type }: { type: "plugin" | "theme" }) {
    return (
      <TouchableOpacity styles={styles.wrapper} onPress={async function() {  
        showAlert({ 
            type, 
            url: await Clipboard?.getString?.()
        })
      }}>
        <Image
          style={styles.header}
          source={getIDByName('add_white')}
        />
      </TouchableOpacity>
    );
};