import React from "react";
import NavBar from "./navbar/NavBar";
import CarouselGraph from "./CarouselGraph";
import SortableTree from "react-sortable-tree";
import "react-sortable-tree/style.css";

export default class Agents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  render() {
    const { treeData } = this.state;

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
        <div>
          <SortableTree
            treeData={treeData}
            onChange={td => this.setState({ treeData: td })}
          />
        </div>
      </div>
    );
  }
}
