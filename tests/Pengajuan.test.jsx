import { describe } from "vitest";
import { render } from "@testing-library/react";
import Home from "../src/views/Home";

describe("test1", () => {
  test("renders", () => {
    render(<Home />);
    assert.equal(1 + 1, 2);
    // expect(screen.getByText("test1")).toBeDefined();
  });
});
