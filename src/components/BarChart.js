import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";
import { formatCurrency } from "../utils/formatters";

export function BarChart({ data }) {
  const max = Math.max(1, ...data.map((item) => Math.max(item.income, item.expense)));

  return (
    <View style={styles.wrap}>
      {data.map((item) => (
        <View key={item.month} style={styles.group}>
          <View style={styles.columns}>
            <View style={[styles.bar, styles.income, { height: `${(item.income / max) * 100}%` }]} />
            <View style={[styles.bar, styles.expense, { height: `${(item.expense / max) * 100}%` }]} />
          </View>
          <Text style={styles.label}>{item.month.slice(5)}</Text>
          <Text style={styles.caption}>Thu {formatCurrency(item.income)}</Text>
          <Text style={styles.caption}>Chi {formatCurrency(item.expense)}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    minHeight: 220,
  },
  group: {
    flex: 1,
    gap: 8,
    alignItems: "center",
  },
  columns: {
    height: 140,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 6,
  },
  bar: {
    width: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    minHeight: 6,
  },
  income: {
    backgroundColor: theme.colors.success,
  },
  expense: {
    backgroundColor: theme.colors.accent,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  caption: {
    color: theme.colors.textSecondary,
    fontSize: 11,
    textAlign: "center",
  },
});
