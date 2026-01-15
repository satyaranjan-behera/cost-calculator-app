import * as FileSystem from "expo-file-system/legacy";
import { getInfoAsync } from "expo-file-system/legacy";

const FILE_PATH = FileSystem.documentDirectory + "services.json";

const defaultServices = [
  { id: "1", service: "Static Post Cost 1", price: 200 },
  { id: "2", service: "Static Post Cost 2", price: 100 },
  { id: "3", service: "Static Post Cost 3", price: 60 },
  { id: "4", service: "Reel Cost 1", price: 300 },
  { id: "5", service: "Reel Cost 2", price: 200 },
  { id: "6", service: "Reel Cost 3", price: 150 },
  { id: "7", service: "In-House Mobile Shoots", price: 1250 },
  { id: "8", service: "Freelance DSLR Shoots", price: 3000 },
  { id: "9", service: "Freelance Mobile Shoots", price: 1500 },
  { id: "10", service: "Female In-House Content Creator Cost", price: 1250 },
  { id: "11", service: "Male In-House Content Creator Cost", price: 1000 },
  { id: "12", service: "Freelance Model Content Creator Cost", price: 1500 },
  { id: "13", service: "GMB Cost", price: 2000 },
  { id: "14", service: "Paid Ad Cost", price: 1000 },
  { id: "15", service: "Avg Off Ex", price: 2000 }, 
  { id: "16", service: "Bm Cost", price: 1500 },
  { id: "17", service: "Mngt Exp", price: 3000 },
];

// Create file if not exists
export const initialServicesFile = async () => {
  const fileInfo = await getInfoAsync(FILE_PATH);

  if (!fileInfo.exists) {
    await FileSystem.writeAsStringAsync(
      FILE_PATH,
      JSON.stringify(defaultServices)
    );
  }
};

// Read services
export const getServices = async () => {
  await initialServicesFile();
  const data = await FileSystem.readAsStringAsync(FILE_PATH);
  return JSON.parse(data);
};

// Save / Update services
export const saveServices = async (services: any) => {
  await FileSystem.writeAsStringAsync(
    FILE_PATH,
    JSON.stringify(services)
  );
};
