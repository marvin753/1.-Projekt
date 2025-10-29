import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

const Hello = () => <h1>Hello Test</h1>;

describe("Hello component", () => {
  it("renders correctly", () => {
    render(<Hello />);
    expect(screen.getByText("Hello Test")).toBeInTheDocument();
  });
});
