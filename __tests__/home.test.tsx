import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("Home", () => {
  it("renders the product name and a link to the play scene", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /nadin learning/i }),
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /hello scene/i });
    expect(cta).toHaveAttribute("href", "/play");
  });
});
