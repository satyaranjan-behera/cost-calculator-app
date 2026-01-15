import * as FileSystem from "expo-file-system/legacy";
import { getInfoAsync } from "expo-file-system/legacy";

const FILE_PATH = FileSystem.documentDirectory + "t&c.json";

const defaultTnC ={
    generalterm : "Default General Terms...",
    termsOfService: "Default Terms of Service...",
    privacyPolicy: "Default Privacy Policy...",
};

export const initialTnCFile = async () => {
    const fileInfo = await getInfoAsync(FILE_PATH);

    if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(
            FILE_PATH,
            JSON.stringify(defaultTnC)
        );
    }
};

export const getTnC = async () => {
    await initialTnCFile();
    const data = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(data);
};

export const saveTnC = async (tnc: any) => {
    await FileSystem.writeAsStringAsync(
        FILE_PATH,
        JSON.stringify(tnc)
    );
};