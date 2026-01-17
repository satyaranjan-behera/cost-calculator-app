import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import SetupHeader from "@/components/screens/setupHeader";

import {
  getCompany,
  saveCompany,
  initialCompanyFile,
} from "../../utils/storage/companyStorage";
import { router } from "expo-router";

export default function CompanySetup() {
  const [logo, setLogo] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    await initialCompanyFile();
    const data = await getCompany();

    setLogo(data.logo || null);
    setCompanyName(data.companyName || "");
    setIndustry(data.industry || "");
    setAddress(data.address || "");
    setPhone(data.phone || "");
    setEmail(data.email || "");
  };

  const pickLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLogo(result.assets[0].uri);
    }
  };

  const saveDetails = async () => {
    if (!companyName || !phone) {
      Alert.alert("Validation Error", "Company name & phone are required");
      return;
    }

    await saveCompany({
      logo,
      companyName,
      industry,
      address,
      phone,
      email,
    });

    Alert.alert("Success", "Company details saved successfully",[
      {
        text: "OK",
        onPress: () => router.back(),
      }
    ]);
  };

  return (
    
    <SafeAreaView style={styles.container} edges={["left", "right"]}>

      <SetupHeader/>
      

      <ScrollView showsVerticalScrollIndicator={false}>
        

        {/* LOGO CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="camera" size={16} color="#ff7a00" /> Company Logo
          </Text>

          <View style={styles.logoBox}>
            {logo ? (
              <Image source={{ uri: logo }} style={styles.logo} />
            ) : (
              <Ionicons name="camera" size={30} color="#ff7a00" />
            )}
          </View>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickLogo}>
            <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
            <Text style={styles.uploadText}>Upload Logo</Text>
          </TouchableOpacity>
        </View>

        {/* COMPANY DETAILS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <MaterialIcons name="business" size={16} color="#ff7a00" /> Company
            Details
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Company Name *"
            value={companyName}
            onChangeText={setCompanyName}
          />

          <TextInput
            style={styles.input}
            placeholder="Industry"
            value={industry}
            onChangeText={setIndustry}
          />
        </View>

        {/* ADDRESS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="location-outline" size={16} color="#ff7a00" /> Address
          </Text>

          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Street Address"
            multiline
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* CONTACT */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Ionicons name="call-outline" size={16} color="#ff7a00" /> Contact
            Details
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveDetails}>
          <Text style={styles.saveText}>Save Company Details</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  // header: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: "#ff7a00",
  //   padding: 20,
  //   borderBottomLeftRadius: 20,
  //   borderBottomRightRadius: 20,
  // },
  // headerTitle: {
  //   color: "#fff",
  //   fontSize: 18,
  //   fontWeight: "700",
  // },
  // headerSub: {
  //   color: "#ffe2c6",
  //   fontSize: 12,
  // },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  logoBox: {
    height: 100,
    width: 100,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ffcc99",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 14,
    backgroundColor: "#fff2e6",
  },
  logo: {
    height: "100%",
    width: "100%",
    borderRadius: 14,
  },
  uploadBtn: {
    backgroundColor: "#ff7a00",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 14,
  },
  saveBtn: {
    backgroundColor: "#ff7a00",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
