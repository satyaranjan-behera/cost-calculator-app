import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  getServices,
  saveServices,
  initialServicesFile,
} from "../../utils/storage/serviceStorage";

/* ================= TYPES ================= */

type Service = {
  id: string;
  service: string;
  price: number;
};

/* ================= SCREEN ================= */

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

  /* ---------- Load services ---------- */
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async (): Promise<void> => {
    await initialServicesFile();
    const data: Service[] = await getServices();
    setServices(data);
  };

  /* ---------- Add new service ---------- */
  const addService = async (): Promise<void> => {
    if (!newService.trim() || !newPrice.trim()) {
      Alert.alert("Error", "Service name and price are required");
      return;
    }

    const newItem: Service = {
      id: Date.now().toString(),
      service: newService.trim(),
      price: Number(newPrice),
    };

    const updated = [...services, newItem];
    setServices(updated);
    await saveServices(updated);

    setNewService("");
    setNewPrice("");
  };

  /* ---------- Update price ---------- */
  const updatePrice = (id: string, value: string): void => {
    const updated = services.map((item) =>
      item.id === id ? { ...item, price: Number(value) || 0 } : item
    );
    setServices(updated);
  };

  /* ---------- Delete service ---------- */
  const deleteService = (id: string): void => {
    Alert.alert("Delete Service", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = services.filter((item) => item.id !== id);
          setServices(updated);
          await saveServices(updated);
        },
      },
    ]);
  };

  /* ---------- Save all changes ---------- */
  const saveChanges = async (): Promise<void> => {
    await saveServices(services);
    Alert.alert("Success", "Services saved successfully");
  };

  /* ---------- Render item ---------- */
  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.card}>
      <Text style={styles.serviceName}>{item.service}</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(item.price)}
        onChangeText={(text) => updatePrice(item.id, text)}
      />

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteService(item.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Manage Services</Text>

      {/* -------- ADD SERVICE -------- */}
      <View style={styles.addBox}>
        <TextInput
          style={styles.addInput}
          placeholder="Service name"
          value={newService}
          onChangeText={setNewService}
        />

        <TextInput
          style={styles.addInput}
          placeholder="Price"
          keyboardType="numeric"
          value={newPrice}
          onChangeText={setNewPrice}
        />

        <TouchableOpacity style={styles.addBtn} onPress={addService}>
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* -------- SERVICE LIST -------- */}
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* -------- SAVE -------- */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  addBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  addInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 8,
  },
  addBtn: {
    backgroundColor: "#0a7ea4",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
  },
  serviceName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    width: 80,
    height: 36,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    textAlign: "center",
    marginRight: 8,
  },
  deleteBtn: {
    backgroundColor: "#e53935",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  saveBtn: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "#333",
    paddingVertical: 14,
    borderRadius: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
