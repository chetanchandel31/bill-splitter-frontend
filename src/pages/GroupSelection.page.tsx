import { useAuth } from "contexts/auth-context";
import { useState } from "react";

const GroupSelection = () => {
  // this is a protected page, only user with no group selected is supposed to be here
  const { userInfo } = useAuth();
  const [doShowGroups, setDoShowGroups] = useState(false);

  return (
    <div>
      <h2>{doShowGroups ? "groups view" : "invites view"}</h2>
      hi {userInfo?.user.name}
      <h2>
        <button
          onClick={() => {
            setDoShowGroups(true);
          }}
        >
          groups
        </button>{" "}
        |{" "}
        <button
          onClick={() => {
            setDoShowGroups(false);
          }}
        >
          invites
        </button>
      </h2>
      {/* main content */}
    </div>
  );
};

export default GroupSelection;
