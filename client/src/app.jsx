import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Api } from "./api";
import { GallaryPage } from "./gallary-page";
import { VBox } from "./ui/vbox";

/**
 * @param {object} props
 * @param {Api} props.api
 */
export const Application = ({ api }) => {
  return (
    <VBox>
      <h1>Meedia</h1>
      <Router>
        <Route path="*">
          <GallaryPage api={api} />
        </Route>
      </Router>
    </VBox>
  );
};
