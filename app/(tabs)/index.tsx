import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 👋 Welcome Section */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome 👋</Text>
        <Text style={styles.subtitle}>
          Manage services & calculate costs easily
        </Text>
      </View>

      {/* 📊 Cards */}
      <View style={styles.cardContainer}>
        {/* Cost Calculator */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/costcalculator")}
        >
          <MaterialIcons name="calculate" size={32} color="#2563eb" />
          <Text style={styles.cardTitle}>Cost Calculator</Text>
          <Text style={styles.cardDesc}>
            Calculate service pricing instantly
          </Text>
        </TouchableOpacity>

        {/* Manage Services */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/manage-service")}
        >
          <Ionicons name="settings-outline" size={32} color="#16a34a" />
          <Text style={styles.cardTitle}>Master</Text>
          <Text style={styles.cardDesc}>
            Add, edit and manage services
          </Text>
        </TouchableOpacity>

        {/*pdf history */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("../PdfPage/pdf-history")}
        >
          <Ionicons name="document-text-outline" size={32} color="#db2777" />
          <Text style={styles.cardTitle}>PDF History</Text>
          <Text style={styles.cardDesc}>
            View previously generated PDFs
          </Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  header: {
    marginTop: 10,
    marginBottom: 24,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 6,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  card: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 16,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#0f172a",
  },
  cardDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },
  footer: {
    marginTop: "auto",
    alignItems: "center",
    paddingVertical: 12,
  },
  footerText: {
    fontSize: 12,
    color: "#94a3b8",
  },
});
