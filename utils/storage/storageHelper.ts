import * as FileSystem from "expo-file-system/legacy";
import Constants from "expo-constants";

/* -------------------- BASE PATH -------------------- */

const BASE_DIR = FileSystem.documentDirectory!;

const getPath = (fileName: string) => BASE_DIR + fileName;

/* -------------------- READ JSON -------------------- */

export async function readJSON<T>(
  fileName: string,
  defaultValue: T
): Promise<T> {
  try {
    const path = getPath(fileName);
    const info = await FileSystem.getInfoAsync(path);

    if (!info.exists) {
      await FileSystem.writeAsStringAsync(
        path,
        JSON.stringify(defaultValue)
      );
      return defaultValue;
    }

    const content = await FileSystem.readAsStringAsync(path);
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return defaultValue;
  }
}

/* -------------------- WRITE JSON -------------------- */

export async function writeJSON<T>(
  fileName: string,
  data: T
): Promise<void> {
  try {
    const path = getPath(fileName);
    await FileSystem.writeAsStringAsync(
      path,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
  }
}
