import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { confirmDelete } from "@/components/handlers/deleteHandler";

// 🔁 USE YOUR EXISTING STORAGE LOGIC
import { getServices, saveServices } from "../../utils/storage/serviceStorage";
import { router } from "expo-router";
import SetupHeader from "@/components/screens/setupHeader";

export default function PriceSetup() {
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        loadServices();
    }, [services]);

    const loadServices = async () => {
        const data = await getServices();
        setServices(data || []);
    };


    const renderItem = ({ item }: any) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.serviceName}>{item.service}</Text>
                
            </View>

            {/* <Text style={styles.description}>{item.description}</Text> */}

            <View style={styles.cardFooter}>
                <Text style={styles.price}>₹ {item.price}</Text>

                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.editBtn}
                        onPress={()=>
                            router.push({
                                pathname: "/PriceSetup/editServices",
                                params: { id: item.id }
                            })
                        }
                    >
                        <Ionicons name="pencil" size={18} color="#2563eb" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteBtn}
                        onPress={() =>
                            confirmDelete({
                                title: "Delete Service",
                                message: "Are you sure you want to delete this service?",
                                data: services,
                                setData: setServices,
                                saveFn: saveServices,
                                id: item.id,
                            })
                        }
                    >
                        <Ionicons name="trash" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            {/* STATUS BAR */}
            <StatusBar backgroundColor="#0004ffff" barStyle="light-content" />

            {/* HEADER */}
            <SetupHeader/>

            {/* TOTAL SERVICES */}
            <View style={styles.totalCard}>
                <View>
                    <Text style={styles.totalLabel}>Total Services</Text>
                    <Text style={styles.totalValue}>{services.length}</Text>
                </View>
                <View style={styles.iconBox}>
                    <MaterialIcons name="inventory" size={26} color="#ff8c00" />
                </View>
            </View>

            {/* SERVICE LIST */}
            <FlatList
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 110 }}
                showsVerticalScrollIndicator={false}
            />

            {/* FIXED ADD BUTTON */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.addBtn}
                    onPress={() => router.push("/PriceSetup/addServices")}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                    <Text style={styles.addText}>Add New Service</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fcfcfcff",
    },

    header: {
        backgroundColor: "#2c0df5ff",
        padding: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    headerSub: {
        color: "#ffe0b2",
        marginTop: 4,
    },

    totalCard: {
        backgroundColor: "#fff",
        margin: 16,
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 2,
    },
    totalLabel: {
        color: "#6b7280",
    },
    totalValue: {
        fontSize: 22,
        fontWeight: "700",
    },
    iconBox: {
        backgroundColor: "#fff3e0",
        padding: 12,
        borderRadius: 12,
    },

    card: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginBottom: 14,
        padding: 16,
        borderRadius: 14,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    serviceName: {
        fontSize: 16,
        fontWeight: "600",
    },
    tag: {
        backgroundColor: "#fff3e0",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        color: "#ff8c00",
        fontSize: 12,
    },
    description: {
        color: "#6b7280",
        marginTop: 6,
    },

    cardFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 12,
    },
    price: {
        fontSize: 18,
        fontWeight: "700",
        color: "#000000ff",
    },
    actionRow: {
        flexDirection: "row",
    },
    editBtn: {
        backgroundColor: "#e0ecff",
        padding: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    deleteBtn: {
        backgroundColor: "#fee2e2",
        padding: 8,
        borderRadius: 10,
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
        backgroundColor: "#f6f7fb",
    },
    addBtn: {
        backgroundColor: "#394de3ff",
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    addText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
});
