import { message } from "antd";
import useGroupCreate from "api/hooks/groups/useGroupCreate";
import useGroupDelete from "api/hooks/groups/useGroupDelete";
import useGroupsList from "api/hooks/groups/useGroupsList";
import InvitationsList from "components/InvitationsList";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import Header from "helpers/Header";
import { useState } from "react";
import { showErrorMessage } from "utils";

const GroupSelection = () => {
  const { selectGroup } = useSelectedGroup();
  // this is a protected page, only user with no group selected is supposed to be here
  const { userInfo } = useAuth();
  const [doShowGroups, setDoShowGroups] = useState(true);
  const [newGroupName, setNewGroupName] = useState("");

  const { mutate: createGroup, isLoading: isGroupCreateLoading } =
    useGroupCreate({
      onError: showErrorMessage,
      onSuccess: (data) =>
        message.success(
          `new group ${data.data.groupName} created successfully`
        ),
    });

  const { data: groupsList, isFetching: isGroupsListLoading } = useGroupsList({
    onError: showErrorMessage,
  });

  const { isLoading: isGroupDeleteLoading, mutate: deleteGroup } =
    useGroupDelete({
      onError: showErrorMessage,
      onSuccess: (data) =>
        message.success(`'Group: ${data.data.groupName}' deleted successfully`),
    });

  return (
    <div>
      <Header />
      hi {userInfo?.user.name}
      <h2>
        <button
          onClick={() => {
            setDoShowGroups(true);
          }}
        >
          groups
        </button>
        <button
          onClick={() => {
            setDoShowGroups(false);
          }}
        >
          invites
        </button>
      </h2>
      {/* MAIN CONTENT */}
      {doShowGroups ? (
        <>
          <h1>Groups list</h1>
          <input
            onChange={({ target }) => setNewGroupName(target.value)}
            value={newGroupName}
          />
          <button
            disabled={!newGroupName}
            onClick={() => createGroup({ groupName: newGroupName })}
          >
            create group
          </button>
          {groupsList?.data.map((group) => (
            <div key={group._id}>
              {group.groupName}{" "}
              <button onClick={() => deleteGroup({ groupId: group._id })}>
                delete
              </button>
              <button onClick={() => selectGroup(group._id)}>select</button>
            </div>
          ))}
          {isGroupDeleteLoading && (
            <h3 style={{ border: "solid 1px blue" }}>deleting...</h3>
          )}
          {isGroupsListLoading && (
            <h3 style={{ border: "solid 1px blue" }}>loading list...</h3>
          )}
          {isGroupCreateLoading && (
            <h3 style={{ border: "solid 1px blue" }}>creating group...</h3>
          )}
        </>
      ) : (
        <>
          <h1>invites list</h1>
          <InvitationsList />
        </>
      )}
    </div>
  );
};

export default GroupSelection;
