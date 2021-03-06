import React from "react";
import PropTypes from "prop-types";

export default class Pages extends React.Component {
  // pageNumbers = pagesCount => {
  //   let pages = [];

  //   for (let i = 1; i++; i < pagesCount) {
  //     pages.push(
  //       <li className="page-item">
  //         <a className="page-link">{i}</a>
  //       </li>
  //     );
  //   }

  //   return pages;
  // };

  render() {
    const { pagesCount, currentPage, load } = this.props;

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li
            style={{
              cursor: "pointer"
            }}
            className="page-item"
            onClick={() => load(parseInt(currentPage, 10) - 1)}
          >
            <a className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
          {Array.from(
            {
              length: pagesCount >= 19 ? 19 : pagesCount
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
                onClick={() => load(parseInt(i, 10))}
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
            onClick={() => load(parseInt(currentPage, 10) + 1)}
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

Pages.propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.any.isRequired, // bug if set to number|string
  load: PropTypes.func.isRequired
};
