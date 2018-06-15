import React from "react";
import Select from "grommet/components/Select";
import Button from "grommet/components/Button";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import NavBar from "./navbar/NavBar";
import CarouselGraph from "./CarouselGraph";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.options = [
      {
        value: "stefan-pc",
        label: "stefan-pc"
      },
      {
        value: "notebook",
        label: "notebook"
      }
    ];

    this.state = {
      edited: false,
      selectedMachine: undefined,
      treeData: [
        {
          title: "SIEM",
          children: [
            {
              title: "Firewall Agent",
              children: [
                {
                  title: "paths",
                  children: [
                    {
                      title: "/var/log/firewall.log"
                    }
                  ]
                },
                {
                  title: "Agents",
                  children: [
                    {
                      title: "Windows agent",
                      children: [
                        {
                          title: "Paths",
                          children: [
                            {
                              title: "C:\\sys32logssys.evl"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      title: "Linux agent",
                      children: [
                        {
                          title: "paths",
                          children: [
                            {
                              title: "/var/log/messages.log"
                            }
                          ]
                        }
                      ]
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

  updateTree = tree => {
    this.setState({ treeData: tree, edited: true });
  };

  updateMachineAgents = () => {
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
        <CarouselGraph />
        <br />
        <div className="row">
          <div className="col-md-9">
            {edited ? (
              <Button
                label="Save"
                type="submit"
                icon={<CheckmarkIcon />}
                onClick={this.updateMachineAgents}
              />
            ) : null}
          </div>
          <div className="col-md-3" style={{ textAlign: "right" }}>
            <Select
              onChange={e => this.setState({ selectedMachine: e.option })}
              options={this.options}
              Placeholder={
                !selectedMachine ? "Select machine" : selectedMachine.label
              }
            />
          </div>
        </div>
        <br />
        <div style={{ height: 500, textAlign: "left" }}>
          <SortableTree
            treeData={treeData}
            onChange={td => this.updateTree(td)}
          />
        </div>
      </div>
    );
  }
}
