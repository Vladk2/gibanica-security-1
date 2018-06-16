import React from "react";

export default class SearchBadges extends React.Component {
  render() {
    const { badges, removeBadge } = this.props;

    return (
      <div className="row">
        <div
          className="col-lg-12"
          style={{
            textAlign: "left",
            flex: "row"
          }}
        >
          {badges.map((badge, i) => {
            return (
              <span className="tag label label-default" key={i}>
                <span>
                  {badge.filter}: {badge.search}
                </span>
                <a onClick={() => removeBadge(i)}>
                  <i className="remove glyphicon glyphicon-remove-sign glyphicon-white" />
                </a>
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}
