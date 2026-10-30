import type { ReactNode } from "react";
import { Typography } from "antd";
import { pageTitle } from "../styles/pageTitle.css";

/** The one heading at the top of every page. */
export const PageTitle = ({ children }: { children: ReactNode }) => (
  <Typography.Title level={3} className={pageTitle}>
    {children}
  </Typography.Title>
);
