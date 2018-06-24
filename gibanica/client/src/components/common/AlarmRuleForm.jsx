import React from "react";

import Select from "grommet/components/Select";
import TextInput from "grommet/components/TextInput";
import AddIcon from "grommet/components/icons/base/Add";
import Button from "grommet/components/Button";
import DateTime from "grommet/components/DateTime";
import FormField from "grommet/components/FormField";

export default class AlarmRuleForm extends React.Component {
  render() {
    return (
      <div>
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
      </div>
    );
  }
}
