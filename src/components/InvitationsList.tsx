import { message } from "antd";
import useInviteSettle from "api/hooks/invites/useInviteSettle";
import useInvitesList from "api/hooks/invites/useInvitesList";
import { showErrorMessage } from "utils";

const InvitationsList = () => {
  const { data, isFetching } = useInvitesList({ onError: showErrorMessage });

  const { mutate, isLoading } = useInviteSettle({
    onError: showErrorMessage,
    onSuccess: (data) => message.success(data.data.message),
  });

  return (
    <div>
      {isFetching && <h2>invites loading</h2>}
      {isLoading && <h2>loading...</h2>}
      <button>refresh invitations</button>
      {data?.data.map((invite) => (
        <div key={invite._id}>
          you are invited to <strong>{invite.invitedTo.groupName}</strong> by{" "}
          <strong>
            {invite.invitedBy.name}({invite.invitedBy.email})
          </strong>{" "}
          <button
            onClick={() => mutate({ inviteId: invite._id, doReject: false })}
          >
            accept
          </button>
          <button
            onClick={() => mutate({ inviteId: invite._id, doReject: true })}
          >
            reject
          </button>
        </div>
      ))}
    </div>
  );
};

export default InvitationsList;
