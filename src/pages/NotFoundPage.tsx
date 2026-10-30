import { Button, Result } from "antd";
import { useNavigate } from "react-router";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="That page doesn't exist."
      extra={
        <Button type="primary" size="large" onClick={() => navigate("/")}>
          Back to expenses
        </Button>
      }
    />
  );
};
