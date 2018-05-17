import React from "react";
import { Pagination } from "react-bootstrap";

export default class Pages extends React.Component {
  constructor(props) {
    super(props);
  }

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

  render() {
    const { logs, pagesCount, currentPage, loadLogs } = this.props;
    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li
            className="page-item"
            onClick={() => loadLogs(parseInt(currentPage, 10) - 1)}
          >
            <a className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          <li
            className="page-item"
            onClick={() => loadLogs(parseInt(currentPage, 10) + 1)}
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

/* 
        <Pagination>
        {currentPage !== 1 ? (
          <Pagination.First onClick={() => loadLogs(1)} />
        ) : null}
        {currentPage !== 1 ? (
          <Pagination.Prev onClick={() => loadLogs(currentPage - 1)} />
        ) : null}
        {currentPage !== pagesCount ? (
          <Pagination.Next onClick={() => loadLogs(currentPage + 1)} />
        ) : null}
        {currentPage !== pagesCount ? (
          <Pagination.Last onClick={() => loadLogs(pagesCount)} />
        ) : null}
      </Pagination>
*/
