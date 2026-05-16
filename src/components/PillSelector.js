import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { theme } from "../theme";

export function PillSelector({ items, selectedValue, onChange }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {items.map((item) => {
        const active = item.value === selectedValue;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.pill, active && styles.pillActive]}
          >
            <Text style={[styles.text, active && styles.textActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
  },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.line,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fffaf2",
  },
  pillActive: {
    backgroundColor: theme.colors.cardDark,
    borderColor: theme.colors.cardDark,
  },
  text: {
    color: theme.colors.textSecondary,
    fontWeight: "700",
  },
  textActive: {
    color: theme.colors.textOnDark,
  },
});
