import React from "react";

export default class Pages extends React.Component {
  pageNumbers = pagesCount => {
    let pages = [];

    for (let i = 1; i++; i < pagesCount) {
      pages.push(
        <li className="page-item">
          <a className="page-link">{i}</a>
        </li>
      );
    }

    return pages;
  };

  queryLogs = page => {
    const { query, searchPerPage, loadLogs } = this.props;
    if (query) {
      searchPerPage(query, page);
    } else {
      loadLogs(page);
    }
  };

  render() {
    const { pagesCount, currentPage } = this.props;

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li
            style={{
              cursor: "pointer"
            }}
            className="page-item"
            onClick={() => this.queryLogs(parseInt(currentPage, 10) - 1)}
          >
            <a className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          {Array.from(
            {
              length: pagesCount
            },
            (v, k) => k + 1
          ).map((i, k) => {
            return (
              <li
                style={{
                  cursor: "pointer"
                }}
                className="page-item"
                key={k}
                onClick={() => this.queryLogs(parseInt(i, 10))}
              >
                <a className="page-link">{i}</a>
              </li>
            );
          })}
          <li
            style={{
              cursor: "pointer"
            }}
            className="page-item"
            onClick={() => this.queryLogs(parseInt(currentPage, 10) + 1)}
          >
            <a className="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
