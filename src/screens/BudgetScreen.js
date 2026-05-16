import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BudgetProgressCard } from "../components/BudgetProgressCard";
import { MonthYearPickerField } from "../components/MonthYearPickerField";
import { FormField } from "../components/FormField";
import { PillSelector } from "../components/PillSelector";
import { PrimaryButton } from "../components/PrimaryButton";
import { SectionCard } from "../components/SectionCard";
import { theme } from "../theme";
import { getCurrentMonth } from "../utils/formatters";

export function BudgetScreen({
  expenseCategories,
  budgetForm,
  updateBudgetForm,
  updateBudgetMonthPart,
  saveBudget,
  budgetProgress,
  budgets,
  startEditBudget,
  deleteBudget,
  formatCurrency,
  onNavigate,
}) {
  const categoryItems = expenseCategories.map((item) => ({ label: item.name, value: item.id }));
  const monthValue = budgetForm.month || getCurrentMonth();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Ngân sách</Text>
        <Pressable style={styles.categoryButton} onPress={() => onNavigate("categories")}>
          <Text style={styles.categoryButtonText}>Quản lý danh mục</Text>
        </Pressable>
      </View>

      <SectionCard title={budgetForm.id ? "Cập nhật ngân sách" : "Tạo ngân sách mới"}>
        <Text style={styles.label}>Danh mục</Text>
        <PillSelector
          items={categoryItems}
          selectedValue={budgetForm.categoryId}
          onChange={(value) => updateBudgetForm("categoryId", value)}
        />
        <MonthYearPickerField
          label="Tháng"
          value={monthValue}
          onChange={(next) => {
            const [year, month] = String(next).split("-");
            updateBudgetMonthPart("year", year);
            updateBudgetMonthPart("month", month);
          }}
        />
        <FormField
          label="Hạn mức"
          value={budgetForm.limit}
          onChangeText={(value) => updateBudgetForm("limit", value)}
          placeholder="2000000"
          keyboardType="numeric"
        />
        <PrimaryButton
          title={budgetForm.id ? "Lưu ngân sách" : "Thêm ngân sách"}
          onPress={saveBudget}
        />
      </SectionCard>

      <SectionCard title="Tiến độ ngân sách tháng hiện tại">
        {budgetProgress.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có ngân sách cho tháng này.</Text>
        ) : (
          budgetProgress.map((item) => <BudgetProgressCard key={item.id} item={item} />)
        )}
      </SectionCard>

      <SectionCard title="Tất cả ngân sách">
        {budgets.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có ngân sách nào được tạo.</Text>
        ) : (
          budgets.map((item) => {
            const categoryName =
              expenseCategories.find((category) => category.id === item.categoryId)?.name || "Khác";
            return (
              <View key={item.id} style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.name}>{categoryName}</Text>
                  <Text style={styles.meta}>
                    {item.month} • {formatCurrency(item.limit)}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Text onPress={() => startEditBudget(item)} style={styles.link}>
                    Sửa
                  </Text>
                  <Text onPress={() => deleteBudget(item.id)} style={styles.delete}>
                    Xóa
                  </Text>
                </View>
              </View>
            );
          })
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
  pageTitle: {
    color: theme.colors.textOnDark,
    fontSize: 28,
    fontWeight: "800",
    paddingTop: 6,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  categoryButton: {
    backgroundColor: "#22313b",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  categoryButtonText: {
    color: theme.colors.textOnDark,
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#efe5d7",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  meta: {
    color: theme.colors.textSecondary,
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
