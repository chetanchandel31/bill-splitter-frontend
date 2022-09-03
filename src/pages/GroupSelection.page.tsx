import styles from "./group-selection.module.css";
import { message, Tabs } from "antd";
import useGroupCreate from "api/hooks/groups/useGroupCreate";
import useGroupDelete from "api/hooks/groups/useGroupDelete";
import useGroupsList from "api/hooks/groups/useGroupsList";
import InvitationsList from "components/InvitationsList";
import { useAuth } from "contexts/auth-context";
import { useSelectedGroup } from "contexts/group-context";
import Header from "components/Header";
import { useState } from "react";
import { showErrorMessage } from "utils";
import GroupsList from "components/GroupsList";

const { TabPane } = Tabs;

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
      <div className={styles.tabsContainer}>
        <div className="card-container">
          <Tabs centered type="card">
            <TabPane tab="Groups" key="1">
              <GroupsList />
            </TabPane>

            <TabPane tab="Invites" key="2">
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
              <p>Content of Tab Pane 2</p>
            </TabPane>
          </Tabs>
        </div>
      </div>
      <hr />
      {/* TODO: */}
      Welcome, <strong>{userInfo?.user.name}</strong>
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
