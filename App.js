import React from "react";
import { StatusBar } from "react-native";

import { AppShell } from "./src/AppShell";

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <AppShell />
    </>
  );
}
