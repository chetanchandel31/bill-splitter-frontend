import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useReducer } from "react";
import ExpensesGroupTotal from "../ExpensesGroupTotal";
import DialogAddNewExpense from "./DialogAddNewExpense";
import {
  initialStateNewExpenseMeta,
  reducerNewExpenseMeta,
} from "./state/reducers";
import styles from "./stepAddExpense.module.css";

const BtnAddNewExpense = () => {
  const [newExpenseMeta, dispatch] = useReducer(
    reducerNewExpenseMeta,
    initialStateNewExpenseMeta
  );

  const showModal = () => dispatch({ type: "DO_SHOW_MODAL", payload: true });

  return (
    <div className={styles.addExpenseBtnContainer}>
      <Button icon={<PlusOutlined />} onClick={showModal} type="primary">
        Add expense
      </Button>

      <ExpensesGroupTotal />

      <DialogAddNewExpense
        dispatch={dispatch}
        newExpenseMeta={newExpenseMeta}
      />
    </div>
  );
};

export default BtnAddNewExpense;
