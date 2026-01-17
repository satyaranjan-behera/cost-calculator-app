import * as FileSystem from "expo-file-system/legacy";

/**
 * Convert local file URI to base64 (for expo-print PDF)
 */
export const toBase64 = async (uri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: "base64",
    });

    const ext = uri.split(".").pop()?.toLowerCase();
    const mime =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : "image/png";

    return `data:${mime};base64,${base64}`;
  } catch (err) {
    console.error("Base64 conversion failed", err);
    return "";
  }
};
