import React, { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { theme } from "../theme";
import { formatShortDate } from "../utils/formatters";

function parseDateValue(value) {
  if (!value) {
    return new Date();
  }
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!year || !month || !day) {
    return new Date();
  }
  return new Date(year, month - 1, day);
}

function formatDateValue(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePickerField({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const current = useMemo(() => parseDateValue(value), [value]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={() => setOpen(true)} style={styles.input} accessibilityRole="button">
        <Text style={styles.value}>{value ? formatShortDate(value) : "Chọn ngày"}</Text>
      </Pressable>
      {open ? (
        <DateTimePicker
          value={current}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_, selectedDate) => {
            if (Platform.OS !== "ios") {
              setOpen(false);
            }
            if (selectedDate) {
              onChange(formatDateValue(selectedDate));
            }
          }}
        />
      ) : null}
      {open && Platform.OS === "ios" ? (
        <Pressable onPress={() => setOpen(false)} style={styles.done} accessibilityRole="button">
          <Text style={styles.doneText}>Xong</Text>
        </Pressable>
      ) : null}
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
  input: {
    backgroundColor: "#fffaf2",
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  value: {
    color: theme.colors.textPrimary,
    fontWeight: "800",
  },
  done: {
    alignSelf: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.colors.cardDark,
  },
  doneText: {
    color: theme.colors.textOnDark,
    fontWeight: "800",
  },
});

