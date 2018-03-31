import ReactOnRails from 'react-on-rails';

import LogsListing from '../components/LogsListing';
import LogView from '../components/LogView';

// This is how react_on_rails can see the LogsListing in the browser.
ReactOnRails.register({
  LogsListing,
  LogView,
});
