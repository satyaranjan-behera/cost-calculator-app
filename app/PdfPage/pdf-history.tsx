import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { getPDFHistory, PDFHistoryItem } from "../../utils/storage/pdfStorage";
import * as Sharing from "expo-sharing";

export default function PdfHistory() {
  const [pdfs, setPdfs] = useState<PDFHistoryItem[]>([]);

  useEffect(() => {
    loadPdfs();
  }, []);

  const loadPdfs = async () => {
    try {
      const history = await getPDFHistory();
      setPdfs(history);
    } catch {
      Alert.alert("Error", "Failed to load PDFs");
    }
  };

  const openPdf = async (uri: string) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert("Sharing not available");
    }
  };

  const renderItem = ({ item }: { item: PDFHistoryItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => openPdf(item.uri)}>
      <Ionicons name="document-text-outline" size={26} color="#db2777" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.pdfName}>PDF - {item.createdAt.split("T")[0]}</Text>
        <Text style={styles.pdfSub}>
          Total: ₹{item.grandTotal.toFixed(2)} | {item.services.length} services
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>PDF History ({pdfs.length})</Text>
      {pdfs.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="document-outline" size={48} color="#cbd5f5" />
          <Text style={styles.emptyText}>No PDFs generated yet</Text>
        </View>
      ) : (
        <FlatList
          data={pdfs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", padding: 16 },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14, 
    marginBottom: 12,
    elevation: 2,
  },
  pdfName: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  pdfSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 14, color: "#94a3b8", marginTop: 10 },
});
