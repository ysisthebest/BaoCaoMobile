import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { SectionCard } from "../components/SectionCard";
import { theme } from "../theme";

export function NotificationsScreen({ notifications }) {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.pageTitle}>Thông báo</Text>

      {notifications.length === 0 ? (
        <SectionCard title="Cảnh báo ngân sách">
          <Text style={styles.emptyText}>Chưa có cảnh báo nào. Mọi ngân sách vẫn đang an toàn.</Text>
        </SectionCard>
      ) : (
        notifications.map((item) => (
          <View
            key={item.id}
            style={[styles.noticeCard, item.level === "danger" ? styles.noticeDanger : styles.noticeWarn]}
          >
            <Ionicons
              name={item.level === "danger" ? "alert-circle" : "warning-outline"}
              size={20}
              color={item.level === "danger" ? theme.colors.danger : theme.colors.accentDeep}
            />
            <View style={styles.noticeInfo}>
              <Text style={styles.noticeTitle}>{item.title}</Text>
              <Text style={styles.noticeText}>{item.message}</Text>
            </View>
          </View>
        ))
      )}
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
  emptyText: {
    color: theme.colors.textSecondary,
  },
  noticeCard: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
  },
  noticeWarn: {
    backgroundColor: "#fff4e8",
    borderColor: "#f1cfab",
  },
  noticeDanger: {
    backgroundColor: "#ffe8e1",
    borderColor: "#eab8aa",
  },
  noticeInfo: {
    flex: 1,
    gap: 4,
  },
  noticeTitle: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  noticeText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
