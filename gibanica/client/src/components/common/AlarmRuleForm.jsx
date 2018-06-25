import React from "react";

import _ from "lodash";

import Animate from "grommet/components/Animate";
import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import AddIcon from "grommet/components/icons/base/Add";
import DownIcon from "grommet/components/icons/base/Down";
import UpIcon from "grommet/components/icons/base/Up";
import Button from "grommet/components/Button";
import DateTime from "grommet/components/DateTime";
import FormField from "grommet/components/FormField";

import SearchBadges from "./SearchBadges";

export default class AlarmRuleForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      badges: [],
      formVisible: false,
      isAdmin: false,
      rule: "",
      match: undefined,
      title: "",
      message: ""
    };
  }

  componentWillMount() {
    this.setState({ isAdmin: localStorage.getItem("role") });
  }

  handleSelect = option => {
    const { badges } = this.state;

    const badge = _.find(badges, b => b.filter === option);

    if (badge) {
      this.setState({ match: option, rule: badge.search });
      return;
    }

    badges.push({ filter: option, search: "=" });

    this.setState({ match: option, badges, rule: "" });
  };

  handleRule = text => {
    const { badges, match } = this.state;

    _.forEach(badges, b => {
      if (b.filter === match) {
        if (text) {
          b.search = text;
        } else {
          b.search = "=";
        }
      }
    });

    this.setState({ badges, rule: text });
  };

  handleBadgeClick = badge => {
    this.setState({
      rule: badge.search === "=" ? "" : badge.search,
      match: badge.filter
    });
  };

  removeBadge = badge_index => {
    const badges_copy = this.state.badges;
    badges_copy.splice(badge_index, 1);
    this.setState({ badges: badges_copy });
  };

  render() {
    const {
      formVisible,
      isAdmin,
      badges,
      title,
      message,
      rule,
      match
    } = this.state;

    if (!isAdmin) {
      return null;
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-2">
            <Button
              style={{
                borderColor: "#33aca8"
              }}
              fill
              label={formVisible ? "Hide Form" : "New Rule"}
              type="submit"
              icon={formVisible ? <UpIcon /> : <DownIcon />}
              onClick={() =>
                this.setState({ formVisible: !this.state.formVisible })
              }
            />
          </div>
          <div className="col-md-10" />
        </div>
        <br />
        <Animate
          visible={formVisible}
          enter={{ animation: "slide-left", duration: 500, delay: 0 }}
          leave={{ animation: "slide-right", duration: 500, delay: 0 }}
          keep={false}
        >
          <div className="row">
            <div className="col-md-3">
              <FormField>
                <TextInput
                  value={title}
                  onDOMChange={e => this.setState({ title: e.target.value })}
                  style={{ width: "100%" }}
                  name="title"
                  placeHolder="Title"
                />
              </FormField>
            </div>
            <div className="col-md-6">
              <FormField>
                <TextInput
                  value={message}
                  onDOMChange={e => this.setState({ message: e.target.value })}
                  style={{ width: "100%" }}
                  name="message"
                  placeHolder="Message"
                />
              </FormField>
            </div>
            <div className="col-md-3">
              <Button
                style={{
                  borderColor: "#33aca8"
                }}
                fill
                plain
                label="Save"
                type="submit"
                icon={<AddIcon />}
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3">
              <FormField label="Match By">
                <Select
                  onChange={o => this.handleSelect(o.value)}
                  inline={false}
                  multiple={false}
                  options={["severity", "host", "process", "message"]}
                  value={match}
                />
              </FormField>
            </div>
            <div className="col-md-9">
              <FormField label="Rule goes here">
                <TextInput
                  value={rule}
                  style={{ width: "100%" }}
                  name="rule"
                  onDOMChange={e => this.handleRule(e.target.value)}
                />
              </FormField>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3">
              <FormField label="Start Date">
                <DateTime format="D/M/YYYY H:mm:ss" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="End Date">
                <DateTime format="D/M/YYYY H:mm:ss" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="Count (Optional)">
                <TextInput />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="Time Interval">
                <TextInput />
              </FormField>
            </div>
          </div>
          <Animate
            visible={badges.length > 0}
            enter={{ animation: "slide-down", duration: 500, delay: 0 }}
            leave={{ animation: "slide-up", duration: 500, delay: 0 }}
            keep
          >
            <br />
            <SearchBadges
              badges={badges}
              removeBadge={this.removeBadge}
              badgeClick={this.handleBadgeClick}
            />
          </Animate>
        </Animate>
      </div>
    );
  }
}
