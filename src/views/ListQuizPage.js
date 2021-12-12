import React, { useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { listQuizzes } from "../reducer/action";
import _ from "lodash";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { useHistory } from "react-router";

export default function ListQuiz() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { page, totalPage, quizzes } = useSelector(state => state.quiz);

  const loadQuizzes = (page = 1, size = 10) => {
    dispatch(listQuizzes(page, size));
  }

  /*eslint-disable */
  useEffect(() => {
    loadQuizzes();
  }, []);
  /*eslint-enable */


  return (
    <div className="section section-typo">
      <img
        alt="..."
        className="path"
        src={require("assets/img/path1.png").default}
      />
      <img
        alt="..."
        className="path path1"
        src={require("assets/img/path3.png").default}
      />
      <Container>
        <h3 className="title">Quizzes</h3>
        <div id="typography">
          <Row>
            <Col md="12">
              <div>
                {_.map(quizzes, (v, i) => {
                  return (
                    <blockquote
                      style={{cursor:"pointer"}}
                      onClick={() => {
                        history.push("/quizzes/" + v.id)
                      }}
                    >
                      {v.status ?
                        <p className="blockquote blockquote-info">
                          {v.content}
                          <br />
                          <br />
                          <small>- {v.owner}</small>
                        </p> :
                        <p className="blockquote blockquote-danger">
                          {v.content}
                          <br />
                          <br />
                          <small>- {v.owner}</small>
                        </p>
                      }

                    </blockquote>
                  )
                })}
              </div>
              <Pagination
                className="pagination pagination-info"
                listClassName="pagination-info"
              >
                <PaginationItem disabled={page === 1}>
                  <PaginationLink
                    aria-label="Previous"
                    onClick={(e) => {
                      if (page > 1) {
                        loadQuizzes(page - 1, 10);
                      }
                    }}
                  >
                    <span aria-hidden={true}>
                      <i
                        aria-hidden={true}
                        className="tim-icons icon-double-left"
                      />
                    </span>
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem className="active">
                  <PaginationLink>
                    {page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={page === totalPage}>
                  <PaginationLink
                    aria-label="Next"
                    onClick={(e) => {
                      if (page < totalPage) {
                        loadQuizzes(page + 1, 10);
                      }
                    }}
                  >
                    <span aria-hidden={true}>
                      <i
                        aria-hidden={true}
                        className="tim-icons icon-double-right"
                      />
                    </span>
                  </PaginationLink>
                </PaginationItem>
              </Pagination>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
}
