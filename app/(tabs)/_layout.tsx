import { Tabs, usePathname } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { getCompany } from "@/utils/storage/companyStorage";
import { useEffect, useState } from "react";
import { Image } from "react-native";

/* 🔶 CUSTOM HEADER */
// function CustomHeader() {
//   const pathname = usePathname();
//   const insets = useSafeAreaInsets();

//   let subtitle = "Dashboard";
//   if (pathname.includes("costcalculator")) subtitle = "Cost Calculator";
//   if (pathname.includes("manage-service")) subtitle = "Master";

//   return (
//     <View
//       style={{
//         backgroundColor: "#ff9800",
//         paddingTop: insets.top, // ✅ notch safe
//       }}
//     >
//       <StatusBar barStyle="light-content" />

//       <LinearGradient
//         colors={["#ff9800", "#ff6d00"]}
//         style={styles.header}
//       >
//         {/* Logo */}
//         <View style={styles.logoBox}>
//           <Ionicons name="business-outline" size={24} color="#fff" />
//         </View>

//         {/* Company Info */}
//         <View>
//           <Text style={styles.company}>My Company</Text>
//           <Text style={styles.subtitle}>{subtitle}</Text>
//         </View>
//       </LinearGradient>
//     </View>
//   );
// }

/* 🔶 CUSTOM HEADER */
function CustomHeader() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const [company, setCompany] = useState<any>(null);

  // const [companyName, setCompanyName] = useState("My Company");
  // const [logo, setLogo] = useState<string | null>(null);

  let subtitle = "Dashboard";
  if (pathname.includes("costcalculator")) subtitle = "Cost Calculator";
  if (pathname.includes("manage-service")) subtitle = "Master";

  useEffect(() => {
    const loadCompany = async () => {
      try {
        const data = await getCompany();
        // setCompanyName(company.companyName || "My Company");
        // setLogo(company.logo?.trim() ? company.logo : null);
        setCompany(data);
      } catch (error) {
        console.log("Error loading company:", error);
      }
    };

    loadCompany();
  }, [company]);

  return (
    <View
      style={{
        backgroundColor: "#ff9800",
        paddingTop: insets.top, // ✅ notch safe
      }}
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={["#ff9800", "#ff6d00"]}
        style={styles.header}
      >
        {/* Logo */}
        {company?.logo ? (
          <Image
            source={{ uri: company.logo }}
            style={styles.logoDirect}
            resizeMode="contain"
          />
        ) : (
          <Ionicons name="business-outline" size={44} color="#fff" />
        )}

        {/* Company Info */}
        <View>
          <Text style={styles.company}>{company?.companyName || "My Company"}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarActiveTintColor: "#ff9800",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          ...styles.tabBar,
          paddingBottom: insets.bottom + 6, // ✅ navigation bar safe
          height: 60 + insets.bottom,
        },
      }}
    >
      {/* 🏠 HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 💰 CALCULATOR */}
      <Tabs.Screen
        name="costcalculator"
        options={{
          title: "Calculator",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calculate" size={size} color={color} />
          ),
        }}
      />

      {/* 🛠 MASTER */}
      <Tabs.Screen
        name="manage-service"
        options={{
          title: "Master",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

/* 🎨 STYLES */
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  logoDirect: {
    width: 44,
    height: 44,
    borderRadius: 12, // optional rounded corners
  },

  company: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    color: "#ffe0b2",
    fontSize: 14,
    marginTop: 2,
  },

  tabBar: {
    paddingTop: 6,
  },

});
