import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { SectionCard } from "../components/SectionCard";
import { TypeSwitch } from "../components/TypeSwitch";
import { theme } from "../theme";

export function CategoryScreen({
  categories,
  categoryForm,
  updateCategoryForm,
  saveCategory,
  startEditCategory,
  deleteCategory,
  onNavigate,
}) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.pageHeader}>
        <Pressable style={styles.backButton} onPress={() => onNavigate("budgets")}>
          <Ionicons name="arrow-back" size={18} color={theme.colors.textOnDark} />
          <Text style={styles.backText}>Trở về Ngân sách</Text>
        </Pressable>
        <Text style={styles.pageTitle}>Quản lý danh mục</Text>
      </View>

      <SectionCard title={categoryForm.id ? "Cập nhật danh mục" : "Thêm danh mục"}>
        <TypeSwitch
          value={categoryForm.type === "income" ? "income" : "expense"}
          onChange={(value) => updateCategoryForm("type", value)}
        />
        <FormField
          label="Tên danh mục"
          value={categoryForm.name}
          onChangeText={(value) => updateCategoryForm("name", value)}
          placeholder="Ví dụ: Mua sắm"
        />
        <PrimaryButton
          title={categoryForm.id ? "Lưu danh mục" : "Thêm danh mục"}
          onPress={saveCategory}
        />
      </SectionCard>

      <SectionCard title="Danh sách danh mục">
        {categories.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có danh mục nào.</Text>
        ) : (
          categories.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.categoryInfo}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.typeText}>
                  {item.type === "income" ? "Thu nhập" : item.type === "both" ? "Dùng chung" : "Chi tiêu"}
                </Text>
              </View>
              <View style={styles.actions}>
                <Text onPress={() => startEditCategory(item)} style={styles.link}>
                  Sửa
                </Text>
                <Text onPress={() => deleteCategory(item.id)} style={styles.delete}>
                  Xóa
                </Text>
              </View>
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
  emptyText: {
    color: theme.colors.textSecondary,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#efe5d7",
  },
  categoryInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  typeText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
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
