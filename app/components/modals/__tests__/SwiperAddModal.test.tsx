import React from "react";

import { act, fireEvent, render } from "@testing-library/react-native";

import { SwiperTutorialModal } from "../SwiperAddModal";

// Mock the useThemeColor hook
jest.mock("app/hooks/useThemeColor", () => ({
  useThemeColor: jest.fn(() => "white"),
}));

// Mock Swiper component with forwardRef
jest.mock("react-native-swiper", () => {
  const { View } = require("react-native");
  const React = require("react");
  return React.forwardRef(({ children, onIndexChanged }: any, ref: any) => {
    React.useImperativeHandle(ref, () => ({
      scrollBy: jest.fn(),
    }));
    return <View>{children}</View>;
  });
});

// Mock react-native-safe-area-context
jest.mock("react-native-safe-area-context", () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, left: 0, bottom: 0 }),
}));

// Mock react-native-paper Modal
jest.mock("react-native-paper", () => ({
  Modal: ({ children, visible }: any) => (visible ? children : null),
  Button: ({ children, onPress }: any) => {
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity onPress={onPress}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  },
}));

/**
 * SwiperTutorialModal Tests
 *
 * These tests verify the basic functionality of our step-by-step tutorial modal.
 * The modal is a critical UI component that guides users through multi-step processes,
 * such as onboarding or form completion.
 *
 * Test Suite Overview:
 * 1. Basic Rendering: Verifies the component can receive and display content correctly.
 * 2. Step Completion: Tests the step validation, navigation, and completion logic.
 * 3. Modal Reset: Ensures the modal properly resets its state after completion.
 */

describe("SwiperTutorialModal", () => {
  const mockSteps = [
    {
      title: "Step 1",
      content: "First step content",
      buttonText: "Next",
      onStepComplete: jest.fn(() => true),
    },
  ];

  it("renders correctly when visible", () => {
    const { getByText } = render(
      <SwiperTutorialModal
        visible={true}
        steps={mockSteps}
        currentIndex={0}
        setCurrentIndex={jest.fn()}
        onDismiss={jest.fn()}
      />,
    );

    expect(getByText("Step 1")).toBeTruthy();
  });

  /**
   * This test verifies the modal's behavior when a user completes all steps.
   * It checks three critical aspects:
   * - Step validation is called before proceeding
   * - Modal dismisses after the last step
   * - Step index resets for next usage
   */
  it("handles step completion correctly", async () => {
    const mockStepComplete = jest.fn(() => true);
    const mockDismiss = jest.fn();
    const mockSetIndex = jest.fn();

    const steps = [
      {
        title: "Step 1",
        content: "First step",
        buttonText: "Next",
        onStepComplete: mockStepComplete,
      },
    ];

    const { getByText } = render(
      <SwiperTutorialModal
        visible={true}
        steps={steps}
        onDismiss={mockDismiss}
        currentIndex={0}
        setCurrentIndex={mockSetIndex}
      />,
    );

    // Click the "Next" button
    await act(async () => {
      fireEvent.press(getByText("Next"));
    });

    // Verify step completion was called
    expect(mockStepComplete).toHaveBeenCalled();
    // Verify modal dismisses after last step
    expect(mockDismiss).toHaveBeenCalled();
    // Verify index resets
    expect(mockSetIndex).toHaveBeenCalledWith(0);
  });

  /**
   * Validates that the modal resets to initial state when reopened.
   * This ensures a consistent experience for repeated modal usage.
   */
  it("resets to first step when reopened", () => {
    const mockSetIndex = jest.fn();

    const { rerender } = render(
      <SwiperTutorialModal
        visible={false}
        steps={mockSteps}
        currentIndex={0}
        setCurrentIndex={mockSetIndex}
        onDismiss={jest.fn()}
      />,
    );

    // Reopen modal
    rerender(
      <SwiperTutorialModal
        visible={true}
        steps={mockSteps}
        currentIndex={0}
        setCurrentIndex={mockSetIndex}
        onDismiss={jest.fn()}
      />,
    );

    // Should reset to first step
    expect(mockSetIndex).toHaveBeenCalledWith(0);
  });
});
