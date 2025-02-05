import React from "react";

import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import { BaseModal } from "../Modal";
import { InternetModal } from "app/components/modals/InternetModal";

describe("BaseModal", () => {
  it("renders modal content when visible", () => {
    const { getByText } = render(
      <BaseModal visible={true} onDismiss={() => {}}>
        <Text>Test Content</Text>
      </BaseModal>,
    );

    expect(getByText("Test Content")).toBeTruthy();
  });

  it("does not render content when not visible", () => {
    const { queryByText } = render(
      <BaseModal visible={false} onDismiss={() => {}}>
        <Text>Test Content</Text>
      </BaseModal>,
    );

    expect(queryByText("Test Content")).toBeNull();
  });
});

describe("InternetModal", () => {
  it("renders retry and okay buttons", () => {
    const { getByText } = render(
      <InternetModal visible={true} onRetry={() => {}} onDismiss={() => {}} />,
    );

    expect(getByText("retry")).toBeTruthy();
    expect(getByText("okay")).toBeTruthy();
  });
});
