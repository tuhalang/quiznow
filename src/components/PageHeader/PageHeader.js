import React, { useState } from "react";
import { useHistory } from "react-router";

// reactstrap components
import { Button, Col, Container, Input, Row } from "reactstrap";

export default function PageHeader() {

  const history = useHistory();
  const [text, setText] = useState("");

  const changeText = (e) => setText(e.target.value);

  return (
    <div className="page-header header-filter">
      <div className="squares square1" />
      <div className="squares square2" />
      <div className="squares square3" />
      <div className="squares square4" />
      <div className="squares square5" />
      <div className="squares square6" />
      <div className="squares square7" />
      <Container>
        <div className="content-center brand">
          <h1 className="h1-seo textAnimation"
            onClick={() => {
              history.push("/quizzes");
            }}
          >
            Qiuz me
          </h1>
          <h3 className="d-none d-sm-block">
            Let's quiz me any thing !!!
          </h3>
          <div className="search-div">
            <Row>
              <Col md="11" lg="11">
                <Input
                  className="searchInput"
                  placeholder="QuizID (0x...)"
                  onChange={changeText}
                  value={text}
                />
              </Col>
              <Col md="1" lg="1">
                <Button
                  className="searchBtn"
                  onClick={() => {
                    if(text !== ""){
                      history.push("/quizzes/"+text);
                    }
                  }}
                >
                  <i aria-hidden={true} className="tim-icons icon-zoom-split" />
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
}
