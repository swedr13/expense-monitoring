import { Suspense } from "react";
import { Skeleton } from "antd";
import { Link, Outlet } from "react-router";
import { RequireDevice } from "@/features/identity/components/RequireDevice";
import { OfflineBanner } from "@/shared/components/OfflineBanner";
import { AppNav } from "./AppNav";
import {
  backdrop,
  brand,
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
      {/* text brand until public/app-icon.png is replaced and the icons regenerated */}
      <Link to="/" className={brand}>
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
