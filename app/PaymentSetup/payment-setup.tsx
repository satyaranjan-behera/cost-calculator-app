import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getPaymentSettings,
  savePaymentSettings,
  PaymentSettings,
} from "@/utils/storage/paymentStorage";
import SetupHeader from "@/components/screens/setupHeader";

/* ---------------- PAYMENT METHODS ---------------- */

const paymentMethodList: {
  label: string;
  key: keyof PaymentSettings["methods"];
  icon: any;
}[] = [
  { label: "Cash", key: "cash", icon: "cash-outline" },
  { label: "Credit / Debit Card", key: "card", icon: "card-outline" },
  { label: "UPI", key: "upi", icon: "calculator-outline" },
  { label: "Net Banking", key: "netBanking", icon: "business-outline" },
  { label: "Digital Wallet", key: "wallet", icon: "wallet-outline" },
  { label: "Cheque", key: "cheque", icon: "document-text-outline" },
];

export default function PaymentSetup() {
  const router = useRouter();
  const [data, setData] = useState<PaymentSettings | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getPaymentSettings();
    setData(res);
  };

  if (!data) return null;

  const toggleMethod = (
    key: keyof PaymentSettings["methods"]
  ) => {
    setData({
      ...data,
      methods: {
        ...data.methods,
        [key]: !data.methods[key],
      },
    });
  };

  const save = async () => {
    await savePaymentSettings(data);
    alert("Payment settings saved");
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* ---------------- HEADER ---------------- */}
      <SetupHeader/>

      {/* ---------------- CONTENT ---------------- */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Payment Methods */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Payment Methods
          </Text>

          {paymentMethodList.map(({ label, key, icon }) => {
            const enabled = data.methods[key];

            return (
              <TouchableOpacity
                key={key}
                style={styles.methodRow}
                onPress={() => toggleMethod(key)}
                activeOpacity={0.7}
              >
                <View style={styles.methodLeft}>
                  <View style={styles.iconBox}>
                    <Ionicons
                      name={icon}
                      size={18}
                      color="#2563EB"
                    />
                  </View>
                  <Text style={styles.methodText}>
                    {label}
                  </Text>
                </View>

                <View
                  style={[
                    styles.checkCircle,
                    enabled && styles.checkActive,
                  ]}
                >
                  {enabled && (
                    <Ionicons
                      name="checkmark"
                      size={14}
                      color="#fff"
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* General Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            General Settings
          </Text>

          <Label>Currency</Label>
          <Input value="INR - Indian Rupee" editable={false} />

          <Label>Tax Rate (%)</Label>
          <Input
            keyboardType="numeric"
            value={String(data.taxRate)}
            onChangeText={(v: string) =>
              setData({ ...data, taxRate: Number(v) || 0 })
            }
          />

          <Label>Payment Terms (Days)</Label>
          <Input
            keyboardType="numeric"
            value={String(data.paymentTerms)}
            onChangeText={(v: string) =>
              setData({
                ...data,
                paymentTerms: Number(v) || 0,
              })
            }
          />

          <Label>Late Payment Fee (%)</Label>
          <Input
            keyboardType="numeric"
            value={String(data.lateFee)}
            onChangeText={(v: string) =>
              setData({ ...data, lateFee: Number(v) || 0 })
            }
          />
        </View>

        {/* Bank Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Bank Details
          </Text>

          <Input
            placeholder="Account Holder Name"
            value={data.bankDetails.accountHolderName}
            onChangeText={(v: string) =>
              setData({
                ...data,
                bankDetails: {
                  ...data.bankDetails,
                  accountHolderName: v,
                },
              })
            }
          />

          <Input
            placeholder="Account Number"
            value={data.bankDetails.accountNumber}
            onChangeText={(v: string) =>
              setData({
                ...data,
                bankDetails: {
                  ...data.bankDetails,
                  accountNumber: v,
                },
              })
            }
          />

          <Input
            placeholder="Bank Name"
            value={data.bankDetails.bankName}
            onChangeText={(v: string) =>
              setData({
                ...data,
                bankDetails: {
                  ...data.bankDetails,
                  bankName: v,
                },
              })
            }
          />

          <View style={styles.row}>
            <Input
              placeholder="IFSC"
              style={{ flex: 1, marginRight: 8 }}
              value={data.bankDetails.ifsc}
              onChangeText={(v: string) =>
                setData({
                  ...data,
                  bankDetails: {
                    ...data.bankDetails,
                    ifsc: v,
                  },
                })
              }
            />
            <Input
              placeholder="Branch"
              style={{ flex: 1 }}
              value={data.bankDetails.branch}
              onChangeText={(v: string) =>
                setData({
                  ...data,
                  bankDetails: {
                    ...data.bankDetails,
                    branch: v,
                  },
                })
              }
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={save}
        >
          <Ionicons
            name="save-outline"
            size={20}
            color="#fff"
          />
          <Text style={styles.saveText}>
            Save Payment Settings
          </Text>
        </TouchableOpacity>

        {/* Bottom safe spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ---------------- UI HELPERS ---------------- */

const Label = ({ children }: { children: React.ReactNode }) => (
  <Text style={styles.label}>{children}</Text>
);

const Input = (props: any) => (
  <TextInput
    {...props}
    style={[styles.input, props.style]}
  />
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    backgroundColor: "#FF8A00",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSub: {
    color: "#FFE4C7",
    fontSize: 12,
    marginTop: 2,
  },

  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },
  methodLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
  },
  checkActive: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  saveBtn: {
    backgroundColor: "#FF7A00",
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});
