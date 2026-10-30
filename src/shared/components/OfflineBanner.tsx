import { Alert } from "antd";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

/**
 * Expenses are saved to the server as they're typed — offline, nothing can be
 * saved, so say so before anything is lost.
 */
export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <Alert
      type="warning"
      showIcon
      banner
      role="status"
      title="You're offline"
      description="Expenses can't be saved until your connection is back."
    />
  );
};
