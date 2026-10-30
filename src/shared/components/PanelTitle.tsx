import type { ReactNode } from "react";
import { iconTile, panelTitle, panelTitleText } from "../styles/panelTitle.css";

type PanelTitleProps = {
  /** A Phosphor duotone icon from `react-icons/pi`. */
  icon: ReactNode;
  children: ReactNode;
};

/** A card title led by its icon tile. Pass it as a `Card`'s `title`. */
export const PanelTitle = ({ icon, children }: PanelTitleProps) => (
  <span className={panelTitle}>
    <span className={iconTile} aria-hidden="true">
      {icon}
    </span>
    <span className={panelTitleText}>{children}</span>
  </span>
);
