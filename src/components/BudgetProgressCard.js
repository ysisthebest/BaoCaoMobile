import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";
import { formatCurrency } from "../utils/formatters";

export function BudgetProgressCard({ item }) {
  const width = `${Math.min(item.percent, 100)}%`;
  const over = item.percent > 100;
  const nearLimit = item.percent >= 80 && item.percent <= 100;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{item.categoryName}</Text>
        <Text style={[styles.percent, over ? styles.over : nearLimit ? styles.near : styles.normal]}>
          {item.percent}%
        </Text>
      </View>
      <Text style={styles.meta}>
        Đã chi {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            over ? styles.fillOver : nearLimit ? styles.fillNear : styles.fillNormal,
            { width },
          ]}
        />
      </View>
      <Text style={styles.remaining}>
        {over ? "Vượt ngân sách" : `Còn lại ${formatCurrency(item.remaining)}`}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fbf5eb",
    borderRadius: 18,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#efe0cc",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  percent: {
    fontWeight: "800",
  },
  normal: {
    color: theme.colors.success,
  },
  near: {
    color: theme.colors.accentDeep,
  },
  over: {
    color: theme.colors.danger,
  },
  meta: {
    color: theme.colors.textSecondary,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#eadfce",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  fillNormal: {
    backgroundColor: theme.colors.success,
  },
  fillNear: {
    backgroundColor: theme.colors.accent,
  },
  fillOver: {
    backgroundColor: theme.colors.danger,
  },
  remaining: {
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
});
