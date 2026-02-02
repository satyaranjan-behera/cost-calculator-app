// import { Stack, usePathname, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import {
//   View,
//   Text,
//   StyleSheet,
//   StatusBar,
//   TouchableOpacity,
// } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function SetupLayout() {
//   const pathname = usePathname();
//   const insets = useSafeAreaInsets();

//   let title = "Setup";

//   if (pathname.includes("company-setup")) title = "Company Setup";
//   else if (pathname.includes("price-setup")) title = "Price Setup";
//   else if (pathname.includes("terms-setup")) title = "T & C Setup";
//   else if (pathname.includes("payment-setup")) title = "Payment Setup";
//   else if (pathname.includes("delivery-setup")) title = "Delivery Setup";
//   else if (pathname.includes("costcalculator")) title = "calculator";

//   return (
//     <Stack
//       screenOptions={{
//         header: () => (
//           <View
//             style={{
//               backgroundColor: "#ff9800",
//               paddingTop: insets.top, // ✅ status bar safe
//             }}
//           >
//             <StatusBar barStyle="light-content" />

//             <LinearGradient
//               colors={["#ff9800", "#ff6d00"]}
//               style={styles.header}
//             >
//               {/* 🔙 Back */}
//               <TouchableOpacity
//                 onPress={() => router.back()}
//                 style={styles.backBtn}
//               >
//                 <Ionicons name="arrow-back" size={22} color="#fff" />
//               </TouchableOpacity>

//               {/* 🏷 Title */}
//               <Text style={styles.title}>{title}</Text>

//               {/* Spacer */}
//               <View style={styles.rightSpace} />
//             </LinearGradient>
//           </View>
//         ),

//         contentStyle: {
//           backgroundColor: "#F5F6FA",
//           paddingBottom: insets.bottom, // ✅ navigation bar safe
//         },
//       }}
//     />
//   );
// }

// const styles = StyleSheet.create({
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomLeftRadius: 22,
//     borderBottomRightRadius: 22,
//   },

//   backBtn: {
//     width: 36,
//     height: 36,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   title: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#fff",
//   },

//   rightSpace: {
//     width: 36,
//   },
// });
//layout page 
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
            </Stack>
        </SafeAreaProvider>
    );
}