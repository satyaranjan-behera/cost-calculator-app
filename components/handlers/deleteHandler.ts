import { Alert } from "react-native";

type DeleteHandlerParams<T> = {
    title: string;
    message: string;
    data: T[];
    setData: (data: T[]) => void;
    saveFn: (data: T[]) => Promise<void>;
    id: string;
};

export const confirmDelete = <T>({
    title,
    message,
    data,
    setData,
    saveFn,
    id,
}: DeleteHandlerParams<T>) => {
    Alert.alert(title, message, [
        { text: "No", style: "cancel" },
        {
            text: "Yes",
            style: "destructive",
            onPress: async () => {
                const updated = data.filter((item: any) => item.id !== id);
                setData(updated);
                await saveFn(updated);
            },
        },
    ]);
};
