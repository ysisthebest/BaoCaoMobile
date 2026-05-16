import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { theme } from "../theme";

export function ScreenHeader({ eyebrow, title, description }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  eyebrow: {
    color: "#d3ddd8",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    color: theme.colors.textOnDark,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
  },
  description: {
    color: "#d9e3de",
    fontSize: 14,
    lineHeight: 21,
  },
});
