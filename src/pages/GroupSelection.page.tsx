import { Button, message, PageHeader } from "antd";
import useGroupCreate from "api/hooks/groups/useGroupCreate";
import useGroupDelete from "api/hooks/groups/useGroupDelete";
import useGroupsList from "api/hooks/groups/useGroupsList";
import { useAuth } from "contexts/auth-context";
import { useState } from "react";
import { showErrorMessage } from "utils";

const GroupSelection = () => {
  // this is a protected page, only user with no group selected is supposed to be here
  const { userInfo, signOut } = useAuth();
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
      <PageHeader
        // ghost={false}
        style={{ backgroundColor: "#001529", color: "#ececec" }}
        // title="Title"
        // subTitle="This is a subtitle"
        extra={[
          <Button key="3">Operation</Button>,

          <Button danger onClick={signOut} key="1" type="primary">
            {/* TODO: add confirmation */}
            Logout
          </Button>,
        ]}
      ></PageHeader>
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
        </>
      )}
    </div>
  );
};

export default GroupSelection;
