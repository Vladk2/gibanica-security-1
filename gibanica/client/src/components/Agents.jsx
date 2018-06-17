import React from "react";
import _ from "lodash";

import Select from "grommet/components/Select";
import Button from "grommet/components/Button";
import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import EditIcon from "grommet/components/icons/base/Edit";
import SubtractCircleIcon from "grommet/components/icons/base/SubtractCircle";
//import AddIcon from "grommet/components/icons/base/Add";
import Layer from "grommet/components/Layer";
import FormField from "grommet/components/FormField";
import TextInput from "grommet/components/TextInput";
import Label from "grommet/components/Label";
import Toast from "grommet/components/Toast";

import NavBar from "./navbar/NavBar";
import SortableTree from "react-sortable-tree";
import { getAgents, updateAgent } from "../util/AgentsApi";

import "react-sortable-tree/style.css";

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.options = ["stefan-pc", "notebook"];

    this.state = {
      edited: false,
      selectedMachine: undefined,
      selectedAgent: undefined,
      modalOpened: false,
      toast: false,
      treeData: []
    };
  }

  componentWillMount() {
    getAgents()
      .then(res => {
        this.setState({ treeData: this.parseData(res.data) });
      })
      .catch(err => console.log(err));
  }

  parseData = data => {
    _.forEach(data, a => {
      a.title = a.name;
      a.subtitle = `type: ${a.type}, host: ${a.host}, address: ${a.address}`;
      a.canDrag = true;
      a.canDrop = true;
      a.children = [];

      const paths = [];

      _.forEach(a.paths, p => {
        paths.push({
          path: p.path,
          title: p.path,
          format: p.format,
          canDrag: false,
          canDrop: false
        });
      });

      delete a.paths;

      a.children.push({
        title: "paths",
        canDrag: false,
        canDrop: false,
        children: paths
      });
    });

    const treeData = _.filter(data, a => !a.agent_id);
    const remainingData = _.difference(data, treeData);

    const checkChildrenRecursive = function(agent, treeAgent) {
      if (treeAgent.children) {
        _.forEach(treeAgent.children, treeAgentChild => {
          if (treeAgentChild._id) {
            if (agent.agent_id["$oid"] === treeAgentChild._id["$oid"]) {
              treeAgentChild.children.push(agent);
            } else {
              if (treeAgentChild.children) {
                checkChildrenRecursive(agent, treeAgentChild);
              }
            }
          }
        });
      }
    };

    _.forEach(treeData, treeAgent => {
      _.forEach(remainingData, agent => {
        if (agent.agent_id["$oid"] === treeAgent._id["$oid"]) {
          treeAgent.children.push(agent);
        } else {
          checkChildrenRecursive(agent, treeAgent);
        }
      });
    });

    return treeData;
  };

  updateTreeOnMove = tree => {
    this.setState({ treeData: tree, edited: true });
  };

  updateTree = (collection, newNode) => {
    _.forEach(collection, (child, index) => {
      if (child._id) {
        if (child._id["$oid"] === newNode._id["$oid"]) {
          collection[index] = newNode;
          return false; // exits loop
        } else {
          if (child.children) {
            this.updateTree(child.children, newNode);
          }
        }
      }
    });
  };

  updateAgents = () => {
    // send POST to SIEM
    const { selectedAgent } = this.state;

    updateAgent({
      _id: selectedAgent._id,
      name: selectedAgent.name,
      paths: _.find(selectedAgent.children, child => child.title === "paths")
        .children
    }).then(res => {
      if (res.status === 200) {
        let treeData = JSON.parse(JSON.stringify(this.state.treeData));

        this.updateTree(treeData, selectedAgent);

        this.setState({ treeData, toast: true, modalOpened: false });
      }
    });
  };

  updatePath = (text, index, pathOrFormat) => {
    const { selectedAgent } = this.state;

    const paths = _.find(selectedAgent.children, c => c.title === "paths")
      .children;

    for (let i = 0; i <= paths.length; i++) {
      if (index === i) {
        if (pathOrFormat === "path") {
          paths[i].title = text;
          paths[i].path = text;
        } else {
          paths[i].format = text;
        }
      }
    }

    _.forEach(selectedAgent.children, c => {
      if (c.title === "paths") {
        c.children = paths;
      }
    });

    this.setState({ selectedAgent });
  };

  removePath = path => {
    let selectedAgent = JSON.parse(JSON.stringify(this.state.selectedAgent));

    let paths = _.find(selectedAgent.children, c => c.title === "paths")
      .children;

    paths = _.filter(paths, p => p.title !== path.title);

    _.map(selectedAgent.children, child => {
      if (child.title === "paths") {
        child.children = paths;
      }
    });

    this.setState({ selectedAgent });
  };

  render() {
    const {
      treeData,
      selectedMachine,
      edited,
      modalOpened,
      toast,
      selectedAgent
    } = this.state;

    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
        }}
      >
        <NavBar />
        <br />{" "}
        {toast ? (
          <Toast status="ok" onClose={() => this.setState({ toast: false })}>
            {`${selectedAgent.title} updated`}
          </Toast>
        ) : null}
        <div className="row">
          <div className="col-md-2">
            {edited ? (
              <Button
                style={{
                  borderColor: "#33aca8"
                }}
                fill
                label="Save"
                type="submit"
                icon={<CheckmarkIcon />}
                onClick={this.updateAgents}
              />
            ) : null}
          </div>
          <div className="col-md-7" />
          <div
            className="col-md-3"
            style={{
              textAlign: "right"
            }}
          >
            <Select
              onChange={e => this.setState({ selectedMachine: e.option })}
              options={this.options}
              value={!selectedMachine ? "Select machine" : selectedMachine}
            />
          </div>
        </div>
        <br />
        <div
          style={{
            height: window.innerHeight,
            textAlign: "left"
          }}
        >
          {modalOpened ? (
            <Layer
              align="center"
              closer
              overlayClose
              onClose={() => this.setState({ modalOpened: false })}
            >
              <div
                style={{
                  padding: 20
                }}
              >
                <Label align="start" margin="none" size="small">
                  <p>
                    <b>Agent Name</b>
                  </p>
                </Label>
                <FormField size="large">
                  <TextInput
                    onDOMChange={e =>
                      this.setState({
                        selectedAgent: {
                          ...this.state.selectedAgent,
                          title: e.target.value,
                          name: e.target.value
                        }
                      })
                    }
                    value={selectedAgent.title}
                  />
                </FormField>
                <div
                  style={{
                    flex: 1,
                    flexDirection: "row"
                  }}
                >
                  <Label align="start" margin="none" size="small">
                    <p>
                      <b>Agent Paths</b>
                    </p>
                  </Label>
                </div>
                {selectedAgent.children
                  .find(c => c.title === "paths")
                  .children.map((child, i) => {
                    return (
                      <div key={i}>
                        <SubtractCircleIcon
                          onClick={() => this.removePath(child)}
                          colorIndex="neutral-2"
                          style={{
                            cursor: "pointer"
                          }}
                        />
                        <FormField size="medium">
                          <TextInput
                            label="path"
                            onDOMChange={e =>
                              this.updatePath(e.target.value, i, "path")
                            }
                            value={child.title}
                          />
                          <TextInput
                            label="log format"
                            onDOMChange={e =>
                              this.updatePath(e.target.value, i, "format")
                            }
                            value={child.format}
                          />
                        </FormField>
                        <br />
                      </div>
                    );
                  })}
                <Button
                  style={{
                    borderColor: "#33aca8"
                  }}
                  fill
                  label="Save"
                  type="submit"
                  icon={<CheckmarkIcon />}
                  onClick={this.updateAgents}
                />
              </div>
              <br />
            </Layer>
          ) : null}
          {treeData.length > 0 ? (
            <SortableTree
              treeData={treeData}
              onChange={td => this.updateTreeOnMove(td)}
              canDrag={({ node }) => node.canDrag}
              canDrop={({ node }) => node.canDrop}
              generateNodeProps={rowInfo => ({
                buttons: [
                  rowInfo.node.subtitle ? (
                    <EditIcon
                      colorIndex="neutral-4"
                      style={{
                        cursor: "pointer"
                      }}
                      size="small"
                      onClick={() =>
                        this.setState({
                          selectedAgent: JSON.parse(
                            JSON.stringify(rowInfo.node)
                          ), // make copy of it
                          modalOpened: true,
                          toast: false
                        })
                      }
                    />
                  ) : null
                ]
              })}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
