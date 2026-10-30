import { Tabs } from "antd";
import { useSearchParams } from "react-router";
import { ExpenseRecords } from "@/features/expenses/components/ExpenseRecords";
import { ExpenseSheet } from "@/features/expenses/components/ExpenseSheet";
import { PageTitle } from "@/shared/components/PageTitle";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabs = [
    { key: "expenses", label: "Expenses", children: <ExpenseSheet /> },
    { key: "records", label: "Records", children: <ExpenseRecords /> },
  ];
  const requested = searchParams.get("tab") ?? "expenses";
  const activeKey = tabs.some((t) => t.key === requested) ? requested : "expenses";

  return (
    <>
      <PageTitle>Daily expenses</PageTitle>
      <Tabs
        activeKey={activeKey}
        onChange={(tab) => setSearchParams({ tab }, { replace: true })}
        items={tabs}
        destroyOnHidden={false}
      />
    </>
  );
};
