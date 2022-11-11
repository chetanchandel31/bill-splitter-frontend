import { BASE_URL } from "api/API";
import { rest } from "msw";
import { GroupWithMemberDetails } from "types";

export const handlers = [
  rest.get(`${BASE_URL}/groups/:groupId`, (req, res, ctx) => {
    const response: GroupWithMemberDetails = {
      _id: "6312fc756d0eabf8db3b6f12",
      groupName: "aa",
      admins: [
        {
          _id: "630b0f14c524fcdbcd0f1c7d",
          name: "test user",
          email: "test@test.com",
        },
      ],
      members: [
        {
          _id: "630b2a62c524fcdbcd0f1c81",
          name: "test2",
          email: "test2@test.com",
        },
        {
          _id: "630b3abac524fcdbcd0f1c95",
          name: "test3 from utils",
          email: "test3@test.com",
        },
      ],
      expenses: [
        {
          lender: {
            user: "630b0f14c524fcdbcd0f1c7d",
            amountPaidForOwnExpense: 32431,
          },
          expenseTitle: "asddsa",
          borrowers: [
            {
              user: "630b2a62c524fcdbcd0f1c81",
              amountBorrowed: 32431,
              isSettled: false,
              isApprovedByLender: false,
              _id: "632ef07af04e700ede6d91b8",
            },
          ],
          recordedAt: 1664020602970,
          _id: "632ef07af04e700ede6d91b7",
        },
        {
          lender: {
            user: "630b0f14c524fcdbcd0f1c7d",
            amountPaidForOwnExpense: 2342,
          },
          expenseTitle: "dasda",
          borrowers: [
            {
              user: "630b2a62c524fcdbcd0f1c81",
              amountBorrowed: 2342,
              isSettled: false,
              isApprovedByLender: true,
              _id: "632f23e30629226c66f75300",
            },
          ],
          recordedAt: 1664033763492,
          _id: "632f23e30629226c66f752ff",
        },
      ],
    };

    return res(ctx.status(200), ctx.json(response));
  }),
];
