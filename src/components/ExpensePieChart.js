import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { theme } from "../theme";
import { PIE_COLORS } from "./PieLegend";

export function ExpensePieChart({ items }) {
  const size = 188;
  const strokeWidth = 30;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  let accumulated = 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.chartFrame}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {items.map((item, index) => {
            const segmentLength = total ? (item.amount / total) * circumference : 0;
            const dashArray = `${segmentLength} ${circumference - segmentLength}`;
            const dashOffset = -accumulated;
            accumulated += segmentLength;

            return (
              <Circle
                key={item.categoryId}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={PIE_COLORS[index % PIE_COLORS.length]}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                rotation="-90"
                origin={`${size / 2}, ${size / 2}`}
                strokeLinecap="butt"
              />
            );
          })}
        </Svg>
        <View style={styles.centerLabel}>
          <Text style={styles.centerValue}>{items.length}</Text>
          <Text style={styles.centerText}>Danh mục</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  chartFrame: {
    width: 188,
    height: 188,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    gap: 2,
  },
  centerValue: {
    color: theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "800",
  },
  centerText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
});
