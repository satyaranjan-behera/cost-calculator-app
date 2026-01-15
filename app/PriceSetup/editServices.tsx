import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";

import {
  getServices,
  saveServices,
} from "../../utils/storage/serviceStorage";

export default function EditService() {
  const { id } = useLocalSearchParams();
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    const services = await getServices();
    const service = services.find((s: any) => s.id === id);

    if (!service) {
      Alert.alert("Error", "Service not found");
      router.back();
      return;
    }

    setServiceName(service.service);
    setPrice(String(service.price));
  };

  const updateService = async () => {
    if (!serviceName || !price) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    const services = await getServices();

    const updatedServices = services.map((s: any) =>
      s.id === id
        ? {
            ...s,
            service: serviceName,
            price: Number(price),
          }
        : s
    );

    await saveServices(updatedServices);

    Alert.alert("Success", "Service updated successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Edit Service</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Name</Text>
        <TextInput
          value={serviceName}
          onChangeText={setServiceName}
          style={styles.input}
          placeholder="Service name"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter price"
        />
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={updateService}>
        <Text style={styles.saveText}>Update Service</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#6b7280",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
