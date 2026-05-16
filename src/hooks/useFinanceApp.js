import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

import { defaultBudgets, defaultCategories, defaultTransactions } from "../constants/defaultData";
import { STORAGE_KEYS } from "../constants/storage";
import { formatCurrency, getCurrentMonth, getTodayString } from "../utils/formatters";
import {
  buildDashboardSummary,
  buildExpensePie,
  buildMonthlyBars,
  calculateBudgetProgress,
  filterTransactions,
  resolveCategoryName,
} from "../utils/selectors";

const emptyAuthForm = {
  fullName: "",
  email: "",
  password: "",
};

const defaultDataState = {
  transactions: defaultTransactions,
  categories: defaultCategories,
  budgets: defaultBudgets,
};

const emptyTransactionForm = {
  id: null,
  title: "",
  amount: "",
  type: "expense",
  categoryId: "",
  date: getTodayString(),
  note: "",
};

const emptyCategoryForm = {
  id: null,
  name: "",
  type: "expense",
};

const emptyBudgetForm = {
  id: null,
  categoryId: "",
  limit: "",
  month: getCurrentMonth(),
};

const defaultFilters = {
  keyword: "",
  type: "all",
  month: getCurrentMonth(),
  categoryId: "",
  minAmount: "",
  maxAmount: "",
};

