import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Dropdown from "./Dropdown";

describe("Dropdown Test", () => {
  test("Should Display Dropdown Options and Handle Selection", () => {
    const userPosts = [
      { title: "Post 1", postObject: { id: 1 } },
      { title: "Post 2", postObject: { id: 2 } },
    ];

    render(
      <Dropdown
        dropdownList={userPosts.map((userPost) => ({
          title: userPost.title,
          postObject: userPost,
        }))}
        dropdownLabel="Select post for exchange"
        dropdownPlaceholder="Select a post"
        selectedValue="Post 1" // Set the selected value
        onDropdownChange={() => {}}
      />
    );

    expect(screen.getByText("Select post for exchange")).toBeInTheDocument();

    const dropdown = screen.getByTestId("options-menu");

    expect(dropdown).toBeInTheDocument();

    fireEvent.change(dropdown, { target: { value: "Post 2" } });

    expect(dropdown.value).toBe("Post 2");
  });
});
