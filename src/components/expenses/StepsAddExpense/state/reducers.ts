import { actionTypeNewExpenseMeta } from "./actions";

export type NewExpenseMeta = {
  isModalVisible: boolean;
  currentStep: number;
  expenseTitle: string;
  totalExpenseAmount: number;
  selectedParticipantsId: string[];
};

export const initialStateNewExpenseMeta: Readonly<NewExpenseMeta> = {
  isModalVisible: false,
  currentStep: 0,
  expenseTitle: "",
  totalExpenseAmount: 0,
  selectedParticipantsId: [],
};

export const reducerNewExpenseMeta = (
  state: NewExpenseMeta,
  action: actionTypeNewExpenseMeta
): NewExpenseMeta => {
  switch (action.type) {
    case "DO_SHOW_MODAL": {
      return action.payload
        ? { ...state, isModalVisible: true }
        : initialStateNewExpenseMeta;
    }

    case "INCREMENT_STEP": {
      return { ...state, currentStep: state.currentStep + 1 };
    }

    case "SET_EXPENSE_TITLE": {
      return { ...state, expenseTitle: action.payload };
    }

    case "SET_TOTAL_EXPENSE_AMOUNT": {
      return {
        ...state,
        totalExpenseAmount:
          action.payload >= 0 && !isNaN(action.payload)
            ? action.payload
            : state.totalExpenseAmount,
      };
    }

    case "SELECT_PARTICIPANT": {
      return {
        ...state,
        selectedParticipantsId: [
          ...state.selectedParticipantsId,
          action.payload.participantId,
        ],
      };
    }

    case "UNSELECT_PARTICIPANT": {
      return {
        ...state,
        selectedParticipantsId: state.selectedParticipantsId.filter(
          (participantId) => participantId !== action.payload.participantId
        ),
      };
    }

    default: {
      return { ...state };
    }
  }
};