function createUserDataMap(parsedData) {
  if (!parsedData) {
    return {};
  }

  if (parsedData.byUser) {
    return parsedData.byUser;
  }

  if (
    Array.isArray(parsedData.transactions) ||
    Array.isArray(parsedData.categories) ||
    Array.isArray(parsedData.budgets)
  ) {
    return {
      demo: {
        transactions: parsedData.transactions || defaultTransactions,
        categories: parsedData.categories || defaultCategories,
        budgets: parsedData.budgets || defaultBudgets,
      },
    };
  }

  return parsedData;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function isValidMonth(month) {
  return /^\d{4}-\d{2}$/.test(month);
}

function isDigitsOnly(value) {
  return /^\d*$/.test(value);
}

export function useFinanceApp() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState(emptyAuthForm);
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [categories, setCategories] = useState(defaultCategories);
  const [budgets, setBudgets] = useState(defaultBudgets);
  const [transactionForm, setTransactionForm] = useState({
    ...emptyTransactionForm,
    categoryId: defaultCategories.find((item) => item.type !== "income")?.id || defaultCategories[0].id,
  });
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);
  const [budgetForm, setBudgetForm] = useState({
    ...emptyBudgetForm,
    categoryId: defaultCategories.find((item) => item.type !== "income")?.id || defaultCategories[0].id,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [allUserData, setAllUserData] = useState({});

  useEffect(() => {
    async function loadData() {
      try {
        const [savedUsers, savedSession, savedData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USERS),
          AsyncStorage.getItem(STORAGE_KEYS.SESSION),
          AsyncStorage.getItem(STORAGE_KEYS.DATA),
        ]);

        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        }
        if (savedSession) {
          setCurrentUser(JSON.parse(savedSession));
        }
        if (savedData) {
          setAllUserData(createUserDataMap(JSON.parse(savedData)));
        }
      } catch (error) {
        console.warn("Load data failed", error);
      } finally {
        setLoaded(true);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)).catch(console.warn);
  }, [loaded, users]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser)).catch(console.warn);
  }, [loaded, currentUser]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEYS.DATA, JSON.stringify({ byUser: allUserData })).catch(console.warn);
  }, [allUserData, loaded]);

  useEffect(() => {
    if (!loaded || !currentUser?.id) {
      return;
    }

    const userData = allUserData[currentUser.id] || defaultDataState;
    setTransactions(userData.transactions || defaultTransactions);
    setCategories(userData.categories || defaultCategories);
    setBudgets(userData.budgets || defaultBudgets);
    setFilters(defaultFilters);
    setSelectedTransaction(null);
  }, [currentUser?.id, loaded]);

  useEffect(() => {
    if (!loaded || !currentUser?.id) {
      return;
    }

    setAllUserData((current) => {
      const previous = current[currentUser.id];
      if (
        previous?.transactions === transactions &&
        previous?.categories === categories &&
        previous?.budgets === budgets
      ) {
        return current;
      }

      return {
        ...current,
        [currentUser.id]: { transactions, categories, budgets },
      };
    });
  }, [budgets, categories, currentUser?.id, loaded, transactions]);

  const availableTransactionCategories = useMemo(
    () => categories.filter((item) => item.type === "both" || item.type === transactionForm.type),
    [categories, transactionForm.type]
  );

  const expenseCategories = useMemo(
    () => categories.filter((item) => item.type !== "income"),
    [categories]
  );

  useEffect(() => {
    if (!availableTransactionCategories.length) {
      return;
    }

    const hasSelectedCategory = availableTransactionCategories.some(
      (item) => item.id === transactionForm.categoryId
    );
    if (!hasSelectedCategory) {
      setTransactionForm((current) => ({
        ...current,
        categoryId: availableTransactionCategories[0].id,
      }));
    }
  }, [availableTransactionCategories, transactionForm.categoryId]);

  useEffect(() => {
    if (!expenseCategories.length) {
      return;
    }

    const hasBudgetCategory = expenseCategories.some((item) => item.id === budgetForm.categoryId);
    if (!hasBudgetCategory) {
      setBudgetForm((current) => ({
        ...current,
        categoryId: expenseCategories[0].id,
      }));
    }
  }, [budgetForm.categoryId, expenseCategories]);

  const dashboardSummary = useMemo(
    () => buildDashboardSummary(transactions, categories, budgets, getCurrentMonth()),
    [budgets, categories, transactions]
  );

  const expensePie = useMemo(
    () => buildExpensePie(categories, transactions, getCurrentMonth()),
    [categories, transactions]
  );

  const monthlyBars = useMemo(() => buildMonthlyBars(transactions), [transactions]);

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(transactions, filters).sort((a, b) => b.date.localeCompare(a.date)),
    [filters, transactions]
  );

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 6)
        .map((item) => ({ ...item, categoryName: resolveCategoryName(categories, item.categoryId) })),
    [categories, transactions]
  );

  const transactionDetails = useMemo(
    () =>
      filteredTransactions.map((item) => ({
        ...item,
        categoryName: resolveCategoryName(categories, item.categoryId),
      })),
    [categories, filteredTransactions]
  );

  const budgetProgress = useMemo(
    () => calculateBudgetProgress(budgets, transactions, categories, getCurrentMonth()),
    [budgets, categories, transactions]
  );

  const notifications = useMemo(
    () =>
      budgetProgress
        .filter((item) => item.percent >= 80)
        .map((item) => ({
          id: item.id,
          level: item.percent > 100 ? "danger" : "warning",
          title:
            item.percent > 100
              ? `Đã vượt ngân sách ${item.categoryName}`
              : `Ngân sách ${item.categoryName} sắp đầy`,
          message:
            item.percent > 100
              ? `${item.categoryName} đã dùng ${item.percent}% ngân sách tháng này.`
              : `${item.categoryName} đã dùng ${item.percent}% ngân sách tháng này, nên kiểm soát chi tiêu.`,
        })),
    [budgetProgress]
  );

  function updateAuthForm(field, value) {
    setAuthForm((current) => ({ ...current, [field]: value }));
  }

  function register() {
    const { fullName, email, password } = authForm;

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }
    if (fullName.trim().length < 3) {
      Alert.alert("Họ tên chưa hợp lệ", "Họ tên phải có ít nhất 3 ký tự.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert("Email chưa hợp lệ", "Vui lòng nhập đúng định dạng email.");
      return;
    }
    if (password.trim().length < 6) {
      Alert.alert("Mật khẩu quá ngắn", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
      Alert.alert("Email đã tồn tại", "Vui lòng dùng email khác.");
      return;
    }

    const user = {
      id: `${Date.now()}`,
      fullName: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
    };
    setUsers((current) => [...current, user]);
    setAllUserData((current) => ({
      ...current,
      [user.id]: defaultDataState,
    }));
    setCurrentUser({ id: user.id, fullName: user.fullName, email: user.email });
    setAuthForm(emptyAuthForm);
  }

  function login() {
    if (!authForm.email.trim() || !authForm.password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
      return;
    }
    if (!isValidEmail(authForm.email.trim())) {
      Alert.alert("Email chưa hợp lệ", "Vui lòng nhập đúng định dạng email.");
      return;
    }

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === authForm.email.toLowerCase() &&
        item.password === authForm.password
    );
    if (!user) {
      Alert.alert("Đăng nhập thất bại", "Sai email hoặc mật khẩu.");
      return;
    }
    setCurrentUser({ id: user.id, fullName: user.fullName, email: user.email });
    setAuthForm(emptyAuthForm);
  }

  function logout() {
    setCurrentUser(null);
    setAuthMode("login");
  }

  function updateTransactionForm(field, value) {
    if (field === "amount" && !isDigitsOnly(value)) {
      Alert.alert("Số tiền chưa hợp lệ", "Chỉ được nhập số dương.");
      return;
    }
    setTransactionForm((current) => ({ ...current, [field]: value }));
  }

  function resetTransactionForm() {
    setTransactionForm({
      ...emptyTransactionForm,
      type: "expense",
      categoryId: expenseCategories[0]?.id || categories[0]?.id || "",
      date: getTodayString(),
    });
  }

  function saveTransaction() {
    const amount = Number(String(transactionForm.amount).replace(/[^0-9]/g, ""));
    if (!transactionForm.title.trim() || !amount || !transactionForm.categoryId || !transactionForm.date) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ tên, số tiền, ngày và danh mục.");
      return;
    }
    if (transactionForm.title.trim().length < 2) {
      Alert.alert("Tên giao dịch chưa hợp lệ", "Tên giao dịch phải có ít nhất 2 ký tự.");
      return;
    }
    if (!isValidDate(transactionForm.date)) {
      Alert.alert("Ngày chưa hợp lệ", "Vui lòng nhập ngày theo định dạng YYYY-MM-DD.");
      return;
    }
    if (amount <= 0) {
      Alert.alert("Số tiền chưa hợp lệ", "Số tiền phải lớn hơn 0.");
      return;
    }

    const payload = {
      id: transactionForm.id || `${Date.now()}`,
      title: transactionForm.title.trim(),
      amount,
      type: transactionForm.type,
      categoryId: transactionForm.categoryId,
      date: transactionForm.date,
      note: transactionForm.note.trim(),
    };

    setTransactions((current) =>
      transactionForm.id
        ? current.map((item) => (item.id === transactionForm.id ? payload : item))
        : [payload, ...current]
    );
    resetTransactionForm();
  }

  function startEditTransaction(item) {
    setTransactionForm({
      id: item.id,
      title: item.title,
      amount: String(item.amount),
      type: item.type,
      categoryId: item.categoryId,
      date: item.date,
      note: item.note || "",
    });
  }

  function deleteTransaction(id) {
    setTransactions((current) => current.filter((item) => item.id !== id));
    if (selectedTransaction?.id === id) {
      setSelectedTransaction(null);
    }
  }

  function updateCategoryForm(field, value) {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  }

  function saveCategory() {
    if (!categoryForm.name.trim()) {
      Alert.alert("Thiếu tên danh mục", "Vui lòng nhập tên danh mục.");
      return;
    }
    if (categoryForm.name.trim().length < 2) {
      Alert.alert("Tên danh mục chưa hợp lệ", "Tên danh mục phải có ít nhất 2 ký tự.");
      return;
    }
    const duplicated = categories.some(
      (item) =>
        item.id !== categoryForm.id &&
        item.name.toLowerCase() === categoryForm.name.trim().toLowerCase() &&
        item.type === categoryForm.type
    );
    if (duplicated) {
      Alert.alert("Danh mục đã tồn tại", "Vui lòng chọn tên khác cho danh mục này.");
      return;
    }

    const payload = {
      id: categoryForm.id || `${Date.now()}`,
      name: categoryForm.name.trim(),
      type: categoryForm.type,
    };
    setCategories((current) =>
      categoryForm.id
        ? current.map((item) => (item.id === categoryForm.id ? payload : item))
        : [...current, payload]
    );
    setCategoryForm(emptyCategoryForm);
  }

  function startEditCategory(item) {
    setCategoryForm({
      id: item.id,
      name: item.name,
      type: item.type || "expense",
    });
  }

  function deleteCategory(id) {
    const used =
      transactions.some((item) => item.categoryId === id) || budgets.some((item) => item.categoryId === id);
    if (used) {
      Alert.alert("Không thể xóa", "Danh mục đang được sử dụng trong giao dịch hoặc ngân sách.");
      return;
    }
    setCategories((current) => current.filter((item) => item.id !== id));
  }

  function updateBudgetForm(field, value) {
    if (field === "limit" && !isDigitsOnly(value)) {
      Alert.alert("Hạn mức chưa hợp lệ", "Chỉ được nhập số dương.");
      return;
    }
    setBudgetForm((current) => ({ ...current, [field]: value }));
  }

  function updateBudgetMonthPart(part, value) {
    const [year, month] = budgetForm.month.split("-");
    const next = {
      year,
      month,
      [part]: value,
    };
    setBudgetForm((current) => ({
      ...current,
      month: `${next.year}-${next.month}`,
    }));
  }

  function saveBudget() {
    const limit = Number(String(budgetForm.limit).replace(/[^0-9]/g, ""));
    if (!budgetForm.categoryId || !budgetForm.month || !limit) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đủ danh mục, tháng và hạn mức.");
      return;
    }
    if (!isValidMonth(budgetForm.month)) {
      Alert.alert("Tháng chưa hợp lệ", "Vui lòng nhập tháng theo định dạng YYYY-MM.");
      return;
    }
    if (limit <= 0) {
      Alert.alert("Hạn mức chưa hợp lệ", "Hạn mức phải lớn hơn 0.");
      return;
    }
    const duplicated = budgets.some(
      (item) =>
        item.id !== budgetForm.id &&
        item.categoryId === budgetForm.categoryId &&
        item.month === budgetForm.month
    );
    if (duplicated) {
      Alert.alert("Ngân sách đã tồn tại", "Danh mục này đã có ngân sách trong tháng đã chọn.");
      return;
    }

    const payload = {
      id: budgetForm.id || `${Date.now()}`,
      categoryId: budgetForm.categoryId,
      month: budgetForm.month,
      limit,
    };
    setBudgets((current) =>
      budgetForm.id
        ? current.map((item) => (item.id === budgetForm.id ? payload : item))
        : [...current, payload]
    );
    setBudgetForm({
      ...emptyBudgetForm,
      categoryId: expenseCategories[0]?.id || "",
      month: getCurrentMonth(),
    });
  }

  function startEditBudget(item) {
    setBudgetForm({
      id: item.id,
      categoryId: item.categoryId,
      month: item.month,
      limit: String(item.limit),
    });
  }

  function deleteBudget(id) {
    setBudgets((current) => current.filter((item) => item.id !== id));
  }

  function updateFilter(field, value) {
    if ((field === "minAmount" || field === "maxAmount") && !isDigitsOnly(value)) {
      Alert.alert("Bộ lọc số tiền chưa hợp lệ", "Chỉ được nhập số dương.");
      return;
    }
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function updateFilterMonthPart(part, value) {
    const [year, month] = filters.month.split("-");
    const next = {
      year,
      month,
      [part]: value,
    };
    setFilters((current) => ({
      ...current,
      month: `${next.year}-${next.month}`,
    }));
  }

  const profileSummary = {
    transactionCount: transactions.length,
    categoryCount: categories.length,
    budgetCount: budgets.length,
    incomeCategories: categories.filter((item) => item.type === "income").length,
    expenseCategories: categories.filter((item) => item.type === "expense" || item.type === "both").length,
  };

  return {
    currentUser,
    authMode,
    setAuthMode,
    authForm,
    updateAuthForm,
    register,
    login,
    logout,
    categories,
    expenseCategories,
    availableTransactionCategories,
    transactions,
    budgets,
    transactionForm,
    updateTransactionForm,
    resetTransactionForm,
    saveTransaction,
    startEditTransaction,
    deleteTransaction,
    categoryForm,
    updateCategoryForm,
    saveCategory,
    startEditCategory,
    deleteCategory,
    budgetForm,
    updateBudgetForm,
    updateBudgetMonthPart,
    saveBudget,
    startEditBudget,
    deleteBudget,
    filters,
    updateFilter,
    updateFilterMonthPart,
    filteredTransactions: transactionDetails,
    dashboardSummary,
    expensePie,
    monthlyBars,
    recentTransactions,
    budgetProgress,
    notifications,
    selectedTransaction,
    setSelectedTransaction,
    profileSummary,
    formatCurrency,
  };
}
