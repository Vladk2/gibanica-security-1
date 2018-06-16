import React from "react";
import Select from "grommet/components/Select";
import Button from "grommet/components/Button";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import EditIcon from "grommet/components/icons/base/Edit";
import NavBar from "./navbar/NavBar";
import CarouselGraph from "./CarouselGraph";
import SortableTree from "react-sortable-tree";
import { getAgents } from "../util/AgentsApi";
import "react-sortable-tree/style.css";

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.options = ["stefan-pc", "notebook"];

    this.state = {
      edited: false,
      selectedMachine: undefined,
      treeData: [
        {
          title: "Firewall Agent",
          subtitle:
            "type: Firewall, host: notebook, address: 192.168.0.23:5000",
          canDrag: true,
          canDrop: true,
          children: [
            {
              title: "paths",
              canDrag: false,
              canDrop: false,
              children: [
                {
                  title: "/var/log/firewall.log",
                  editable: true,
                  canDrag: false,
                  canDrop: false
                }
              ]
            },
            {
              title: "Windows agent",
              subtitle:
                "type: Windows, host: stefan-pc, address: 192.168.0.21:5000",
              canDrag: true,
              canDrop: true,
              children: [
                {
                  title: "paths",
                  canDrag: false,
                  canDrop: false,
                  children: [
                    {
                      title: "C:\\sys32logssys.evl",
                      editable: true,
                      canDrag: false,
                      canDrop: false
                    }
                  ]
                }
              ]
            },
            {
              title: "Linux agent",
              subtitle:
                "type: Linux, host: stefan-pc, address: 192.168.0.21:4000",
              canDrag: true,
              canDrop: true,
              children: [
                {
                  title: "paths",
                  canDrag: false,
                  canDrop: false,
                  children: [
                    {
                      title: "/var/log/messages.log",
                      editable: true,
                      canDrag: false,
                      canDrop: false
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    };
  }

  componentWillMount() {
    getAgents()
      .then(res => {
        console.log(res.data);
      })
      .catch(err => console.log(err));
  }

  updateTree = tree => {
    this.setState({ treeData: tree, edited: true });
  };

  updateAgents = () => {
    // send POST to SIEM
    console.log("saving ...");
  };

  render() {
    const { treeData, selectedMachine, edited } = this.state;

    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
        }}
      >
        <NavBar />
        <br />
        <div className="row">
          <div className="col-md-9">
            {edited ? (
              <Button
                label="Save"
                type="submit"
                icon={<CheckmarkIcon />}
                onClick={this.updateAgents}
              />
            ) : null}
          </div>
          <div className="col-md-3" style={{ textAlign: "right" }}>
            <Select
              onChange={e => this.setState({ selectedMachine: e.option })}
              options={this.options}
              Placeholder={
                !selectedMachine ? "Select machine" : selectedMachine
              }
            />
          </div>
        </div>
        <br />
        <div style={{ height: 500, textAlign: "left" }}>
          <SortableTree
            treeData={treeData}
            onChange={td => this.updateTree(td)}
            canDrag={({ node }) => node.canDrag}
            canDrop={({ node }) => node.canDrop}
            generateNodeProps={rowInfo => ({
              buttons: [
                rowInfo.node.subtitle ? (
                  <EditIcon
                    style={{ cursor: "pointer" }}
                    size="small"
                    onClick={() => console.log(rowInfo)}
                  />
                ) : null
              ]
            })}
          />
        </div>
      </div>
    );
  }
}
