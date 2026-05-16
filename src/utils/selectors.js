import { getCurrentMonth } from "./formatters";

export function resolveCategoryName(categories, categoryId) {
  return categories.find((item) => item.id === categoryId)?.name || "Chưa phân loại";
}

export function getMonthTransactions(transactions, month = getCurrentMonth()) {
  return transactions.filter((item) => item.date.slice(0, 7) === month);
}

export function getPreviousMonth(month = getCurrentMonth()) {
  const [yearText, monthText] = month.split("-");
  const year = Number(yearText);
  const monthNumber = Number(monthText);

  if (monthNumber === 1) {
    return `${year - 1}-12`;
  }

  return `${year}-${String(monthNumber - 1).padStart(2, "0")}`;
}

export function buildDashboardSummary(transactions, categories, budgets, month = getCurrentMonth()) {
  const monthly = getMonthTransactions(transactions, month);
  const previousMonth = getPreviousMonth(month);
  const previousMonthly = getMonthTransactions(transactions, previousMonth);

  const incomeMonth = monthly
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const expenseMonth = monthly
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const previousExpense = previousMonthly
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);
  const monthlyExpenses = monthly.filter((item) => item.type === "expense");
  const topExpense = monthlyExpenses.sort((a, b) => b.amount - a.amount)[0] || null;
  const monthlyBudgets = budgets.filter((item) => item.month === month);
  const overBudgetCount = monthlyBudgets.filter((budget) => {
    const spent = monthlyExpenses
      .filter((item) => item.categoryId === budget.categoryId)
      .reduce((sum, item) => sum + item.amount, 0);
    return spent > budget.limit;
  }).length;

  return {
    incomeMonth,
    expenseMonth,
    balance: totalIncome - totalExpense,
    netMonth: incomeMonth - expenseMonth,
    savingsRate: incomeMonth ? Math.max(0, Math.round(((incomeMonth - expenseMonth) / incomeMonth) * 100)) : 0,
    expenseTrend:
      previousExpense === 0 ? 0 : Math.round(((expenseMonth - previousExpense) / previousExpense) * 100),
    transactionCountMonth: monthly.length,
    averageExpense:
      monthlyExpenses.length > 0
        ? Math.round(monthlyExpenses.reduce((sum, item) => sum + item.amount, 0) / monthlyExpenses.length)
        : 0,
    overBudgetCount,
    topExpenseLabel: topExpense
      ? `${topExpense.title} • ${resolveCategoryName(categories, topExpense.categoryId)}`
      : "Chưa có khoản chi nổi bật",
  };
}

export function buildExpensePie(categories, transactions, month = getCurrentMonth()) {
  const monthlyExpenses = getMonthTransactions(transactions, month).filter(
    (item) => item.type === "expense"
  );
  const total = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
  if (!total) {
    return [];
  }

  const grouped = monthlyExpenses.reduce((acc, item) => {
    acc[item.categoryId] = (acc[item.categoryId] || 0) + item.amount;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([categoryId, amount]) => ({
      categoryId,
      name: resolveCategoryName(categories, categoryId),
      amount,
      percent: Math.round((amount / total) * 100),
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildMonthlyBars(transactions) {
  const grouped = transactions.reduce((acc, item) => {
    const month = item.date.slice(0, 7);
    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }
    acc[month][item.type === "income" ? "income" : "expense"] += item.amount;
    return acc;
  }, {});

  return Object.values(grouped)
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-5);
}

export function filterTransactions(transactions, filters) {
  return transactions.filter((item) => {
    const matchKeyword =
      !filters.keyword ||
      item.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
      (item.note || "").toLowerCase().includes(filters.keyword.toLowerCase());
    const matchType = filters.type === "all" || item.type === filters.type;
    const matchMonth = !filters.month || item.date.slice(0, 7) === filters.month;
    const matchCategory = !filters.categoryId || item.categoryId === filters.categoryId;
    const matchMin = !filters.minAmount || item.amount >= Number(filters.minAmount);
    const matchMax = !filters.maxAmount || item.amount <= Number(filters.maxAmount);
    return matchKeyword && matchType && matchMonth && matchCategory && matchMin && matchMax;
  });
}

export function calculateBudgetProgress(budgets, transactions, categories, month = getCurrentMonth()) {
  return budgets
    .filter((item) => item.month === month)
    .map((budget) => {
      const spent = transactions
        .filter(
          (item) =>
            item.type === "expense" &&
            item.categoryId === budget.categoryId &&
            item.date.slice(0, 7) === budget.month
        )
        .reduce((sum, item) => sum + item.amount, 0);
      const percent = budget.limit ? Math.round((spent / budget.limit) * 100) : 0;
      return {
        ...budget,
        spent,
        percent,
        remaining: Math.max(0, budget.limit - spent),
        categoryName: resolveCategoryName(categories, budget.categoryId),
      };
    })
    .sort((a, b) => b.percent - a.percent);
}
