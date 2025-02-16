import React from "react";

import { fireEvent, render } from "@testing-library/react-native";

import { FilterChip } from "../FilterChip";

jest.mock("app/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn((color) => (color === "main" ? "blue" : "white")),
}));

jest.mock("app/components/texts/ThemedText", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    ThemedText: ({ children }: { children: React.ReactNode }) => (
      <Text>{children}</Text>
    ),
  };
});

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn().mockReturnValue(true),
}));

describe("FilterChip Component", () => {
  it("renders correctly with label", () => {
    const { getByText } = render(
      <FilterChip label="Test Chip" selected={false} onPress={jest.fn()} />,
    );
    expect(getByText("Test Chip")).toBeTruthy();
  });

  it("calls onPress when clicked", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <FilterChip label="Click Me" selected={false} onPress={onPressMock} />,
    );

    fireEvent.press(getByText("Click Me"));
    expect(onPressMock).toHaveBeenCalled();
  });

  it("renders correctly when selected", () => {
    const { getByText, getByTestId } = render(
      <FilterChip label="Selected Chip" selected={true} onPress={jest.fn()} />,
    );

    expect(getByText("Selected Chip")).toBeTruthy();
    expect(getByTestId("main-icon")).toBeTruthy();
  });
});
