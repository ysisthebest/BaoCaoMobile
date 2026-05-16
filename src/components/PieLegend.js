import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";
import { formatCurrency } from "../utils/formatters";

export const PIE_COLORS = ["#ff7a30", "#1f8a70", "#325c9b", "#bc6ff1", "#c2551a", "#457b9d"];

export function PieLegend({ items }) {
  return (
    <View style={styles.wrap}>
      {items.map((item, index) => (
        <View key={item.categoryId} style={styles.row}>
          <View style={[styles.dot, { backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }]} />
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>
              {item.percent}% • {formatCurrency(item.amount)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  meta: {
    color: theme.colors.textSecondary,
  },
});
