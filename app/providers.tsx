"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./auth-context";
import { Provider } from "react-redux";
import { store } from "@/app/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
          {children}
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}
