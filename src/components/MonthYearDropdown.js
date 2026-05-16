import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";

import { theme } from "../theme";

function normalizePickerValue(value, fallback) {
  if (value === undefined || value === null) {
    return fallback;
  }
  return String(value);
}

export function MonthYearDropdown({
  label,
  yearItems,
  monthItems,
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) {
  const safeYear = normalizePickerValue(selectedYear, yearItems?.[0]?.value || "");
  const safeMonth = normalizePickerValue(selectedMonth, monthItems?.[0]?.value || "");

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <View style={styles.control}>
          <Text style={styles.caption}>Năm</Text>
          <View style={styles.pickerFrame}>
            <Picker selectedValue={safeYear} onValueChange={(value) => onYearChange(String(value))}>
              {yearItems.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
        <View style={styles.control}>
          <Text style={styles.caption}>Tháng</Text>
          <View style={styles.pickerFrame}>
            <Picker selectedValue={safeMonth} onValueChange={(value) => onMonthChange(String(value))}>
              {monthItems.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  caption: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  control: {
    flex: 1,
    gap: 6,
  },
  pickerFrame: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    backgroundColor: "#fffaf2",
    overflow: "hidden",
  },
});

