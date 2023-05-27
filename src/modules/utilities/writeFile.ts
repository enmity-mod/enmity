import { getByProps } from "@metro";

const { NativeModules, Platform } = getByProps("Text", "View");
const FileManager = NativeModules.DCDFileManager ?? NativeModules.RTNFileManager;

export default async function writeFile(name: string, content: string) {
    if (!FileManager) return;

    const dynamicFilePath = Platform.select({
        default: (file: string) => file,
        ios: (file: string) => FileManager.saveFileToGallery ? file : `Documents/${file}`
    })

    await FileManager.writeFile("documents", dynamicFilePath(name), content, "utf8");
}