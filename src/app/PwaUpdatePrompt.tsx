import { useEffect } from "react";
import { App, Button } from "antd";
import { useRegisterSW } from "virtual:pwa-register/react";

const notificationKey = "pwa-update";

/** Offers a reload when a new version is deployed, instead of swapping it in mid-entry. */
export const PwaUpdatePrompt = () => {
  const { notification } = App.useApp();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (!needRefresh) return;
    notification.info({
      key: notificationKey,
      title: "Update available",
      description: "A new version of Expense Monitoring is ready.",
      duration: 0,
      onClose: () => setNeedRefresh(false),
      actions: (
        <Button type="primary" onClick={() => updateServiceWorker(true)}>
          Reload
        </Button>
      ),
    });
  }, [needRefresh, notification, setNeedRefresh, updateServiceWorker]);

  return null;
};
