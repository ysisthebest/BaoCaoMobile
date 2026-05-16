import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatCurrency } from "../utils/formatters";

const palettes = {
  dark: { bg: "#2e3f48", label: "#b6c3c0", value: "#f8f4ec" },
  green: { bg: "#dbeee3", label: "#416250", value: "#173227" },
  orange: { bg: "#ffd8b7", label: "#8d552a", value: "#4a2812" },
};

export function SummaryCard({ label, value, tone = "dark", format = "currency" }) {
  const palette = palettes[tone];
  const displayValue = format === "number" ? String(value ?? 0) : formatCurrency(value);

  return (
    <View style={[styles.card, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      <Text style={[styles.value, { color: palette.value }]}>{displayValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 16,
    minHeight: 96,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
  },
});
