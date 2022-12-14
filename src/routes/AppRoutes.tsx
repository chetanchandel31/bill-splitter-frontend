import { Result } from "antd";
import ProtectedRoute from "helpers/ProtectedRoute";
import GroupSelection from "pages/GroupSelection.page";
import Home from "pages/Home.page";
import Invitations from "pages/Invitations.page";
import Members from "pages/Members.page";
import PersonalExpenses from "pages/PersonalExpenses.page";
import SignIn from "pages/SignIn.page";
import SignUp from "pages/SignUp.page";
import { Route, Routes } from "react-router-dom";

// TODO: code splitting for routes

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal-expenses"
        element={
          <ProtectedRoute>
            <PersonalExpenses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/members"
        element={
          <ProtectedRoute>
            <Members />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invitations"
        element={
          <ProtectedRoute>
            <Invitations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/group-selection"
        element={
          <ProtectedRoute meantFor="authentiactedUserWithoutSelectedGroup">
            <GroupSelection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sign-in"
        element={
          <ProtectedRoute meantFor="unauthenticatedUser">
            <SignIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <ProtectedRoute meantFor="unauthenticatedUser">
            <SignUp />
          </ProtectedRoute>
        }
      />
      <Route
        element={
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            // extra={<Button type="primary">Back Home</Button>}
          />
        }
        path="*"
      />
    </Routes>
  );
}

export default AppRoutes;
