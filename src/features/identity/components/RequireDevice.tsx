import type { ReactNode } from "react";
import { Button, Result, Skeleton } from "antd";
import { getErrorMessage } from "@/shared/lib/errors";
import { useAuth } from "../hooks/useAuth";

/** Waits for this phone's session; every screen reads its own expenses through it. */
export const RequireDevice = ({ children }: { children: ReactNode }) => {
  const { user, isLoading, error } = useAuth();

  if (user) return <>{children}</>;
  if (isLoading || !error) return <Skeleton active />;
  return (
    <Result
      status="warning"
      title="Couldn't connect this device"
      subTitle={getErrorMessage(error)}
      extra={
        <Button type="primary" size="large" onClick={() => window.location.reload()}>
          Try again
        </Button>
      }
    />
  );
};
