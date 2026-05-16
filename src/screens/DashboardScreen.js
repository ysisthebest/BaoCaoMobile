import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { BarChart } from "../components/BarChart";
import { ExpensePieChart } from "../components/ExpensePieChart";
import { PieLegend } from "../components/PieLegend";
import { SectionCard } from "../components/SectionCard";
import { SummaryCard } from "../components/SummaryCard";
import { theme } from "../theme";
import { formatCurrency, formatShortDate } from "../utils/formatters";

export function DashboardScreen({
  currentUser,
  dashboardSummary,
  recentTransactions,
  expensePie,
  monthlyBars,
  onNavigate,
}) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Xin chào, {currentUser.fullName}</Text>
      </View>
      <Text style={styles.title}>Tổng quan</Text>

      <View style={styles.summaryGrid}>
        <SummaryCard label="Số dư hiện tại" value={dashboardSummary.balance} tone="dark" />
        <View style={styles.summaryRow}>
          <View style={styles.summaryHalf}>
            <SummaryCard label="Tổng thu tháng" value={dashboardSummary.incomeMonth} tone="green" />
          </View>
          <View style={styles.summaryHalf}>
            <SummaryCard label="Tổng chi tháng" value={dashboardSummary.expenseMonth} tone="orange" />
          </View>
        </View>
      </View>

      <SectionCard title="Tổng quan nhanh">
        <View style={styles.insightGrid}>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Biến động chi</Text>
            <Text style={styles.insightValue}>
              {dashboardSummary.expenseTrend > 0 ? "+" : ""}
              {dashboardSummary.expenseTrend}%
            </Text>
            <Text style={styles.insightMeta}>so với tháng trước</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Số giao dịch</Text>
            <Text style={styles.insightValue}>{dashboardSummary.transactionCountMonth}</Text>
            <Text style={styles.insightMeta}>trong tháng hiện tại</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Chi tiêu trung bình</Text>
            <Text style={styles.insightValue}>{formatCurrency(dashboardSummary.averageExpense)}</Text>
            <Text style={styles.insightMeta}>mỗi khoản chi</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightLabel}>Ngân sách vượt mức</Text>
            <Text style={styles.insightValue}>{dashboardSummary.overBudgetCount}</Text>
            <Text style={styles.insightMeta}>danh mục cần chú ý</Text>
          </View>
        </View>
      </SectionCard>

      <SectionCard
        title="Biểu đồ thu chi theo tháng"
        action={
          <Pressable onPress={() => onNavigate("transactions")}>
            <Text style={styles.link}>Xem giao dịch</Text>
          </Pressable>
        }
      >
        <BarChart data={monthlyBars} />
      </SectionCard>

      <SectionCard title="Cơ cấu chi tiêu theo danh mục">
        {expensePie.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có dữ liệu chi tiêu trong tháng hiện tại.</Text>
        ) : (
          <>
            <ExpensePieChart items={expensePie} />
            <PieLegend items={expensePie} />
          </>
        )}
      </SectionCard>

      <SectionCard title="Giao dịch gần đây">
        {recentTransactions.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có giao dịch gần đây.</Text>
        ) : (
          recentTransactions.map((item) => (
            <View key={item.id} style={styles.recentRow}>
              <View style={styles.recentLeft}>
                <Text style={styles.recentTitle}>{item.title}</Text>
                <Text style={styles.recentMeta}>
                  {item.categoryName} • {formatShortDate(item.date)}
                </Text>
              </View>
              <Text style={[styles.recentAmount, item.type === "income" ? styles.income : styles.expense]}>
                {item.type === "income" ? "+" : "-"}
                {formatCurrency(item.amount)}
              </Text>
            </View>
          ))
        )}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 44,
    paddingBottom: 36,
    gap: 18,
  },
  hero: {
    backgroundColor: "#193a36",
    borderRadius: 30,
    padding: 22,
    gap: 14,
  },
  eyebrow: {
    color: "#d3ddd8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  summaryGrid: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryHalf: {
    flex: 1,
  },
  link: {
    color: theme.colors.accentDeep,
    fontWeight: "800",
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  insightCard: {
    width: "48%",
    backgroundColor: "#fbf5eb",
    borderRadius: 18,
    padding: 14,
    gap: 4,
    borderWidth: 1,
    borderColor: "#efe0cc",
  },
  insightLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  insightValue: {
    color: theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  insightMeta: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  highlightRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#fff2e9",
    borderRadius: 16,
    padding: 12,
  },
  highlightText: {
    flex: 1,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#efe5d7",
  },
  recentLeft: {
    flex: 1,
    gap: 4,
  },
  recentTitle: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  recentMeta: {
    color: theme.colors.textSecondary,
  },
  recentAmount: {
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
});
