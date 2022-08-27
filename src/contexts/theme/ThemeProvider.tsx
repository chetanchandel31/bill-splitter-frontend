import { CssVarsProvider } from "@mui/joy";
import { ReactNode } from "react";
import { ThemeContext } from "./theme-context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // TODO: check dark theme
  return (
    <ThemeContext.Provider value={null}>
      <CssVarsProvider defaultColorScheme={"dark"}>{children}</CssVarsProvider>
    </ThemeContext.Provider>
  );
};
