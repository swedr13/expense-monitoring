import { Suspense } from "react";
import { Skeleton } from "antd";
import { Link, Outlet } from "react-router";
import { RequireDevice } from "@/features/identity/components/RequireDevice";
import { OfflineBanner } from "@/shared/components/OfflineBanner";
import { AppNav } from "./AppNav";
import {
  backdrop,
  brand,
  brandLogo,
  brandText,
  content,
  header,
  headerEnd,
  orbits,
  rings,
  shell,
} from "./layout.css";
import { ThemeModeToggle, ThemePicker } from "./ThemePicker";

export const AppLayout = () => (
  <div className={shell}>
    <div className={backdrop} aria-hidden="true">
      <div className={orbits.top}>
        <span className={rings.sm} />
        <span className={rings.md} />
        <span className={rings.lg} />
      </div>
      <div className={orbits.bottom}>
        <span className={rings.sm} />
        <span className={rings.md} />
      </div>
    </div>
    <header className={header}>
      <Link to="/" className={brand}>
        <img src="/pwa-64x64.png" alt="" width={64} height={64} className={brandLogo} />
        <span className={brandText}>Expense Monitoring</span>
      </Link>
      <div className={headerEnd}>
        <ThemeModeToggle />
        <AppNav />
      </div>
    </header>
    <OfflineBanner />
    <main className={content}>
      <RequireDevice>
        <Suspense fallback={<Skeleton active />}>
          <Outlet />
        </Suspense>
      </RequireDevice>
    </main>
    <ThemePicker />
  </div>
);
