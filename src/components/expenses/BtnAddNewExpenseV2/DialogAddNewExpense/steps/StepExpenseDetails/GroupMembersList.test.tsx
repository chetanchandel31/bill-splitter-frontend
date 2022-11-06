import { BASE_URL } from "api/API";
import { rest } from "msw";
import { server } from "setupTests";
import {
  render,
  screen,
  //  fireEvent, cleanup
} from "testUtils/testUtils";
import { GroupWithMemberDetails } from "types";
import GroupMembersList from "./GroupMembersList";

const getGroupResponse: GroupWithMemberDetails = {
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
      name: "test3aa",
      email: "test3@test.com",
    },
  ],
  expenses: [],
};

describe("<GroupMembersList />", () => {
  test("show skeleton and not the list when initial req is still pending", async () => {
    render(<GroupMembersList />);

    const initialSkeleton = screen.getByRole("progressbar", {
      name: /skeletonparticipantslist/i,
    });

    expect(initialSkeleton).toBeInTheDocument();

    // TODO: assert for no list
  });

  test("show list with all participants", async () => {
    server.use(
      // override the initial "GET /groups/:id" request handler
      rest.get(`${BASE_URL}/groups/:groupId`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(getGroupResponse));
      })
    );

    render(<GroupMembersList />);

    const initialSkeleton = screen.getByRole("progressbar", {
      name: /skeletonparticipantslist/i,
    });

    expect(initialSkeleton).toBeInTheDocument();
    // TODO: assert for no list
  });
});
