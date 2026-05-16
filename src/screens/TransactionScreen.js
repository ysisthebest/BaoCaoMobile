import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { MonthYearPickerField } from "../components/MonthYearPickerField";
import { FormField } from "../components/FormField";
import { PillSelector } from "../components/PillSelector";
import { SectionCard } from "../components/SectionCard";
import { TransactionCard } from "../components/TransactionCard";
import { theme } from "../theme";
import { formatCurrency, formatShortDate, getCurrentMonth } from "../utils/formatters";

export function TransactionScreen(props) {
  const {
    categories,
    filters,
    updateFilter,
    updateFilterMonthPart,
    filteredTransactions,
    startEditTransaction,
    deleteTransaction,
    selectedTransaction,
    setSelectedTransaction,
    onNavigate,
  } = props;

  const filterItems = [{ label: "Tất cả", value: "" }].concat(
    categories.map((item) => ({ label: item.name, value: item.id }))
  );
  const monthValue = filters.month || getCurrentMonth();

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Giao dịch</Text>
        <Pressable style={styles.actionButton} onPress={() => onNavigate("transaction-create")}>
          <Ionicons name="add-outline" size={18} color={theme.colors.textOnDark} />
          <Text style={styles.actionButtonText}>Thêm giao dịch</Text>
        </Pressable>
      </View>

      <SectionCard title="Tìm kiếm và lọc">
        <FormField
          label="Từ khóa"
          value={filters.keyword}
          onChangeText={(value) => updateFilter("keyword", value)}
          placeholder="Tên giao dịch hoặc ghi chú"
        />
        <View style={styles.customTypeRow}>
          {[
            { label: "Tất cả", value: "all" },
            { label: "Thu", value: "income" },
            { label: "Chi", value: "expense" },
          ].map((item) => (
            <Text
              key={item.value}
              onPress={() => updateFilter("type", item.value)}
              style={[styles.filterText, filters.type === item.value && styles.filterActive]}
            >
              {item.label}
            </Text>
          ))}
        </View>
        <MonthYearPickerField
          label="Tháng"
          value={monthValue}
          onChange={(next) => {
            const [year, month] = String(next).split("-");
            updateFilterMonthPart("year", year);
            updateFilterMonthPart("month", month);
          }}
        />
        <Text style={styles.label}>Danh mục</Text>
        <PillSelector
          items={filterItems}
          selectedValue={filters.categoryId}
          onChange={(value) => updateFilter("categoryId", value)}
        />
        <View style={styles.row}>
          <View style={styles.half}>
            <FormField
              label="Tiền từ"
              value={filters.minAmount}
              onChangeText={(value) => updateFilter("minAmount", value)}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.half}>
            <FormField
              label="Đến"
              value={filters.maxAmount}
              onChangeText={(value) => updateFilter("maxAmount", value)}
              placeholder="5000000"
              keyboardType="numeric"
            />
          </View>
        </View>
      </SectionCard>

      {selectedTransaction ? (
        <SectionCard title="Chi tiết giao dịch">
          <Text style={styles.detailLine}>Tên: {selectedTransaction.title}</Text>
          <Text style={styles.detailLine}>
            Loại: {selectedTransaction.type === "income" ? "Thu nhập" : "Chi tiêu"}
          </Text>
          <Text style={styles.detailLine}>Số tiền: {formatCurrency(selectedTransaction.amount)}</Text>
          <Text style={styles.detailLine}>Danh mục: {selectedTransaction.categoryName}</Text>
          <Text style={styles.detailLine}>Ngày: {formatShortDate(selectedTransaction.date)}</Text>
          <Text style={styles.detailLine}>Ghi chú: {selectedTransaction.note || "Không có"}</Text>
          <Text onPress={() => setSelectedTransaction(null)} style={styles.link}>
            Đóng
          </Text>
        </SectionCard>
      ) : null}

      <SectionCard title="Danh sách giao dịch">
        {filteredTransactions.length === 0 ? (
          <Text style={styles.emptyText}>Không có giao dịch phù hợp.</Text>
        ) : (
          filteredTransactions.map((item) => (
            <TransactionCard
              key={item.id}
              item={item}
              onView={setSelectedTransaction}
              onEdit={startEditTransaction}
              onDelete={deleteTransaction}
            />
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
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  pageTitle: {
    color: theme.colors.textOnDark,
    fontSize: 28,
    fontWeight: "800",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#22313b",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionButtonText: {
    color: theme.colors.textOnDark,
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  customTypeRow: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontWeight: "700",
  },
  filterActive: {
    color: theme.colors.accentDeep,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  half: {
    flex: 1,
  },
  detailLine: {
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  link: {
    color: theme.colors.accentDeep,
    fontWeight: "800",
  },
  emptyText: {
    color: theme.colors.textSecondary,
  },
});
