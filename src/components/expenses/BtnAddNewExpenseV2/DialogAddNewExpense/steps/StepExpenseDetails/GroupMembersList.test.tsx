import { BASE_URL } from "api/API";
import { rest } from "msw";
import { server } from "setupTests";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  fireEvent,
} from "testUtils/testUtils";
import { GroupWithMemberDetails, UserInfo } from "types";
import GroupMembersList from "./GroupMembersList";

// mock auth hook
jest.mock("contexts/auth-context/useAuth", () => ({
  // __esModule: true,
  useAuth: () => {
    const userInfo: UserInfo = {
      token: "abc",
      user: {
        email: "email@mock.com",
        name: "mock name",
        _id: "630b0f14c524fcdbcd0f1c7d",
      },
    };
    return { userInfo };
  },
}));

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
      name: "test3 inline",
      email: "test3@test.com",
    },
  ],
  expenses: [],
};

const mockChangeHandler = jest.fn();

describe("<GroupMembersList />", () => {
  test("show skeleton and not the list when initial req is still pending", async () => {
    server.use(
      rest.get(`${BASE_URL}/groups/:groupId`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(getGroupResponse));
      })
    );

    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const initialSkeleton = screen.getByRole("progressbar", {
      name: /skeletonparticipantslist/i,
    });

    expect(initialSkeleton).toBeInTheDocument();

    getGroupResponse.members
      .concat(getGroupResponse.admins)
      .forEach((member) => {
        expect(screen.queryByText(member.name)).not.toBeInTheDocument();
      });
  });

  test("show list with all participants after loading", async () => {
    server.use(
      rest.get(`${BASE_URL}/groups/:groupId`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(getGroupResponse));
      })
    );

    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const initialSkeleton = screen.getByRole("progressbar", {
      name: /skeletonparticipantslist/i,
    });

    await waitForElementToBeRemoved(initialSkeleton);

    getGroupResponse.members
      .concat(getGroupResponse.admins)
      .forEach((member) => {
        expect(screen.getByText(member.name)).toBeInTheDocument();
      });
  });

  test("should show one item with an admin badge", async () => {
    // just one admin badge because we have one admin in mock data
    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const adminTag = await screen.findByText(/admin/i);

    expect(adminTag).toBeInTheDocument();
  });

  test("should show only one item with an 'you' badge", async () => {
    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const youTag = await screen.findByText(/\(you\)/i);

    expect(youTag).toBeInTheDocument();
  });

  test("checkbox with `(you)` tag should be checked and disabled", async () => {
    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const youTagCheckbox = await screen.findByRole("checkbox", {
      name: /test user \(test@test\.com\) crown admin \(you\)/i,
    });

    expect(youTagCheckbox).toBeDisabled();
    expect(youTagCheckbox).toBeChecked();
  });

  test("checkboxes other than one with `(you)` tag should be unchecked and enabled", async () => {
    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const checkboxes: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox"
    );

    const uncheckedCheckboxesCount = checkboxes.filter(
      (checkbox) => !checkbox.checked
    ).length;
    const enabledCheckboxesCount = checkboxes.filter(
      (checkbox) => !checkbox.disabled
    ).length;

    expect(uncheckedCheckboxesCount).toBeGreaterThan(1);
    expect(enabledCheckboxesCount).toBeGreaterThan(1);
  });

  test("change handler should be called with correct values upon clicking checkboxes", async () => {
    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={[]}
      />
    );

    const checkboxes: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox"
    );

    const firstEnabledCheckbox = checkboxes.find((el) => !el.disabled);

    expect(firstEnabledCheckbox).not.toBe(undefined);

    if (firstEnabledCheckbox) fireEvent.click(firstEnabledCheckbox);

    const firstCallArgs = mockChangeHandler.mock.calls[0];

    // TODO: it's an implementation detail, still testing it because this component can be used independently anywhere
    // and this interface working correctly is important for that
    expect(firstCallArgs[0]?.target?.checked).toBe(true);

    expect(firstCallArgs[1]).toEqual(
      expect.objectContaining({
        _id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
      })
    );
  });

  test("should have checked checkboxes corresponding to `selectedparticipantsId`", async () => {
    server.use(
      rest.get(`${BASE_URL}/groups/:groupId`, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(getGroupResponse));
      })
    );

    const selectedParticipantsId = getGroupResponse.members.map(
      (member) => member._id
    );

    render(
      <GroupMembersList
        onChange={mockChangeHandler}
        selectedParticipantsId={selectedParticipantsId}
      />
    );

    const checkboxes: HTMLInputElement[] = await screen.findAllByRole(
      "checkbox"
    );

    const checkedChecboxesCount = checkboxes.filter(
      (element) => element.checked
    ).length;

    // can be greater because logged in user is always checked
    expect(checkedChecboxesCount).toBeGreaterThanOrEqual(
      selectedParticipantsId.length
    );
  });
});
