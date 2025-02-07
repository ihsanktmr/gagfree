import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { SimpleButton } from "../SimpleButton";

describe("SimpleButton", () => {
  it("renders correctly with title", () => {
    const { getByText } = render(
      <SimpleButton title="Press Me" onPress={() => {}} />,
    );

    expect(getByText("Press Me")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <SimpleButton title="Press Me" onPress={onPressMock} />,
    );

    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalled();
  });
});
