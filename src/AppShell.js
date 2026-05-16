import React, { useMemo, useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { BottomNav } from "./components/BottomNav";
import { CategoryScreen } from "./screens/CategoryScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { NotificationsScreen } from "./screens/NotificationsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { TransactionScreen } from "./screens/TransactionScreen";
import { TransactionCreateScreen } from "./screens/TransactionCreateScreen";
import { BudgetScreen } from "./screens/BudgetScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { useFinanceApp } from "./hooks/useFinanceApp";
import { theme } from "./theme";

const tabs = [
  { key: "dashboard", label: "Tổng quan", icon: { library: Ionicons, name: "grid-outline" } },
  { key: "transactions", label: "Giao dịch", icon: { library: MaterialCommunityIcons, name: "swap-horizontal-circle-outline" } },
  { key: "notifications", label: "Báo động", icon: { library: Ionicons, name: "notifications-outline" } },
  { key: "budgets", label: "Ngân sách", icon: { library: MaterialCommunityIcons, name: "wallet-outline" } },
  { key: "profile", label: "Tài khoản", icon: { library: Ionicons, name: "person-circle-outline" } },
];

export function AppShell() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const app = useFinanceApp();

  const sharedProps = useMemo(
    () => ({
      ...app,
      onNavigate: setActiveTab,
    }),
    [app]
  );

  if (!app.currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        {app.authMode === "login" ? (
          <LoginScreen
            email={app.authForm.email}
            password={app.authForm.password}
            onChange={app.updateAuthForm}
            onSubmit={app.login}
            onSwitchMode={() => app.setAuthMode("register")}
          />
        ) : (
          <RegisterScreen
            fullName={app.authForm.fullName}
            email={app.authForm.email}
            password={app.authForm.password}
            onChange={app.updateAuthForm}
            onSubmit={app.register}
            onSwitchMode={() => app.setAuthMode("login")}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <View style={styles.appFrame}>
        <View style={styles.screenArea}>
          {activeTab === "dashboard" ? <DashboardScreen {...sharedProps} /> : null}
          {activeTab === "transactions" ? <TransactionScreen {...sharedProps} /> : null}
          {activeTab === "transaction-create" ? (
            <TransactionCreateScreen {...sharedProps} onBack={() => setActiveTab("transactions")} />
          ) : null}
          {activeTab === "notifications" ? <NotificationsScreen {...sharedProps} /> : null}
          {activeTab === "categories" ? <CategoryScreen {...sharedProps} /> : null}
          {activeTab === "budgets" ? <BudgetScreen {...sharedProps} /> : null}
          {activeTab === "profile" ? <ProfileScreen {...sharedProps} /> : null}
        </View>
        <BottomNav items={tabs} activeKey={activeTab} onChange={setActiveTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.canvas,
  },
  appFrame: {
    flex: 1,
  },
  screenArea: {
    flex: 1,
  },
});
