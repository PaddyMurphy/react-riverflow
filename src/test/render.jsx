import { act } from "react";
import { createRoot } from "react-dom/client";

// Minimal render helper backed by react-dom/client, replacing
// @testing-library/react. Renders inside act() so effects flush before
// assertions, and returns the container plus an unmount cleanup.
export function render(ui) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  let root;
  act(() => {
    root = createRoot(container);
    root.render(ui);
  });

  return {
    container,
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}
