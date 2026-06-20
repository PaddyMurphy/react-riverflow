import React from "react";
import { beforeEach, it, expect, vi } from "vite-plus/test";
import { render } from "../../test/render.jsx";
import Riverflow from "./Riverflow";

beforeEach(() => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ value: {} }) }),
  );
});

it("renders without crashing", () => {
  const { container } = render(<Riverflow />);
  // rivertable should render once
  expect(container.querySelectorAll(".rivertable").length).toBe(1);
});
