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
  | { type: "INITIALIZE_EXPENSE_DISTRIBUTION" }
  | {
      type: "UPDATE_PARTICIPANT_EXPENSE_DISTRIBUTION";
      payload: { participantId: string; amount: number };
    }
  | {
      type: "UPDATE_OWN_SHARE_IN_EXPENSE_DISTRIBUTION";
      payload: { amount: number };
    };
