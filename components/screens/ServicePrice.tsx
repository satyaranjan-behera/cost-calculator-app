import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

type Props = {
  service: string;
  price: number;
  isSelected: boolean;
  quantity: number;
  onToggle: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
};

const ServicePrice = ({
  service,
  price,
  isSelected,
  quantity,
  onToggle,
  onIncrease,
  onDecrease,
}: Props) => {
  return (
    <View style={styles.row}>
      {/* Service + Checkbox */}
      <View style={styles.left}>
        <Checkbox value={isSelected} onValueChange={onToggle} />
        <Text style={styles.service}>{service}</Text>
      </View>

      {/* Quantity */}
      <View style={styles.qtyBox}>
        <TouchableOpacity onPress={onDecrease} disabled={!isSelected}>
          <Text style={[styles.qtyBtn, !isSelected && styles.disabled]}>−</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{isSelected ? quantity : 0}</Text>

        <TouchableOpacity onPress={onIncrease} disabled={!isSelected}>
          <Text style={[styles.qtyBtn, !isSelected && styles.disabled]}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Amount */}
      <Text style={styles.price}>
        ₹ {isSelected ? price * quantity : 0}
      </Text>
    </View>
  );
};

export default ServicePrice;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  left: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  service: {
    fontSize: 14,
    color: "#333",
    flexShrink: 1,
  },
  qtyBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  qtyBtn: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 8,
  },
  disabled: {
    opacity: 0.3,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "600",
    minWidth: 20,
    textAlign: "center",
  },
  price: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#0a7ea4",
    textAlign: "right",
  },
});
