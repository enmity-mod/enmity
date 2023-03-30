import { getIDByName } from "@api/assets";
import { TouchableOpacity, Text, View, FormInput, Image } from "@components";
import { ColorMap, StyleSheet, Clipboard, Dialog, Constants, React } from "@metro/common";

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

const showAlert = ({ data, url, state, onConfirm }: { data: string, url: string, state: { getter: any, setter: any }, onConfirm: () => any }) => {
    if (!url?.endsWith(data === "plugin" ? ".js" : ".json")) url = "";

    Dialog?.show({
        title: `Install ${data}`,
        children: <>
            <Text style={styles.text}>
                Paste {data} URL here:
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
                    placeholder={data === "plugin"
                        ? "https://github.com/discord-modifications/enmity-addons/blob/main/Plugins/ShowHiddenChannels/dist/ShowHiddenChannels.js"
                        : "https://raw.githubusercontent.com/discord-modifications/enmity-addons/main/Themes/AMOLED.json"}
                    value={url ?? state?.getter}
                    onChange={(value: string) => state?.setter?.(value)}
                    autoFocus={true}
                    showBorder={true}
                    multiline={true}
                    numberOfLines={1}
                />
            </View>
        </>,
        confirmText: "Install",
        cancelText: "Cancel",
        onConfirm
    })
}

export default function ({ data, onConfirm }: { data: "plugin" | "theme", onConfirm: (url: string) => void }) {
    const [dataUrl, setDataUrl] = React.useState("");

    return (
      <TouchableOpacity styles={styles.wrapper} onPress={async function() {  
        showAlert?.({ 
            data, 
            url: await Clipboard?.getString?.(),
            state: {
                getter: dataUrl,
                setter: setDataUrl
            },
            onConfirm: () => onConfirm(dataUrl),
        })
      }}>
        <Image
          style={styles.header}
          source={getIDByName('add_white')}
        />
      </TouchableOpacity>
    );
  }