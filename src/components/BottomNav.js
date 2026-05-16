import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

export function BottomNav({ items, activeKey, onChange }) {
  return (
    <View style={styles.shell}>
      <View style={styles.nav}>
        {items.map((item) => {
          const active = item.key === activeKey;
          const Icon = item.icon.library;

          return (
            <Pressable key={item.key} style={styles.item} onPress={() => onChange(item.key)}>
              <Icon
                name={item.icon.name}
                size={20}
                color={active ? theme.colors.textOnDark : "#8ea0a8"}
              />
              <Text style={[styles.label, active && styles.activeText]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 18,
    backgroundColor: "rgba(15, 23, 32, 0.92)",
  },
  nav: {
    flexDirection: "row",
    backgroundColor: theme.colors.nav,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#223240",
  },
  item: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  label: {
    color: "#8ea0a8",
    fontSize: 11,
    fontWeight: "700",
  },
  activeText: {
    color: theme.colors.textOnDark,
  },
});
