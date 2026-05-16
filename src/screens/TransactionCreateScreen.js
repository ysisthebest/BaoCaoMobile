import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { DatePickerField } from "../components/DatePickerField";
import { FormField } from "../components/FormField";
import { PillSelector } from "../components/PillSelector";
import { PrimaryButton } from "../components/PrimaryButton";
import { SectionCard } from "../components/SectionCard";
import { TypeSwitch } from "../components/TypeSwitch";
import { theme } from "../theme";

export function TransactionCreateScreen({
  availableTransactionCategories,
  transactionForm,
  updateTransactionForm,
  resetTransactionForm,
  saveTransaction,
  onBack,
}) {
  const categoryItems = availableTransactionCategories.map((item) => ({ label: item.name, value: item.id }));

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.pageHeader}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={18} color={theme.colors.textOnDark} />
            <Text style={styles.backText}>Trở về Giao dịch</Text>
          </Pressable>
          <Text style={styles.pageTitle}>Thêm giao dịch</Text>
        </View>

        <SectionCard
          title={transactionForm.id ? "Cập nhật giao dịch" : "Thêm giao dịch mới"}
          action={
            <Text onPress={resetTransactionForm} style={styles.link}>
              Làm mới
            </Text>
          }
        >
          <TypeSwitch
            value={transactionForm.type}
            onChange={(value) => updateTransactionForm("type", value)}
          />
          <FormField
            label="Tên giao dịch"
            value={transactionForm.title}
            onChangeText={(value) => updateTransactionForm("title", value)}
            placeholder="Ví dụ: Tiền ăn, lương tháng"
          />
          <FormField
            label="Số tiền"
            value={transactionForm.amount}
            onChangeText={(value) => updateTransactionForm("amount", value)}
            placeholder="250000"
            keyboardType="numeric"
          />
          <DatePickerField
            label="Ngày"
            value={transactionForm.date}
            onChange={(next) => updateTransactionForm("date", next)}
          />
          <Text style={styles.label}>Danh mục</Text>
          <PillSelector
            items={categoryItems}
            selectedValue={transactionForm.categoryId}
            onChange={(value) => updateTransactionForm("categoryId", value)}
          />
          <FormField
            label="Ghi chú"
            value={transactionForm.note}
            onChangeText={(value) => updateTransactionForm("note", value)}
            placeholder="Nội dung thêm"
            multiline
          />
          <PrimaryButton
            title={transactionForm.id ? "Lưu thay đổi" : "Thêm giao dịch"}
            onPress={() => {
              saveTransaction();
              onBack();
            }}
          />
        </SectionCard>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  },
  pageHeader: {
    gap: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "#22313b",
    borderWidth: 1,
    borderColor: "#314756",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  backText: {
    color: theme.colors.textOnDark,
    fontWeight: "700",
  },
  link: {
    color: theme.colors.accentDeep,
    fontWeight: "800",
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
});
