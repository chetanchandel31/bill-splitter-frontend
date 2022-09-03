import { message } from "antd";
import useInviteSend from "api/hooks/invites/useInviteSend";
import { useSelectedGroup } from "contexts/group-context";
import Layout from "helpers/Layout";
import { useState } from "react";
import { showErrorMessage } from "utils";

const Members = () => {
  const { selectedGroupDetails, isSelectedGroupLoading } = useSelectedGroup();
  const [newMemberName, setNewMemberName] = useState("");

  const { mutate, isLoading } = useInviteSend({
    onError: showErrorMessage,
    onSuccess: (data) => message.success(data.data.message),
  });
  console.log({ selectedGroupDetails });

  return (
    <Layout>
      Members
      <h4>
        {selectedGroupDetails?.admins.map(({ _id, name }) => (
          <div key={_id}>
            {name} <strong>admin</strong>
          </div>
        ))}
        {selectedGroupDetails?.members.map(({ _id, name }) => (
          <div key={_id}>{name}</div>
        ))}
      </h4>
      <input
        onChange={({ target }) => setNewMemberName(target.value)}
        placeholder="username (case-sensitive)"
        value={newMemberName}
      />
      {isLoading && <h2>sending invite...</h2>}
      <button
        onClick={() =>
          typeof selectedGroupDetails?._id === "string" &&
          mutate({
            groupId: selectedGroupDetails?._id,
            invitedUserName: newMemberName,
          })
        }
      >
        add new member
      </button>
      <h2>
        each user has unique user name, admins can use it to invite people to
        group
      </h2>
    </Layout>
  );
};

export default Members;
