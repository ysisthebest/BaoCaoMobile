export const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  return currencyFormatter.format(value || 0);
}

export function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}

export function getCurrentMonth() {
  return getTodayString().slice(0, 7);
}

export function formatMonthLabel(monthValue) {
  if (!monthValue) {
    return "";
  }

  const [year, month] = monthValue.split("-");
  return `Tháng ${month}/${year}`;
}

export function formatShortDate(dateValue) {
  if (!dateValue) {
    return "";
  }

  const [year, month, day] = dateValue.split("-");
  return `${day}/${month}/${year}`;
}

export function getYearOptions(range = 3) {
  const currentYear = Number(getTodayString().slice(0, 4));
  return Array.from({ length: range * 2 + 1 }, (_, index) => {
    const year = currentYear - range + index;
    return { label: String(year), value: String(year) };
  });
}

export function getMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { label: value, value };
  });
}

export function getDayOptions(year, month) {
  const safeYear = Number(year) || Number(getTodayString().slice(0, 4));
  const safeMonth = Number(month) || 1;
  const daysInMonth = new Date(safeYear, safeMonth, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { label: value, value };
  });
}
