import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
      }}
    >
      {/* 🏠 HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 💰 COST CALCULATOR */}
      <Tabs.Screen
        name="costcalculator"
        options={{
          title: "Cost Calculator",
          headerTitle: "Cost Calculator",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="calculate"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* 🛠 MASTER / MANAGE SERVICES */}
      <Tabs.Screen
        name="manage-service"
        options={{
          title: "Master",
          headerTitle: "Manage Services",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
