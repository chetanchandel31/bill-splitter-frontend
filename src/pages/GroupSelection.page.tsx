import { Tabs } from "antd";
import GroupsList from "components/GroupsList";
import Header from "components/Header";
import InvitationsList from "components/InvitationsList";
import styles from "./group-selection.module.css";

const { TabPane } = Tabs;

const GroupSelection = () => {
  // this is a protected page, only user with no group selected is supposed to be here

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
              <InvitationsList />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default GroupSelection;
