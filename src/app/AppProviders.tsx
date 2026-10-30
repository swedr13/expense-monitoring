import { useMemo, useState, type ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { App as AntApp, ConfigProvider } from "antd";
import { AuthProvider } from "@/features/identity/AuthProvider";
import { createQueryClient } from "./queryClient";
import { componentConfig, getThemeConfig } from "./theme";
import { ThemeBridge } from "./ThemeBridge";
import { useThemePreference } from "./useThemePreference";
import "./global.css";

/** Everything the app needs around its routes. Tests render this too. */
export const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(createQueryClient);
  const { isDark, primary } = useThemePreference();
  const themeConfig = useMemo(() => getThemeConfig(isDark, primary), [isDark, primary]);

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig} {...componentConfig}>
        <AntApp>
          <ThemeBridge isDark={isDark} />
          <AuthProvider>{children}</AuthProvider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
