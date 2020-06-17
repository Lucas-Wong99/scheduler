import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  prettyDOM,
  getByText,
  getAllByTestId,
  getByAltText,
  queryByText
} from "@testing-library/react";

afterEach(cleanup);

import Application from "components/Application";
describe("Application Cancel", () => {
  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
  const { container } = render(<Application />);
  

  // 2. Wait until the text "Archie Cohen" is displayed.
  await waitForElement(() => getByText(container, "Archie Cohen"));
  

  // 3. Click the delete button on the first show appointment
  const appointment = getAllByTestId(container, "appointment").find(
    appointment => queryByText(appointment, "Archie Cohen")
  );
  fireEvent.click(getByAltText(appointment, "Delete"));
 
  // 4. Check that the confirmation view shows with the confirm and cancel button
  expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
  expect(getByText(appointment, "Cancel")).toBeInTheDocument();

  // 5. Click the confirm button on the same appointment
  fireEvent.click(getByText(appointment, "Confirm"));

  // 6. Check that the DELETING is displayed on the dom 
  expect(getByText(appointment, "DELETING")).toBeInTheDocument();

  // 7. Wait until the Add button on the same appointment is displayed
  await waitForElement(() => getByAltText(appointment, "Add"));

  // 8. check that the dayList item has 2 spots remianing
  const day = getAllByTestId(container, "day").find(day => 
    queryByText(day, "Monday")
  );
  expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

})
 