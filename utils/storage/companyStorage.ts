import * as FileSystem from "expo-file-system/legacy";
import { getInfoAsync } from "expo-file-system/legacy";

const FILE_PATH = FileSystem.documentDirectory + "company.json";

const defaultCompany = {
    companyName: "my business",
    address: "123 Main St, City, Country",
    phone: "+1234567890",
    email: "company@gmail.com",
    logo:" ",

};

export const initialCompanyFile = async () => {
    const fileInfo = await getInfoAsync(FILE_PATH);

    if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(
            FILE_PATH,
            JSON.stringify(defaultCompany)
        );
    }
};

export const getCompany = async () => {
    await initialCompanyFile();
    const data = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(data);
};

export const saveCompany = async (company: any) => {
    await FileSystem.writeAsStringAsync(
        FILE_PATH,
        JSON.stringify(company)
    );
};