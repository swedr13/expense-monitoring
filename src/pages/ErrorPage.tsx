import { Button, Result } from "antd";

/**
 * Shown when a screen crashes. It sits outside the normal layout and providers'
 * routes, so it uses only plain antd and a hard reload to recover.
 */
export const ErrorPage = () => (
  <Result
    status="error"
    title="Something went wrong"
    subTitle="Reloading usually fixes it. Saved expenses are safe — they are kept on the server."
    extra={
      <Button type="primary" size="large" onClick={() => window.location.reload()}>
        Reload
      </Button>
    }
  />
);
