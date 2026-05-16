import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../theme";
import { formatCurrency, formatShortDate } from "../utils/formatters";

export function TransactionCard({ item, onView, onEdit, onDelete }) {
  const expense = item.type === "expense";

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={[styles.badge, expense ? styles.badgeExpense : styles.badgeIncome]}>
          <Ionicons
            name={expense ? "arrow-down-outline" : "arrow-up-outline"}
            size={16}
            color={expense ? theme.colors.danger : theme.colors.success}
          />
        </View>
        <View style={styles.left}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.meta}>
            {item.categoryName} • {formatShortDate(item.date)}
          </Text>
        </View>
        <Text style={[styles.amount, expense ? styles.expense : styles.income]}>
          {expense ? "-" : "+"}
          {formatCurrency(item.amount)}
        </Text>
      </View>
      {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
      <View style={styles.actions}>
        <Pressable onPress={() => onView(item)}>
          <Text style={styles.link}>Chi tiết</Text>
        </Pressable>
        <Pressable onPress={() => onEdit(item)}>
          <Text style={styles.link}>Sửa</Text>
        </Pressable>
        <Pressable onPress={() => onDelete(item.id)}>
          <Text style={styles.delete}>Xóa</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fbf5eb",
    borderRadius: 20,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#efe0cc",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
  },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  badgeExpense: {
    backgroundColor: "#ffe3d7",
  },
  badgeIncome: {
    backgroundColor: "#def2e5",
  },
  left: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
    fontSize: 16,
  },
  meta: {
    color: theme.colors.textSecondary,
  },
  amount: {
    maxWidth: "42%",
    textAlign: "right",
    fontWeight: "800",
  },
  income: {
    color: theme.colors.success,
  },
  expense: {
    color: theme.colors.danger,
  },
  note: {
    color: "#524942",
    lineHeight: 20,
  },
  actions: {
    flexDirection: "row",
    gap: 18,
  },
  link: {
    color: theme.colors.accentDeep,
    fontWeight: "700",
  },
  delete: {
    color: theme.colors.danger,
    fontWeight: "700",
  },
});
