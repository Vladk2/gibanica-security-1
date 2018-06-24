import React from "react";
import _ from "lodash";

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

import { Alert } from "react-bootstrap";

import NavBar from "./navbar/NavBar";
import SortableTree from "react-sortable-tree";
import { getAgents, updateAgent, updateAgentsTree } from "../util/AgentsApi";

import "react-sortable-tree/style.css";

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.options = ["stefan-pc", "notebook"];

    this.state = {
      permissionGranted: false,
      edited: false,
      selectedAgent: undefined,
      modalOpened: false,
      toast: false,
      notificationError: false,
      treeData: []
    };

    this.agents_hierarchy = [];
  }

  componentWillMount() {
    if (this.isAdmin()) {
      this.setState({ permissionGranted: true });
      getAgents()
        .then(res => {
          this.setState({ treeData: this.parseData(res.data) });
        })
        .catch(err => console.log(err));
    } else {
      window.location.replace("/logs");
    }
  }

  isAdmin = () => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      return true;
    }

    return false;
  };

  parseData = data => {
    _.forEach(data, a => {
      a.title = a.name;
      a.subtitle = `${a._id["$oid"]}, type: ${a.type}, host: ${
        a.host
      }, address: ${a.address}`;
      a.canDrag = true;
      a.canDrop = true;
      a.children = [];

      this.agents_hierarchy.push({
        id: a._id["$oid"],
        super: a.agent_id ? a.agent_id["$oid"] : null
      });

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

    _(data).forEach(f => {
      const children = _(data)
        .filter(g => (g.agent_id ? g.agent_id["$oid"] : null) === f._id["$oid"])
        .value();

      f.children = f.children.concat(children ? children : []);
    });

    data = _(data)
      .filter(f => (f.agent_id ? f.agent_id["$oid"] : null) === null)
      .value();

    return data;
  };

  updateTreeOnMove = tree => {
    this.setState({ treeData: tree, edited: true });
  };

  // find agent node and replace it with server (updated) data
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
      } else {
        this.setState({ notificationError: true });
      }
    });
  };

  updateTreeHierarchy = () => {
    const { treeData } = this.state;
    const agentsHierarchyData = [];

    const findAgentsRecursive = function(node, agents) {
      if (!node.children) {
        return;
      }

      _.forEach(node.children, nodeChild => {
        if (nodeChild._id) {
          agents.push({
            id: nodeChild._id["$oid"],
            super: node._id["$oid"]
          });
          findAgentsRecursive(nodeChild, agents);
        }
      });
    };

    _.forEach(treeData, node => {
      agentsHierarchyData.push({
        id: node._id["$oid"],
        super: null
      });
      findAgentsRecursive(node, agentsHierarchyData);
    });

    const updatedAgents = [];

    _.forEach(this.agents_hierarchy, originalAgent => {
      _.forEach(agentsHierarchyData, updatedAgent => {
        if (originalAgent.id === updatedAgent.id) {
          if (originalAgent.super !== updatedAgent.super) {
            updatedAgents.push(updatedAgent);
          }
        }
      });
    });

    console.log(updatedAgents);

    updateAgentsTree({ agents: updatedAgents }).then(res => {
      if (res.status === 200) {
        this.agents_hierarchy = agentsHierarchyData;
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
      permissionGranted,
      treeData,
      edited,
      modalOpened,
      toast,
      notificationError,
      selectedAgent
    } = this.state;

    if (!permissionGranted) {
      return null;
    }

    return (
      <div
        className="container"
        style={{
          marginTop: "1%"
        }}
      >
        <NavBar />
        <br />
        {notificationError ? (
          <Alert bsStyle="warning">
            <div className="row">
              <div className="col-md-10">
                <strong>
                  Could not complete request. Your internet connection may not
                  be working.
                </strong>
              </div>
              <div className="col-md-2" style={{ textAlign: "right" }}>
                <button
                  className="btn btn-default"
                  type="submit"
                  onClick={() => this.setState({ notificationError: false })}
                >
                  Hide
                </button>
              </div>
            </div>
          </Alert>
        ) : null}
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
                onClick={this.updateTreeHierarchy}
              />
            ) : null}
          </div>
          <div className="col-md-7" />
          <div
            className="col-md-3"
            style={{
              textAlign: "right"
            }}
          />
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
