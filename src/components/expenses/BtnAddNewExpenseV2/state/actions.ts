export type actionTypeNewExpenseMeta =
  | {
      type: "DO_SHOW_MODAL";
      payload: boolean;
    }
  | { type: "INCREMENT_STEP" }
  | { type: "SET_EXPENSE_TITLE"; payload: string }
  | { type: "SET_TOTAL_EXPENSE_AMOUNT"; payload: number }
  | { type: "SELECT_PARTICIPANT"; payload: { participantId: string } }
  | { type: "UNSELECT_PARTICIPANT"; payload: { participantId: string } }
  | { type: "SET_EXPENSE_DISTRIBUTION_MODE"; payload: "simple" | "advanced" };
