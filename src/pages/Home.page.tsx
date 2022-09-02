import { User } from "../types";
import { message } from "antd";
import useExpenseCreate from "api/hooks/expense/useExpenseCreate";
import { useSelectedGroup } from "contexts/group-context";
import Layout from "helpers/Layout";
import { useState } from "react";
import { showErrorMessage } from "utils";

const Home = () => {
  const [expenseTitle, setExpenseTitle] = useState("");
  const [totalExpenseAmmount, setTotalExpenseAmmount] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const { isLoading, mutate } = useExpenseCreate({
    onError: showErrorMessage,
    onSuccess: () => message.success("expense created successfully"),
  });

  const { selectedGroupDetails } = useSelectedGroup();

  const createExpense = () => {
    const totalExpenseParticipants = selectedMembers.length + 1;

    if (selectedGroupDetails?._id) {
      mutate({
        amountPaidForOwnExpense:
          Number(totalExpenseAmmount) / totalExpenseParticipants,
        borrowers: selectedMembers.map((member) => ({
          userId: member._id,
          amountBorrowed:
            Number(totalExpenseAmmount) / totalExpenseParticipants,
        })),
        expenseTitle,
        groupId: selectedGroupDetails?._id,
      });
    }
  };

  return (
    <Layout>
      <h2>expenses</h2>
      <hr />
      {[
        ...(selectedGroupDetails?.admins || []),
        ...(selectedGroupDetails?.members || []),
      ].map((member) => (
        <div key={member._id}>
          {member.name} ({member.email}){" "}
          {!!selectedMembers.find((_member) => _member._id === member._id) &&
            "✅"}
          <button
            onClick={() => setSelectedMembers((prev) => [...prev, member])}
          >
            add
          </button>
        </div>
      ))}
      <div>
        <input
          placeholder="expense title"
          onChange={({ target }) => setExpenseTitle(target.value)}
          value={expenseTitle}
        />
      </div>
      <div>
        <input
          type="number"
          onChange={({ target }) => setTotalExpenseAmmount(target.value)}
          value={totalExpenseAmmount}
        />
      </div>
      <button onClick={createExpense}>create expense</button>
      {isLoading && <h2>creating expense...</h2>}
    </Layout>
  );
};

export default Home;
