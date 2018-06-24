import React from "react";

import { Collapse } from "react-collapse";

import Animate from "grommet/components/Animate";
import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import AddIcon from "grommet/components/icons/base/Add";
import DownIcon from "grommet/components/icons/base/Down";
import UpIcon from "grommet/components/icons/base/Up";
import Button from "grommet/components/Button";
import DateTime from "grommet/components/DateTime";
import FormField from "grommet/components/FormField";

export default class AlarmRuleForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formVisible: false
    };
  }

  render() {
    const { formVisible } = this.state;

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
                  style={{ width: "100%" }}
                  id="item1"
                  name="item-1"
                  placeHolder="Title"
                />
              </FormField>
            </div>
            <div className="col-md-6">
              <FormField>
                <TextInput
                  style={{ width: "100%" }}
                  id="item1"
                  name="item-1"
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
                  inline={false}
                  multiple={false}
                  options={["severity", "host", "process", "message"]}
                  value={undefined}
                />
              </FormField>
            </div>
            <div className="col-md-6">
              <FormField label="Rule goes here">
                <TextInput style={{ width: "100%" }} id="item1" name="item-1" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="Count (Optional)">
                <TextInput />
              </FormField>
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-md-3">
              <FormField label="Start Date">
                <DateTime format="D/M/YYYY" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="End Date">
                <DateTime format="D/M/YYYY" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="Start Time">
                <DateTime name="name" format="H:mm:ss" />
              </FormField>
            </div>
            <div className="col-md-3">
              <FormField label="End Time">
                <DateTime name="name" format="H:mm:ss" />
              </FormField>
            </div>
          </div>
        </Animate>
      </div>
    );
  }
}
