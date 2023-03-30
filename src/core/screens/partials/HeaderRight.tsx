import { getIDByName } from "@api/assets";
import { TouchableOpacity, Text, View, FormInput, Image } from "@components";
import { ColorMap, StyleSheet, Clipboard, Dialog, Constants, React, Toasts } from "@metro/common";
import * as Plugins from "@managers/plugins";
import * as Themes from "@managers/themes";
import { reload } from "@api/native";

const { colors } = ColorMap;
const { createThemedStyleSheet } = StyleSheet;

const styles = createThemedStyleSheet?.({
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
    },
    text: {
        fontFamily: Constants.Fonts.DISPLAY_BOLD,
        color: Constants.ThemeColorMap.TEXT_NORMAL,
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
      
            try {
              (type === "plugin"
                ? Plugins.installPlugin
                : Themes.installTheme)(url, ({ data, restart } /* <- restart will be undefined when its a plugin which is falsey, so this is fine */) => {
                const res = { icon: null, text: null, restart: false };

                switch (data) {
                    case 'fucky_wucky':
                        res.text = `Failed ${data} installation.`;
                        res.icon = getIDByName('ic_close_16px');
                        break;
                    case `installed_${data}`:
                        res.text = `${data === "plugin" ? "Plugin" : "Theme"} has been installed.`;
                        res.icon = getIDByName('Check');
                        res.restart = restart;
                        break;
                    case `overridden_${data}`:
                        res.text = `${data === "plugin" ? "Plugin" : "Theme"} has been overriden.`;
                        res.icon = getIDByName('Check');
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
        }
    })
}

export default function ({ data }: { data: "plugin" | "theme" }) {
    return (
      <TouchableOpacity styles={styles.wrapper} onPress={async function() {  
        showAlert({ 
            type: data, 
            url: await Clipboard?.getString?.(),
        })
      }}>
        <Image
          style={styles.header}
          source={getIDByName('add_white')}
        />
      </TouchableOpacity>
    );
  }