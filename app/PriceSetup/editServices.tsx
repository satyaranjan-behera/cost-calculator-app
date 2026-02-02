import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
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
  const insets = useSafeAreaInsets();

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

  // return (
  //   <SafeAreaView style={styles.container}>
  //     <Text style={styles.title}>Edit Service</Text>

  //     <View style={styles.inputGroup}>
  //       <Text style={styles.label}>Service Name</Text>
  //       <TextInput
  //         value={serviceName}
  //         onChangeText={setServiceName}
  //         style={styles.input}
  //         placeholder="Service name"
  //       />
  //     </View>

  //     <View style={styles.inputGroup}>
  //       <Text style={styles.label}>Price (₹)</Text>
  //       <TextInput
  //         value={price}
  //         onChangeText={setPrice}
  //         style={styles.input}
  //         keyboardType="numeric"
  //         placeholder="Enter price"
  //       />
  //     </View>

  //     <TouchableOpacity style={styles.saveBtn} onPress={updateService}>
  //       <Text style={styles.saveText}>Update Service</Text>
  //     </TouchableOpacity>
  //   </SafeAreaView>
  // );
  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Service</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Name</Text>
            <TextInput
              value={serviceName}
              onChangeText={setServiceName}
              style={styles.input}
              placeholder="Enter service name"
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
        </View>
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: "#f9fafb", // light bg like screenshot
  //   paddingHorizontal: 20,
  //   paddingTop: 40, // 👈 MORE SPACE FROM TOP
  // },
  // title: {
  //   fontSize: 24,
  //   fontWeight: "700",
  //   marginBottom: 30, // 👈 more breathing room
  //   color: "#111827",
  // },
  // inputGroup: {
  //   marginBottom: 18,
  // },
  // label: {
  //   fontSize: 14,
  //   marginBottom: 6,
  //   color: "#6b7280",
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: "#e5e7eb",
  //   borderRadius: 14,
  //   paddingVertical: 14,
  //   paddingHorizontal: 16,
  //   fontSize: 16,
  //   backgroundColor: "#fff",
  // },
  // saveBtn: {
  //   backgroundColor: "#3b5bfd",
  //   paddingVertical: 18,
  //   borderRadius: 18,
  //   marginTop: 30, // 👈 space above button
  //   alignItems: "center",
  // },
  // saveText: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  // },

  safe: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },

  header: {
    
    backgroundColor: "#4338ca",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },

  backArrow: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginRight: 12,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "700",
  },

  container: {
    padding: 16,
    marginTop: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 4, // Android shadow
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111827",
  },

  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },

  saveBtn: {
    backgroundColor: "#3b5bfd",
    paddingVertical: 18,
    borderRadius: 18,
    marginTop: 20,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
