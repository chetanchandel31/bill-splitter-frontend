import { Button, PageHeader } from "antd";
import { useAuth } from "contexts/auth-context";
import { useNavigate } from "react-router-dom";

// TODO: move to components
const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <PageHeader
      // ghost={false}
      style={{ backgroundColor: "#001529", color: "#ececec" }}
      // title="Title"
      // subTitle="This is a subtitle"
      extra={[
        <Button
          onClick={() => {
            localStorage.removeItem("selected-group");
            navigate("/group-selection");
          }}
          key="3"
        >
          leave group(later will only allow switch)
        </Button>,

        <Button danger onClick={signOut} key="1" type="primary">
          {/* TODO: add confirmation */}
          Logout
        </Button>,
      ]}
    />
  );
};

export default Header;
