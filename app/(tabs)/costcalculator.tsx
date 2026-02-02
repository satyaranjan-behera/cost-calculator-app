import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { getServices } from "../../utils/storage/serviceStorage";
import { generateCostCalculatorPDF } from "../../utils/storage/pdfStorage";

type Service = {
  id: string;
  service: string;
  price: number;
};

export default function CostCalculator() {
  const [services, setServices] = useState<Service[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [multiplier, setMultiplier] = useState(1);

  useEffect(() => {
    loadServices();
  }, [services]);

  const loadServices = async () => {
    const data = await getServices();
    setServices(data || []);
  };

  const updateQty = (id: string, type: "inc" | "dec") => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const value = type === "inc" ? current + 1 : Math.max(0, current - 1);
      return { ...prev, [id]: value };
    });
  };

  const subtotal = useMemo(() => {
    return services.reduce((sum, item) => {
      const qty = quantities[item.id] || 0;
      return sum + qty * item.price;
    }, 0);
  }, [services, quantities]);

  const hasSelection = subtotal > 0;

  const handleGeneratePDF = async () => {
    try {
      const selectedServices = services
        .filter(s => (quantities[s.id] || 0) > 0)
        .map(s => ({
          service: s.service,
          price: s.price,
          quantity: quantities[s.id],
          lineTotal: s.price * quantities[s.id],
        }));

      await generateCostCalculatorPDF(
        selectedServices,
        subtotal,
        multiplier,
        subtotal * multiplier
      );

      Alert.alert("Success", "PDF generated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
    }
  };


  const renderItem = ({ item }: { item: Service }) => {
    const qty = quantities[item.id] || 0;
    const active = qty > 0;

    return (
      <View style={[styles.card, active && styles.cardActive]}>
        <View>
          <Text style={styles.title}>{item.service}</Text>
          <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.qtyRow}>
          <Text style={styles.qtyLabel}>Quantity</Text>

          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQty(item.id, "dec")}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyValue}>{qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtnActive}
              onPress={() => updateQty(item.id, "inc")}
            >
              <Text style={styles.qtyBtnActiveText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
        ListFooterComponent={
          <>
            {/* EMPTY STATE */}
            {!hasSelection && (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIcon}>
                  <Ionicons
                    name="calculator-outline"
                    size={42}
                    color="#cbd5e1"
                  />
                </View>
                <Text style={styles.emptyTitle}>No services selected</Text>
                <Text style={styles.emptySub}>
                  Add services to calculate total cost
                </Text>
              </View>
            )}

            {/* SUMMARY */}
            {hasSelection && (
              <>
                {/* SUBTOTAL */}
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    ₹ {subtotal.toFixed(2)}
                  </Text>
                </View>

                {/* MULTIPLIER */}
                <View style={styles.multiplierCard}>
                  <View style={styles.multiplierHeader}>
                    <Text style={styles.multiplierTitle}>Multiplier</Text>
                  </View>

                  <View style={styles.multiplierBox}>
                    <TouchableOpacity
                      style={styles.multiBtn}
                      onPress={() =>
                        setMultiplier(Math.max(1, multiplier - 1))
                      }
                    >
                      <Text style={styles.multiText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.multiValue}>{multiplier}x</Text>

                    <TouchableOpacity
                      style={styles.multiBtnActive}
                      onPress={() => setMultiplier(multiplier + 1)}
                    >
                      <Text style={styles.multiTextActive}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* GRAND TOTAL */}
                <View style={styles.grandTotal}>
                  <Text style={styles.grandLabel}>Grand Total</Text>
                  <Text style={styles.grandValue}>
                    ₹ {(subtotal * multiplier).toFixed(2)}
                  </Text>

                  {/* PDF BUTTON */}
                  <TouchableOpacity
                    style={styles.pdfBtn}
                    onPress={handleGeneratePDF}
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={18}
                      color="#ff8c00"
                    />
                    <Text style={styles.pdfBtnText}>Generate PDF</Text>
                  </TouchableOpacity>
                </View>

              </>
            )}
          </>
        }
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  cardActive: {
    borderWidth: 1,
    borderColor: "#ff8c00",
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
  },

  price: {
    color: "#ff7a00",
    marginTop: 4,
    fontWeight: "600",
  },

  qtyRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  qtyLabel: {
    fontSize: 13,
    color: "#64748b",
  },

  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
  },

  qtyBtn: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  qtyBtnText: {
    fontSize: 18,
    color: "#64748b",
  },

  qtyValue: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: "700",
  },

  qtyBtnActive: {
    backgroundColor: "#ff8c00",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  qtyBtnActiveText: {
    fontSize: 18,
    color: "#fff",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
    alignItems: "center",
    marginTop: 10,
  },

  emptyIcon: {
    backgroundColor: "#f1f5f9",
    padding: 20,
    borderRadius: 20,
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  emptySub: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 6,
    textAlign: "center",
  },

  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    fontSize: 15,
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 18,
    fontWeight: "800",
  },

  multiplierCard: {
    backgroundColor: "#eff6ff",
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },

  multiplierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  multiplierTitle: {
    fontWeight: "700",
  },

  multiplierBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  multiBtn: {
    backgroundColor: "#e5e7eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  multiText: {
    fontSize: 18,
  },

  multiValue: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "800",
    color: "#2563eb",
  },

  multiBtnActive: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  multiTextActive: {
    fontSize: 18,
    color: "#fff",
  },

  grandTotal: {
    backgroundColor: "#ff8c00",
    borderRadius: 18,
    padding: 20,
    marginTop: 18,
  },

  grandLabel: {
    color: "#fff",
    fontSize: 14,
  },

  grandValue: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
    marginTop: 6,
  },
  pdfBtn: {
    backgroundColor: "#fff",
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  pdfBtnText: {
    color: "#ff8c00",
    fontWeight: "700",
    fontSize: 14,
  },
});
