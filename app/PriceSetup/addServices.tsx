import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView ,useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import {
  getServices,
  saveServices,
} from "../../utils/storage/serviceStorage";
import { StatusBar } from "expo-status-bar";

export default function AddService() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [service, setService] = useState("");
  const [price, setPrice] = useState("");

  const handleSave = async () => {
    if (!service.trim() || !price.trim()) {
      Alert.alert("Validation", "Please fill all fields");
      return;
    }

    const newService = {
      id: Date.now().toString(), // ✅ string id
      service: service.trim(),
      price: Number(price),
    };

    const existing = await getServices();
    const updated = [...existing, newService];

    await saveServices(updated);

    Alert.alert("Success", "Service added successfully", [
      {
        text: "OK",
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={[ "left", "right"]}>
      {/* <StatusBar style="light" backgroundColor="#2c0df5ff" /> */}
      {/* HEADER */}
      <View style={[styles.header,{ paddingTop: insets.top+12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Service</Text>
      </View>

      {/* FORM */}
      <View style={styles.form}>
        <Text style={styles.label}>Service Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter service name"
          value={service}
          onChangeText={setService}
        />

        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Save Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },

  header: {
    backgroundColor: "#2c0df5ff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 12,
  },

  form: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 14,
    elevation: 2,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
  },

  saveBtn: {
    backgroundColor: "#394de3ff",
    padding: 16,
    borderRadius: 14,
    marginTop: 24,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
