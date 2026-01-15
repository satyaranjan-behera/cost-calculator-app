import { Alert } from "react-native";

type AddHandlerParams<T> = {
  newItem: Omit<T, "id">;
  data: T[];
  setData: (data: T[]) => void;
  saveFn: (data: T[]) => Promise<void>;
  generateId?: () => string;
  errorMessage?: string;
};

export const addItem = async <T extends { id: string }>({
  newItem,
  data,
  setData,
  saveFn,
  generateId = () => Date.now().toString(),
  errorMessage = "Please fill all required fields",
}: AddHandlerParams<T>) => {
  // Basic validation
  if (!newItem || Object.values(newItem).some(v => v === "" || v == null)) {
    Alert.alert("Validation Error", errorMessage);
    return;
  }

  const itemWithId: T = {
    ...(newItem as T),
    id: generateId(),
  };

  const updated = [...data, itemWithId];

  setData(updated);      // Update UI
  await saveFn(updated); // Save to storage
};
