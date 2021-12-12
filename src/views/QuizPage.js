import React from "react";
import classnames from "classnames";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import _ from "lodash";
// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Label,
  FormGroup,
  Input,
  FormText,
  NavItem,
  NavLink,
  Nav,
  Table,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  UncontrolledAlert
} from "reactstrap";

// core components
import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar";
import { useDispatch, useSelector } from "react-redux";
import { getQuiz } from "../reducer/action/index";
import { Countdown } from "../components/Common/Countdown";
import { useWeb3, WriteContract } from "hooks";
import { PREDICT_ANSWER, VOTING, AWARDS } from "../contracts/Quiz";
import { sha256 } from "js-sha256";
import { createAnswer, listAnswers, updateResultQuiz, updateVoteAnswer } from "../reducer/action";

import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";

const override = css`
  position: absolute;
  top: 40%;
  left: 45%;
`;

let ps = null;

export default function QuizPage({ match: { params: { id } } }) {

  const dispatch = useDispatch();

  const [tabs, setTabs] = React.useState(1);
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const { quiz } = useSelector(state => state.quiz);
  const { page, totalPage, answers } = useSelector(state => state.answer);
  const { account, quizContract } = useWeb3();

  const onChangeAnswer = (e) => setAnswer(e.target.value);
  const onClickAnswer = () => {

    if (account.toUpperCase() === quiz.owner.toUpperCase()) {
      alert("Owner cannot self answer.");
      return;
    }

    setLoading(true);
    const params = [quiz.id, sha256(answer)];
    const callback = (e, res) => {
      if (e === null) {
        const id = res.events.PredictAnswer.returnValues.id;
        const qid = res.events.PredictAnswer.returnValues.qid;
        const index = parseInt(res.events.PredictAnswer.returnValues.index, 10);

        dispatch(createAnswer(id, qid, index, answer, (err) => {
          if (err == null) {
            setAnswer("");
            loadAnswer();
          } else {
            alert(err);
          }
          setLoading(false);
        }));
      } else {
        alert(e.message);
        setLoading(false);
      }

    }
    WriteContract(quizContract, account, PREDICT_ANSWER, params, 0, callback);
  }

  const onVoting = (quizId, predictionId, index) => {
    setLoading(true);
    const params = [quizId, predictionId, index];
    const callback = (e, res) => {
      if (e === null) {
        dispatch(updateVoteAnswer(predictionId, quizId, index, (err) => {
          if (err === null) {
            loadAnswer(1, 5, id);
          } else {
            alert(err);
          }
        }))
      } else {
        alert(e.message);
        setLoading(false);
      }
    }
    WriteContract(quizContract, account, VOTING, params, 0, callback);
  }

  const onCheckWinner = (quizId) => {
    setLoading(true);
    const params = [quizId];
    const callback = (e, res) => {
      if (e === null) {
        if (res.events.length === 0) {
          alert("Haven't winner yet !");
        } else {
          const winner = res.events.RewardToWinder.returnValues.winner;
          dispatch(updateResultQuiz(quizId, (err) => {
            if (err === null) {
              dispatch(getQuiz(id));
              loadAnswer();
              if (winner.toUpperCase() === account.toUpperCase()) {
                alert("Conguralation, you are winner !");
              } else {
                alert("You aren't winner !");
              }
            } else {
              alert(err);
            }
          }))

        }
        setLoading(false);
      } else {
        alert(e.message);
        setLoading(false);
      }
    }
    WriteContract(quizContract, account, AWARDS, params, 0, callback);
  }

  const loadAnswer = (page = 1, size = 5, qid = id) => {
    dispatch(listAnswers(page, size, qid));
  }

  const getStatusQuiz = () => {
    if (quiz.type === 1) {
      if (quiz.status === 0) {
        return 2;
      }
    } else {
      if (quiz.timestamp + quiz.durationVoting <= Math.floor(new Date() / 1000)) {
        return 2;
      }
      if (quiz.timestamp + quiz.duration <= Math.floor(new Date() / 1000)) {
        return 1;
      }
    }
    return 0;
  }

  /*eslint-disable */
  React.useEffect(() => {
    dispatch(getQuiz(id));
    loadAnswer();
  }, []);
  /*eslint-enable */

  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      document.documentElement.className += " perfect-scrollbar-on";
      document.documentElement.classList.remove("perfect-scrollbar-off");
      let tables = document.querySelectorAll(".table-responsive");
      for (let i = 0; i < tables.length; i++) {
        ps = new PerfectScrollbar(tables[i]);
      }
    }
    document.body.classList.toggle("profile-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
        document.documentElement.className += " perfect-scrollbar-off";
        document.documentElement.classList.remove("perfect-scrollbar-on");
      }
      document.body.classList.toggle("profile-page");
    };
  }, []);
  return (
    <>
      <IndexNavbar />


      <div className="wrapper">
        <div className="page-header">
          <img
            alt="..."
            className="dots"
            src={require("assets/img/dots.png").default}
          />
          <img
            alt="..."
            className="path"
            src={require("assets/img/path4.png").default}
          />

          <div className="dotLoader" hidden={!loading}>
            <DotLoader css={override} color={"#ffffff"} loading={true} size={150} />
          </div>
          <Container className="align-items-center flex">

            {
              quiz.status === 1 ?
                getStatusQuiz() === 0 ?
                  <UncontrolledAlert className="alert-with-icon" color="info">
                    <span data-notify="icon" className="tim-icons icon-trophy" />
                    <span>
                      <b>Heads up! -</b>
                      Let's answer this quiz now !!!
                    </span>
                  </UncontrolledAlert>

                  : <UncontrolledAlert className="alert-with-icon" color="info">
                    <span data-notify="icon" className="tim-icons icon-trophy" />
                    <span>
                      <b>Heads up! -</b>
                      Let's vote the best answer now !!!
                    </span>
                  </UncontrolledAlert>

                : (quiz.winner !== undefined && account !== undefined && quiz.winner.toUpperCase() === account.toUpperCase()) ?
                  <UncontrolledAlert className="alert-with-icon" color="primary">
                    <span data-notify="icon" className="tim-icons icon-coins" />
                    <span>
                      <b>Congrats! -</b>
                      You are winner !!!
                    </span>
                  </UncontrolledAlert> 

                  : <UncontrolledAlert className="alert-with-icon" color="success">
                    <span data-notify="icon" className="tim-icons icon-bell-55" />
                    <span>
                      <b>Well done! -</b>
                      This quiz is finished !!!
                    </span>
                  </UncontrolledAlert>
            }

            <div>
              <Row>
                <Col lg="6" md="6">
                  {/* <h1 className="profile-title text-left">Quiz Content</h1> */}
                  <Countdown
                    timestamp={quiz.timestamp}
                    type={quiz.type}
                    status={quiz.status}
                    duration={quiz.duration}
                    durationVoting={quiz.durationVoting}
                  />
                  <p className="blockquote blockquote-info">
                    {quiz.content}
                    <br />
                    <br />
                    <small> - {quiz.owner}</small>
                  </p>


                  <div className="btn-wrapper profile pt-3">
                    {getStatusQuiz() === 0 ?
                      <Row>
                        <Col lg="8" md="8">
                          <Input
                            id="reward"
                            name="reward"
                            onChange={onChangeAnswer}
                            value={answer}
                            placeholder="Type your answer ..."
                            type="textarea"
                          />
                        </Col>
                        <Col lg="4" md="4">
                          <Button
                            onClick={onClickAnswer}
                            color="success"
                          >
                            Answer
                          </Button>
                        </Col>
                      </Row>
                      : <Row></Row>
                    }

                  </div>
                </Col>
                <Col className="ml-auto mr-auto" lg="6" md="6">
                  <Card className="card-coin card-plain">
                    <CardBody>
                      <Nav
                        className="nav-tabs-primary justify-content-center"
                        tabs
                      >
                        <NavItem>
                          {(quiz.status === 1 && (getStatusQuiz() === 2 || quiz.type === 1)) ?
                            <NavLink
                              className={classnames({
                                active: tabs === 1,
                              })}
                              onClick={(e) => {
                                e.preventDefault();
                                setTabs(1);
                                onCheckWinner(id);
                              }}
                              href="#"
                            >
                              Check Winner
                            </NavLink> : <NavLink></NavLink>
                          }
                        </NavItem>
                        {/* <NavItem>
                        <NavLink
                          className={classnames({
                            active: tabs === 2,
                          })}
                          onClick={(e) => {
                            e.preventDefault();
                            setTabs(2);
                          }}
                          href="#"
                        >
                          Winner
                        </NavLink>
                      </NavItem> */}
                      </Nav>
                      <TabContent
                        // className="tab-subcategories"
                        activeTab={"tab" + tabs}
                      >
                        <TabPane tabId="tab1">
                          <Table>
                            <thead className="text-primary">
                              <tr>
                                <th className="header">No.</th>
                                <th className="header">Answer</th>
                                <th className="header">Owner</th>
                                {quiz.type === 2 && quiz.status === 1 ?
                                  <th className="header">Vote</th> : <th></th>
                                }

                              </tr>
                            </thead>
                            <tbody>
                              {_.map(answers, (v, i) => {
                                return (
                                  <tr className={"answer_" + v.isCorrect}>
                                    <td style={{ maxWidth: 10 }}>{i + 1}</td>
                                    <td style={{ maxWidth: 100 }}>{v.content}</td>
                                    <td style={{ maxWidth: 50 }}>{v.owner.slice(0, 5) + "..." + v.owner.slice(37, 42)}</td>
                                    {(quiz.type === 2 && quiz.status === 1) ?
                                      <td style={{ maxWidth: 10 }}>
                                        <div style={{ display: "inline-block" }}>
                                          <Label style={{
                                            margin: 10,
                                            fontSize: 15,
                                            color: "#e3e3e3"
                                          }}>{v.vote}</Label>
                                          <Button
                                            className="btn-simple btn-icon btn-round float-right"
                                            color="primary"
                                            onClick={() => {
                                              onVoting(v.qid, v.id, v.index);
                                            }}
                                          >
                                            <i className="tim-icons icon-send" />
                                          </Button>
                                        </div>
                                      </td> : <td></td>
                                    }
                                    {(quiz.status === 0 && v.isCorrect === 1) ?
                                      <td>
                                        <i
                                          style={{ color: "green", fontWeight: "bold" }}
                                          aria-hidden={true}
                                          className="tim-icons icon-check-2" />
                                      </td> : <td></td>
                                    }
                                  </tr>
                                )
                              })}
                            </tbody>
                          </Table>
                          <Pagination
                            className="pagination pagination-info"
                            listClassName="pagination-info"
                          >
                            <PaginationItem disabled={page <= 1}>
                              <PaginationLink
                                aria-label="Previous"
                                onClick={(e) => {
                                  if (page > 1) {
                                    loadAnswer(page - 1, 5, id);
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
                            <PaginationItem disabled={page >= totalPage}>
                              <PaginationLink
                                aria-label="Next"
                                onClick={(e) => {
                                  if (page < totalPage) {
                                    loadAnswer(page + 1, 5, id);
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
                        </TabPane>
                        <TabPane tabId="tab2">
                          <Row>
                            <Label sm="3">Pay to</Label>
                            <Col sm="9">
                              <FormGroup>
                                <Input
                                  placeholder="e.g. 1Nasd92348hU984353hfid"
                                  type="text"
                                />
                                <FormText color="default" tag="span">
                                  Please enter a valid address.
                                </FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Label sm="3">Amount</Label>
                            <Col sm="9">
                              <FormGroup>
                                <Input placeholder="1.587" type="text" />
                              </FormGroup>
                            </Col>
                          </Row>
                          <Button
                            className="btn-simple btn-icon btn-round float-right"
                            color="primary"
                            type="submit"
                          >
                            <i className="tim-icons icon-send" />
                          </Button>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </div>

          </Container>
          <br /><br /><br /><br />
        </div>
        <Footer />

      </div >
    </>
  );
}
