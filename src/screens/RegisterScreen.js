import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { theme } from "../theme";

export function RegisterScreen({
  fullName,
  email,
  password,
  onChange,
  onSubmit,
  onSwitchMode,
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroBadge}>
          <Ionicons name="person-add-outline" size={22} color={theme.colors.textOnDark} />
        </View>
        <Text style={styles.title}>Tạo tài khoản mới</Text>
      </View>

      <View style={styles.card}>
        <FormField
          label="Họ và tên"
          value={fullName}
          onChangeText={(value) => onChange("fullName", value)}
          placeholder="Nguyễn Văn A"
        />
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
          placeholder="Tạo mật khẩu"
          secureTextEntry
        />
        <PrimaryButton title="Đăng ký" onPress={onSubmit} />
        <Text onPress={onSwitchMode} style={styles.link}>
          Đã có tài khoản? Đăng nhập
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
    paddingTop: 44,
    gap: 18,
  },
  hero: {
    backgroundColor: "#263640",
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
