import ReactOnRails from "react-on-rails";

import LogsListing from "../components/LogsListing";
import LogsTableView from "../components/LogsTableView";
import Pages from "../components/Pages";
import Index from "../components/home/Index";
import LoginForm from "../components/home/LoginForm";
import NavBar from "../components/navbar/NavBar";

// This is how react_on_rails can see the LogsListing in the browser.
ReactOnRails.register({
  Index,
  NavBar,
  LoginForm,
  LogsListing,
  LogsTableView,
  Pages
});
