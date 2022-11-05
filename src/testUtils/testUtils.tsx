import { render, RenderOptions } from "@testing-library/react";
import AllProviders from "AllProviders";
import { ReactElement } from "react";

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
