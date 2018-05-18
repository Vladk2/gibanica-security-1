import ReactOnRails from "react-on-rails";

import LogsListing from "../components/LogsListing";
import LogsTableView from "../components/LogsTableView";
import Pages from "../components/Pages";
import Index from "../components/home/Index";
import Login from "../components/home/LoginForm";

// This is how react_on_rails can see the LogsListing in the browser.
ReactOnRails.register({
  Index,
  LoginForm,
  LogsListing,
  LogsTableView,
  Pages
});
