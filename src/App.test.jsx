import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, it, expect, vi } from "vite-plus/test";
import App from "./App";

beforeEach(() => {
  // App -> Riverflow fetches USGS data on mount
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ value: {} }) }),
  );
});

it("renders without crashing", () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Riverflow" })).toBeInTheDocument();
});
