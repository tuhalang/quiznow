import React from "react";
import classnames from "classnames";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Label,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

// core components
import Footer from "components/Footer/Footer.js";
import IndexNavbar from "components/Navbars/IndexNavbar";
import { useWeb3, WriteContract } from "hooks";
import { CREATE_QUIZ_WITH_ANSWER, CREATE_QUIZ_NO_ANSWER } from '../contracts/Quiz';
import { useHistory } from "react-router-dom";
import { createQuiz } from "../reducer/action";
import { useDispatch } from "react-redux";
import { sha256 } from "js-sha256";
import { css } from "@emotion/react";
import DotLoader from "react-spinners/DotLoader";

const override = css`
  position: absolute;
  top: 20%;
  left: 45%;
`;

export default function CreateQuizPage() {
  const [squares1to6, setSquares1to6] = React.useState("");
  const [squares7and8, setSquares7and8] = React.useState("");
  const [iconTabs, setIconsTabs] = React.useState(1);
  const [quiz, setQuiz] = React.useState("");
  const [expireDate, setExpireDate] = React.useState("");
  const [expireDateVotting, setExpireDateVotting] = React.useState("");
  const [reward, setReward] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { account, quizContract } = useWeb3();
  const history = useHistory();
  const dispatch = useDispatch();

  const diffExpireDate = (expireDate) => {
    if (expireDate === "")
      return null
    const diff = new Date(expireDate) - new Date()

    return Math.floor(diff / 1000)
  }

  const onCreateQuiz = () => {
    setLoading(true);
    let method;
    let params;
    let value = reward * 1e18;
    if (iconTabs === 2) {
      method = CREATE_QUIZ_NO_ANSWER;
      params = [sha256(quiz), diffExpireDate(expireDate), diffExpireDate(expireDateVotting)];
      if(params[1] <= 0 || params[2] <= 0){
        alert("Cannot choose date in the past");
        setLoading(false);
        return;
      }
      if(params[2] <= params[1]){
        alert("The moment finish voting cannot before the moment finish answer");
        setLoading(false);
        return;
      }
    } else {
      method = CREATE_QUIZ_WITH_ANSWER;
      params = [sha256(quiz), sha256(answer)]
    }
    const callback = (e, res) => {
      if (e === null) {
        const id = res.events.CreateQuiz.returnValues.id;
        const owner = account;

        dispatch(createQuiz(id, owner, quiz, answer, (err) => {
          setLoading(false);
          if (err == null) {
            history.push("/quizzes/" + id)
          } else {
            alert(err);
          }
        }));
      } else {
        setLoading(false);
        alert(e.message);
      }

    }
    WriteContract(quizContract, account, method, params, value, callback);
  }

  const onChangeQuiz = (e) => setQuiz(e.target.value);
  const onChangeAnswer = (e) => setAnswer(e.target.value);
  const onChangeExpireDate = (e) => setExpireDate(e.target.value);
  const onChangeExpireDateVotting = (e) => setExpireDateVotting(e.target.value);
  const onChangeReward = (e) => setReward(e.target.value);

  React.useEffect(() => {
    document.body.classList.toggle("register-page");
    document.documentElement.addEventListener("mousemove", followCursor);
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("register-page");
      document.documentElement.removeEventListener("mousemove", followCursor);
    };
  }, []);
  const followCursor = (event) => {
    let posX = event.clientX - window.innerWidth / 2;
    let posY = event.clientY - window.innerWidth / 6;
    setSquares1to6(
      "perspective(500px) rotateY(" +
      posX * 0.05 +
      "deg) rotateX(" +
      posY * -0.05 +
      "deg)"
    );
    setSquares7and8(
      "perspective(500px) rotateY(" +
      posX * 0.02 +
      "deg) rotateX(" +
      posY * -0.02 +
      "deg)"
    );
  };
  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        <div className="page-header">
          <div className="page-header-image" />
          <div className="dotLoader" hidden={!loading}>
            <DotLoader css={override} color={"#ffffff"} loading={true} size={150} />
          </div>
          <div className="content">
            <Container>
              <Row>
                <Col className="offset-lg-0 offset-md-3" lg="7" md="8">
                  <div
                    className="square square-7"
                    id="square7"
                    style={{ transform: squares7and8 }}
                  />
                  <div
                    className="square square-8"
                    id="square8"
                    style={{ transform: squares7and8 }}
                  />
                  <Card>
                    <CardHeader>
                      <Nav className="nav-tabs-info" role="tablist" tabs>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: iconTabs === 1,
                            })}
                            onClick={(e) => setIconsTabs(1)}
                            href="#"
                          >
                            <i className="tim-icons icon-spaceship" />
                            Nomal Quiz
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            className={classnames({
                              active: iconTabs === 2,
                            })}
                            onClick={(e) => setIconsTabs(2)}
                            href="#"
                          >
                            <i className="tim-icons icon-bag-16" />
                            No Answer Quiz
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </CardHeader>
                    <CardBody>
                      <TabContent className="tab-space" activeTab={"link" + iconTabs}>
                        <TabPane tabId="link1">
                          <Card className="card-register">
                            <CardBody>
                              <Form className="form">
                                <FormGroup row>
                                  <Label for="quiz" sm={2}>
                                    <b>Quiz</b>
                                  </Label>
                                  <Col sm={10}>
                                    <Input
                                      id="quiz"
                                      name="quiz"
                                      type="textarea"
                                      onChange={onChangeQuiz}
                                      value={quiz}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Label for="answer" sm={2}>
                                    <b>Answer</b>
                                  </Label>
                                  <Col sm={10}>
                                    <Input
                                      id="answer"
                                      name="answer"
                                      type="textarea"
                                      onChange={onChangeAnswer}
                                      value={answer}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Label for="reward" sm={2}>
                                    <b>Reward (Tomo)</b>
                                  </Label>
                                  <Col sm={10}>
                                    <Input
                                      id="reward"
                                      name="reward"
                                      type="number"
                                      onChange={onChangeReward}
                                      value={reward}
                                    />
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                            <CardFooter>
                              <Button
                                onClick={onCreateQuiz}
                                className="btn-round"
                                color="primary"
                                size="lg">
                                Create Quiz
                              </Button>
                            </CardFooter>
                          </Card>
                        </TabPane>
                        <TabPane tabId="link2">
                          <Card className="card-register">
                            <CardBody>
                              <Form className="form">
                                <FormGroup row>
                                  <Label for="quiz" sm={3}>
                                    <b>Quiz</b>
                                  </Label>
                                  <Col sm={9}>
                                    <Input
                                      id="quiz"
                                      name="quiz"
                                      type="textarea"
                                      onChange={onChangeQuiz}
                                      value={quiz}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Label for="expire" sm={3} >
                                    <b>Expire date (for answer)</b>
                                  </Label>
                                  <Col sm={9}>
                                    <Input
                                      id="expire"
                                      name="expireDate"
                                      type="datetime-local"
                                      onChange={onChangeExpireDate}
                                      value={expireDate}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Label for="expire" sm={3} >
                                    <b>Expire date (for votting)</b>
                                  </Label>
                                  <Col sm={9}>
                                    <Input
                                      id="expire"
                                      name="expireDateVotting"
                                      type="datetime-local"
                                      onChange={onChangeExpireDateVotting}
                                      value={expireDateVotting}
                                    />
                                  </Col>
                                </FormGroup>
                                <FormGroup row>
                                  <Label for="reward" sm={3}>
                                    <b>Reward (Tomo)</b>
                                  </Label>
                                  <Col sm={9}>
                                    <Input
                                      id="reward"
                                      name="reward"
                                      type="number"
                                      onChange={onChangeReward}
                                      value={reward}
                                    />
                                  </Col>
                                </FormGroup>
                              </Form>
                            </CardBody>
                            <CardFooter>
                              <Button
                                onClick={onCreateQuiz}
                                className="btn-round"
                                color="primary"
                                size="lg">
                                Create Quiz
                              </Button>
                            </CardFooter>
                          </Card>
                        </TabPane>
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              <div className="register-bg" />
              <div
                className="square square-1"
                id="square1"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-2"
                id="square2"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-3"
                id="square3"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-4"
                id="square4"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-5"
                id="square5"
                style={{ transform: squares1to6 }}
              />
              <div
                className="square square-6"
                id="square6"
                style={{ transform: squares1to6 }}
              />
            </Container>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
