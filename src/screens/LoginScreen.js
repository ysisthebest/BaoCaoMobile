import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { theme } from "../theme";

export function LoginScreen({ email, password, onChange, onSubmit, onSwitchMode }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.subtitle}>Đăng nhập để theo dõi thu chi và quản lý ngân sách.</Text>
      </View>

      <View style={styles.card}>
        <FormField
          label="Email"
          value={email}
          onChangeText={(value) => onChange("email", value)}
          placeholder="example@gmail.com"
        />
        <FormField
          label="Mật khẩu"
          value={password}
          onChangeText={(value) => onChange("password", value)}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
        <PrimaryButton title="Đăng nhập" onPress={onSubmit} />
        <Text onPress={onSwitchMode} style={styles.link}>
          Chưa có tài khoản? Đăng ký
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    gap: 18,
  },
  hero: {
    backgroundColor: "#193a36",
    borderRadius: 30,
    padding: 22,
    gap: 12,
  },
  heroBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#d9e3de",
    lineHeight: 21,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  link: {
    textAlign: "center",
    color: theme.colors.accentDeep,
    fontWeight: "700",
  },
});
