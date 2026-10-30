import { App, Button, Dropdown, type MenuProps } from "antd";
import { PiCalendarDotsDuotone, PiDownloadSimple, PiList, PiReceiptDuotone } from "react-icons/pi";
import { useLocation, useNavigate } from "react-router";
import { useInstallPrompt } from "@/shared/hooks/useInstallPrompt";

/** The header menu: the two tabs, and installing the app when the browser allows it. */
export const AppNav = () => {
  const navigate = useNavigate();
  const { modal } = App.useApp();
  const { pathname, search } = useLocation();
  const installPrompt = useInstallPrompt();

  const items: MenuProps["items"] = [
    { key: "/", label: "Expenses", icon: <PiReceiptDuotone /> },
    { key: "/?tab=records", label: "Records", icon: <PiCalendarDotsDuotone /> },
    ...(installPrompt.mode
      ? [
          { type: "divider" as const },
          { key: "install", label: "Install app", icon: <PiDownloadSimple /> },
        ]
      : []),
  ];

  const onClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "install" && installPrompt.mode === "prompt") void installPrompt.install();
    else if (key === "install")
      modal.info({
        title: "Add to your Home Screen",
        content:
          "In Safari, tap the Share button, then “Add to Home Screen”. The app then opens full-screen.",
      });
    else navigate(key);
  };

  return (
    <Dropdown menu={{ items, onClick, selectedKeys: [pathname + search] }} trigger={["click"]}>
      <Button type="text" size="large" icon={<PiList aria-hidden="true" />} aria-label="Menu" />
    </Dropdown>
  );
};
