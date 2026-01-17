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
import {
  getPDFHistory,
  PDFHistoryItem,
  deletePDF,
} from "../../utils/storage/pdfStorage";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import * as Print from "expo-print";

export default function PdfHistory() {
  const [pdfs, setPdfs] = useState<PDFHistoryItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    loadPdfs();
  }, []);

  const loadPdfs = async () => {
    const history = await getPDFHistory();
    setPdfs(history);
  };

  const isSelectionMode = selectedIds.length > 0;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const handlePress = (item: PDFHistoryItem) => {
    if (isSelectionMode) {
      toggleSelect(item.id);
    } else {
      openPdf(item.uri); // <-- pass item.uri
    }
  };

  const handleLongPress = (id: string) => {
    toggleSelect(id);
  };

  const openPdf = async (uri: string) => {
    try {
      await Print.printAsync({ uri });
    } catch (err) {
      console.error("Error opening PDF:", err);
      Alert.alert("Error", "Unable to open PDF");
    }
  };

  const deleteSelected = () => {
    Alert.alert(
      "Delete PDFs",
      `Delete ${selectedIds.length} selected PDFs?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            for (const id of selectedIds) {
              await deletePDF(id);
            }
            setSelectedIds([]);
            loadPdfs();
          },
        },
      ]
    );
  };

  const shareSelected = async () => {
    for (const id of selectedIds) {
      const pdf = pdfs.find((p) => p.id === id);
      if (pdf) {
        await Sharing.shareAsync(pdf.uri);
      }
    }
  };

  const renderItem = ({ item }: { item: PDFHistoryItem }) => {
    const selected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => handlePress(item)}
        onLongPress={() => handleLongPress(item.id)}
      >
        <Ionicons
          name={selected ? "checkbox" : "document-text-outline"}
          size={26}
          color={selected ? "#2563eb" : "#db2777"}
        />

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.pdfName}>
            PDF - {item.createdAt.split("T")[0]}
          </Text>
          <Text style={styles.pdfSub}>
            Total: ₹{item.grandTotal.toFixed(2)} | {item.services.length} services
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSelectionMode ? (
        <View style={styles.actionBar}>
          <Text style={styles.selectedText}>{selectedIds.length} selected</Text>

          <View style={styles.actionBtns}>
            <TouchableOpacity onPress={shareSelected}>
              <Ionicons name="share-social-outline" size={22} color="#2563eb" />
            </TouchableOpacity>

            <TouchableOpacity onPress={deleteSelected}>
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={styles.header}>PDF History ({pdfs.length})</Text>
      )}

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
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e7ff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e3a8a",
  },
  actionBtns: {
    flexDirection: "row",
    gap: 18,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 2,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#2563eb",
    backgroundColor: "#eff6ff",
  },
  pdfName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0f172a",
  },
  pdfSub: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#94a3b8",
    marginTop: 10,
  },
});
