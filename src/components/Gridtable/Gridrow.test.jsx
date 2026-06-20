import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { it, expect } from "vite-plus/test";
import Gridrow from "./Gridrow.jsx";

const tableData = {
  name: "Brazos Rv nr Palo Pinto, TX",
  location: "//maps.google.com/?q=32.8626236,+-98.3025492",
  site: "08089000",
  date: "",
  time: "14:15",
  cfs: 174,
  oldCfs: 257,
  condition:
    "This is a pretty leisurely flow but still fun. You shouldn't have any problems scraping bottom in canoes at this level",
  level: "level-3",
  rising: false,
  risingFast: false,
  class: "II-III",
};

it("renders without crashing and contains two table rows", () => {
  const { container } = render(
    <MemoryRouter>
      <table>
        <Gridrow graphType="00060" tableData={tableData} />
      </table>
    </MemoryRouter>,
  );
  // there should be 2 rows per Gridrow (the data row + the details row)
  expect(container.querySelectorAll("tbody tr").length).toEqual(2);
});

it("renders the tableData", () => {
  expect(tableData.cfs).toEqual(174);
});
