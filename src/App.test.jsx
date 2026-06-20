import React from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, it, expect, vi } from "vite-plus/test";
import { render } from "./test/render.jsx";
import App from "./App";

beforeEach(() => {
  // App -> Riverflow fetches USGS data on mount
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ value: {} }) }),
  );
});

it("renders without crashing", () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = container.querySelector("h1.title");
  expect(heading?.textContent).toBe("Riverflow");
});
