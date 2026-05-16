import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SectionCard } from "../components/SectionCard";
import { theme } from "../theme";

export function ProfileScreen({ currentUser, profileSummary, logout }) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Tài khoản</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Image source={require("../assets/avt-profile.jpg")} style={styles.avatarImage} />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{currentUser.fullName}</Text>
          <Text style={styles.email}>{currentUser.email}</Text>
        </View>
      </View>

      <SectionCard title="Thông tin tài khoản">
        <Text style={styles.line}>Danh mục thu nhập: {profileSummary.incomeCategories}</Text>
        <Text style={styles.line}>Danh mục chi tiêu: {profileSummary.expenseCategories}</Text>
        <Text style={styles.line}>Tổng số giao dịch: {profileSummary.transactionCount}</Text>
      </SectionCard>

      <SectionCard title="Phiên đăng nhập">
        <PrimaryButton title="Đăng xuất" tone="dark" onPress={logout} />
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
  profileCard: {
    backgroundColor: "#23333c",
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#385463",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#f8f4ec",
    fontSize: 20,
    fontWeight: "800",
  },
  email: {
    color: "#c7d2d9",
  },
  line: {
    color: "#1b1b1b",
    lineHeight: 22,
  },
});
