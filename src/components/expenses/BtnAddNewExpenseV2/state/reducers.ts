import { actionTypeNewExpenseMeta } from "./actions";

export type NewExpenseMeta = {
  isModalVisible: boolean;
  currentStep: number;
  expenseTitle: string;
  arrayOfSelectedParticipantId: string[]; // TODO: arrayOfSelectedParticipantId
  totalExpenseAmount: number;
  distributedTotalExpense: {
    amountPaidForOwnExpense: number;
    borrowerToExpenseMap: {
      [userId: string]: number;
    };
  };
};

export const initialStateNewExpenseMeta: Readonly<NewExpenseMeta> = {
  isModalVisible: false,
  currentStep: 0,
  expenseTitle: "",
  totalExpenseAmount: 0,
  arrayOfSelectedParticipantId: [],
  distributedTotalExpense: {
    amountPaidForOwnExpense: 0,
    borrowerToExpenseMap: {},
  },
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
        arrayOfSelectedParticipantId: [
          ...state.arrayOfSelectedParticipantId,
          action.payload.participantId,
        ],
      };
    }

    case "UNSELECT_PARTICIPANT": {
      return {
        ...state,
        arrayOfSelectedParticipantId: state.arrayOfSelectedParticipantId.filter(
          (participantId) => participantId !== action.payload.participantId
        ),
      };
    }

    case "INITIALIZE_EXPENSE_DISTRIBUTION": {
      const dividedExpenseAmount =
        state.totalExpenseAmount /
        (state.arrayOfSelectedParticipantId.length + 1);

      const borrowerToExpenseMap: { [id: string]: number } = {};

      state.arrayOfSelectedParticipantId.forEach((participantId) => {
        borrowerToExpenseMap[participantId] = dividedExpenseAmount;
      });

      return {
        ...state,
        distributedTotalExpense: {
          amountPaidForOwnExpense: dividedExpenseAmount,
          borrowerToExpenseMap,
        },
      };
    }

    case "UPDATE_PARTICIPANT_EXPENSE_DISTRIBUTION": {
      const { amount, participantId } = action.payload;

      // deep copying
      const newDistributedTotalExpense: NewExpenseMeta["distributedTotalExpense"] =
        JSON.parse(JSON.stringify(state.distributedTotalExpense));

      newDistributedTotalExpense.borrowerToExpenseMap[participantId] =
        amount || 1;

      return {
        ...state,
        distributedTotalExpense: newDistributedTotalExpense,
      };
    }

    case "UPDATE_OWN_SHARE_IN_EXPENSE_DISTRIBUTION": {
      return {
        ...state,
        distributedTotalExpense: {
          ...state.distributedTotalExpense,
          amountPaidForOwnExpense: action.payload.amount || 1,
        },
      };
    }

    default: {
      return { ...state };
    }
  }
};
