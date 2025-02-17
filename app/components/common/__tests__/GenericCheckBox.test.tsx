import React from "react";

import { render } from "@testing-library/react-native";

import { GenericCheckBox } from "../GenericCheckBox";

jest.mock("app/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn((color) => color),
}));

describe("GenericCheckBox", () => {
  it("renders correctly when not selected", () => {
    const { getByTestId, queryByTestId } = render(
      <GenericCheckBox selected={false} />,
    );

    const checkBox = getByTestId("generic-checkbox");
    expect(checkBox).toBeTruthy();
    expect(queryByTestId("checkmark-icon")).toBeNull();
  });
});
