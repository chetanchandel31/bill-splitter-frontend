import { Button, CssVarsProvider } from "@mui/joy";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

// TODO: code splitting for routes

function AppRoutes() {
  return (
    <CssVarsProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                home<Button>hi</Button>
              </>
            }
          />
        </Routes>
      </Router>
    </CssVarsProvider>
  );
}

export default AppRoutes;
