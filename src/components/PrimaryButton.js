import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "../theme";

export function PrimaryButton({ title, onPress, tone = "accent" }) {
  return (
    <Pressable
      style={[styles.button, tone === "dark" ? styles.dark : styles.accent]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    paddingVertical: 15,
    alignItems: "center",
  },
  accent: {
    backgroundColor: theme.colors.accent,
  },
  dark: {
    backgroundColor: theme.colors.cardDark,
  },
  text: {
    color: theme.colors.textOnDark,
    fontWeight: "800",
    fontSize: 15,
  },
});
