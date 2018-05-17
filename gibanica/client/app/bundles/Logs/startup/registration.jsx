import ReactOnRails from "react-on-rails";

import LogsListing from "../components/LogsListing";
import LogsTableView from "../components/LogsTableView";
import Pages from "../components/Pages";

// This is how react_on_rails can see the LogsListing in the browser.
ReactOnRails.register({
  LogsListing,
  LogsTableView,
  Pages
});
