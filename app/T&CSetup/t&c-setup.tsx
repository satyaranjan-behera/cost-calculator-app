import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { router } from "expo-router";

import {
  getTnC,
  saveTnC,
  initialTnCFile,
} from "../../utils/storage/t&cStorage";

export default function TnCSetup() {
  const [generalTerm, setGeneralTerm] = useState("");
  const [termsOfService, setTermsOfService] = useState("");
  const [privacyPolicy, setPrivacyPolicy] = useState("");

  useEffect(() => {
    loadTnC();
  }, []);

  const loadTnC = async () => {
    await initialTnCFile();
    const data = await getTnC();

    setGeneralTerm(data.generalTerm || "");
    setTermsOfService(data.termsOfService || "");
    setPrivacyPolicy(data.privacyPolicy || "");
  };

  const saveDetails = async () => {
    if (!generalTerm || !termsOfService || !privacyPolicy) {
      Alert.alert("Validation Error", "All fields are required");
      return;
    }

    await saveTnC({
      generalTerm,
      termsOfService,
      privacyPolicy,
    });

    Alert.alert("Success", "Terms & Conditions saved successfully", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Terms & Conditions Setup</Text>
            <Text style={styles.headerSub}>
              Configure your app's legal policies
            </Text>
          </View>
        </View>

        {/* GENERAL TERMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>General Terms</Text>
          <ScrollView style={styles.scrollBox}>
            <TextInput
              style={styles.textArea}
              multiline
              value={generalTerm}
              onChangeText={setGeneralTerm}
              placeholder="Enter general terms..."
            />
          </ScrollView>
        </View>

        {/* SERVICES TERMS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services Terms</Text>
          <ScrollView style={styles.scrollBox}>
            <TextInput
              style={styles.textArea}
              multiline
              value={termsOfService}
              onChangeText={setTermsOfService}
              placeholder="Enter service terms..."
            />
          </ScrollView>
        </View>

        {/* LIABILITY / PRIVACY */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Liability & Disclaimer</Text>
          <ScrollView style={styles.scrollBox}>
            <TextInput
              style={styles.textArea}
              multiline
              value={privacyPolicy}
              onChangeText={setPrivacyPolicy}
              placeholder="Enter liability & disclaimer..."
            />
          </ScrollView>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveDetails}>
          <Text style={styles.saveText}>Save Terms & Conditions</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200ee",
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSub: {
    color: "#d1c4e9",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 14,
    borderRadius: 14,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  scrollBox: {
    maxHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
  },

  saveBtn: {
    backgroundColor: "#6200ee",
    marginHorizontal: 16,
    marginBottom: 30,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
