import React from "react";

import { act, fireEvent, render } from "@testing-library/react-native";

import { FABButton } from "../FABButton";

// Mock the useThemeColor hook
jest.mock("app/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn((color) => {
    if (color === "tint") return "blue";
    if (color === "background") return "white";
    if (color === "tabIconDefault") return "gray";
    if (color === "icon") return "darkgray";
    return "black";
  }),
}));

// Mock react-native Animated
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.NativeModules.NativeAnimatedHelper = {};
  return RN;
});

// Mock react-native-paper FAB component
jest.mock("react-native-paper", () => ({
  FAB: ({ onPress, disabled, icon, color }: any) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity
        testID="fab-button"
        onPress={!disabled ? onPress : undefined}
        disabled={disabled}
      >
        <Text style={{ color }}>
          {typeof icon === "string" ? icon : "icon"}
        </Text>
      </TouchableOpacity>
    );
  },
}));

describe("FABButton Component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it("renders correctly with icon", () => {
    const { getByTestId } = render(
      <FABButton icon="plus" onPress={jest.fn()} />,
    );
    expect(getByTestId("fab-button")).toBeTruthy();
  });

  it("calls onPress when pressed and not disabled", async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <FABButton icon="plus" onPress={onPressMock} />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("fab-button"));
    });
    expect(onPressMock).toHaveBeenCalled();
  });

  it("shows loading state correctly", () => {
    const { getByTestId } = render(
      <FABButton icon="plus" onPress={jest.fn()} loading />,
    );

    expect(getByTestId("fab-button")).toBeTruthy();
  });

  it("handles disabled state correctly", async () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <FABButton icon="plus" onPress={onPressMock} disabled />,
    );

    await act(async () => {
      fireEvent.press(getByTestId("fab-button"));
    });
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
