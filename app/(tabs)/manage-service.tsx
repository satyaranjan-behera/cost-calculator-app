import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import MenuItem from "../../components/ui/MenuItem";
import { getCompany } from "@/utils/storage/companyStorage";

// const MENU = [
//   { id: "company", title: "Company Setup" },
//   { id: "price", title: "Price Setup" },
//   { id: "tc", title: "T&C Setup" },
//   { id: "payment", title: "Payment Setup" },
//   { id: "delivery", title: "Delivery Setup" },
// ];

export default function ManageServices() {
  const [active, setActive] = useState("company");
  const [company, setCompany] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    loadCompany();
  }, [company]);

  const loadCompany = async () => {
    const data = await getCompany();
    setCompany(data);
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Gradient Card */}
        <LinearGradient
          colors={["#1D7BD9", "#2EC4B6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.businessCard}
        >
          <View style={styles.cardAvatar}>
            {company?.logo ? (
              <Image
                source={{ uri: company.logo }}
                style={styles.logo}
              />
            ) : (
              <Text style={styles.cardAvatarText}>
                {company?.companyName
                  ? company.companyName.charAt(0).toUpperCase()
                  : "M"}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.cardTitle}>
              {company?.companyName || "My Business"}
            </Text>
            <Text style={styles.cardSubTitle}>Master Settings</Text>
          </View>
        </LinearGradient>

        {/* Configuration Section */}
        <Text style={styles.sectionTitle}>Configuration</Text>

        {/* Menu Items */}
        <MenuItem
          icon={<Ionicons name="business" size={22} color="#1D7BD9" />}
          title="Company Setup"
          subtitle="Configure company details & logo"
          onPress={() => router.push("../CompanySetup/company-setup")}
        />

        <MenuItem
          icon={<Ionicons name="cash-outline" size={20} color="#22C55E" />}
          title="Price Setup"
          subtitle="Set pricing & rate cards"
          onPress={() => router.push("../PriceSetup/price-setup")}
        />

        <MenuItem
          icon={<Ionicons name="document-text" size={22} color="#F59E0B" />}
          title="T&C Setup"
          subtitle="Terms and conditions"
          onPress={() => router.push("../T&CSetup/t&c-setup")}
        />

        <MenuItem
          icon={<Ionicons name="card" size={22} color="#14B8A6" />}
          title="Payment Setup"
          subtitle="Payment modes & bank details"
          onPress={() => router.push("../PaymentSetup/payment-setup")}
        />

        <MenuItem
          icon={<Ionicons name="cube-outline" size={22} color="#14B8A6" />}
          title="Delivery Setup"
          subtitle="Delivery options & charges"
          // onPress={() => router.push("../DeliverySetup/delivery-setup")}
        />
      </ScrollView>
    </View>
  );
}

/* Reusable Menu Item */
// function MenuItem({ icon, title, subtitle }: any) {
//   return (
//     <TouchableOpacity style={styles.menuItem}>
//       <View style={styles.menuLeft}>
//         <View style={styles.iconBox}>{icon}</View>
//         <View>
//           <Text style={styles.menuTitle}>{title}</Text>
//           <Text style={styles.menuSubtitle}>{subtitle}</Text>
//         </View>
//       </View>
//       <Ionicons name="chevron-forward" size={20} color="#6B7280" />
//     </TouchableOpacity>

//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  /* Gradient Card */
  businessCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  cardAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logo: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  cardAvatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  cardSubTitle: {
    color: "#E5E7EB",
    marginTop: 2,
  },

  /* Section */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  /* Menu */
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
});
