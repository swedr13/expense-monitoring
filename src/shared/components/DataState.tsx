import type { ReactNode } from "react";
import { Alert, Button, Empty, Skeleton } from "antd";
import { getErrorMessage } from "../lib/errors";

type DataStateProps = {
  isLoading: boolean;
  error?: unknown;
  onRetry?: () => void;
  isEmpty?: boolean;
  emptyText?: ReactNode;
  /** Skeleton rows while loading. */
  rows?: number;
  children: ReactNode;
};

/** Every data view handles loading, error and empty the same way. */
export const DataState = ({
  isLoading,
  error,
  onRetry,
  isEmpty = false,
  emptyText = "Nothing here yet.",
  rows = 3,
  children,
}: DataStateProps) => {
  if (isLoading) return <Skeleton active paragraph={{ rows }} />;
  if (error)
    return (
      <Alert
        type="error"
        showIcon
        title={getErrorMessage(error)}
        action={
          onRetry && (
            <Button size="small" onClick={onRetry}>
              Retry
            </Button>
          )
        }
      />
    );
  if (isEmpty) return <Empty description={emptyText} />;
  return <>{children}</>;
};
