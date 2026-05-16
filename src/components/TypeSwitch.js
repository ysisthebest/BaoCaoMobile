import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

export function TypeSwitch({ value, onChange }) {
  const items = [
    { label: "Thu", value: "income" },
    { label: "Chi", value: "expense" },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            style={[styles.button, active && styles.buttonActive]}
            onPress={() => onChange(item.value)}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 18,
    padding: 4,
    gap: 6,
  },
  button: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
  },
  buttonActive: {
    backgroundColor: theme.colors.cardDark,
  },
  text: {
    color: theme.colors.textSecondary,
    fontWeight: "700",
  },
  textActive: {
    color: theme.colors.textOnDark,
  },
});
