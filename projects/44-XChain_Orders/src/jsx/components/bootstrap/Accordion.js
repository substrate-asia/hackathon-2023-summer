import React, { Fragment, useState } from "react";
// import { Link } from 'react-router-dom';
import { Row, Col, Card, Accordion } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

const UiAccordion = () => {
  const [activeDefault, setActiveDefault] = useState(0);
  const [activeBordered, setActiveBordered] = useState(0);
  const [activeWithoutSpace, setActiveWithoutSpace] = useState(0);
  const [activeWithoutSpaceBordered, setActiveWithoutSpaceBordered] = useState(
    0
  );
  const [
    activeIndicatorInLeftPosition,
    setActiveIndicatorInLeftPosition,
  ] = useState(0);
  const [activeAccordionWithIcon, setActiveAccordionWithIcon] = useState(0);
  const [activeAccordionHeaderBg, setActiveAccordionHeaderBg] = useState(0);
  const [activeAccordionSolidBg, setActiveAccordionSolidBg] = useState(0);
  const [
    activeAccordionActiveHeader,
    setActiveAccordionActiveHeader,
  ] = useState(0);
  const [
    activeAccordionHeaderShadow,
    setActiveAccordionHeaderShadow,
  ] = useState(0);
  const [
    activeaccordionRoundedStylish,
    setActiveaccordionRoundedStylish,
  ] = useState(0);
  const [activeAccordionGradient, setActiveAccordionGradient] = useState(0);

  const defaultAccordion = [
    {
      title: "Accordion Header One",
      text:
        "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",
      bg: "primary",
    },
    {
      title: "Accordion Header Two",
      text:
        "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",

      bg: "info",
    },
    {
      title: "Accordion Header Three",
      text:
        "Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod.",

      bg: "success",
    },
  ];

  return (
    <Fragment>
      <PageTitle
        activeMenu="Accordion"
        motherMenu="Bootstrap"
        pageContent="Accordion"
      />
      <Row>
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block card-header">
              <Card.Title>Default Accordion</Card.Title>
              <Card.Text className="m-0 subtitle">
                Default accordion. Add <code>accordion</code> class in root
              </Card.Text>
            </Card.Header>
            <Card.Body className="card-body">
              {/* <!-- Default accordion --> */}
              <Accordion
                className="accordion accordion-primary"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header rounded-lg ${
                        activeDefault === i ? "" : "collapsed"
                      }`}
                      onClick={() =>
                        setActiveDefault(activeDefault === i ? -1 : i)
                      }
                    >
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`}>
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion bordered</Card.Title>
              <Card.Text className="m-0 subtitle">
                Accordion with border. Add class <code>accordion-bordered</code>{" "}
                with the class <code> accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-danger-solid"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((data, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      className={`accordion-header ${
                        activeBordered !== i ? "collapsed" : ""
                      }`}
                      as={Card.Text}
                      eventKey={`${i}`}
                      onClick={() =>
                        setActiveBordered(activeBordered === i ? -1 : i)
                      }
                    >
                      {" "}
                      <span className="accordion-header-text">
                        {data.title}
                      </span>
                      <span className="accordion-header-indicator"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{data.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion without space</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-no-gutter</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-no-gutter accordion-header-bg"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header  ${
                        activeWithoutSpace === i ? "" : "collapsed"
                      }`}
                      onClick={() =>
                        setActiveWithoutSpace(activeWithoutSpace === i ? -1 : i)
                      }
                    >
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`}>
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Without Space With Border</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-no-gutter accordion-bordered</code> class
                with <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-no-gutter "
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeWithoutSpaceBordered === i ? "" : "collapsed"
                      }`}
                      onClick={() =>
                        setActiveWithoutSpaceBordered(
                          activeWithoutSpaceBordered === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator style_two"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`}>
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Indicator In Left Position</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-left-indicator</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-left-indicator"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeIndicatorInLeftPosition === i ? "" : "collapsed"
                      }`}
                      onClick={() =>
                        setActiveIndicatorInLeftPosition(
                          activeIndicatorInLeftPosition === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`}>
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion With Icon</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-with-icon</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-with-icon"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionWithIcon === i ? "" : "collapsed"
                      }`}
                      onClick={() =>
                        setActiveAccordionWithIcon(
                          activeAccordionWithIcon === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator indicator-bordered"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`}>
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Header Background</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-header-bg</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-header-bg "
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionHeaderBg === i ? "" : "collapsed"
                      } accordion-header-${d.bg}`}
                      onClick={() =>
                        setActiveAccordionHeaderBg(
                          activeAccordionHeaderBg === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator"></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={`${i}`} >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Solid Background</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-solid-bg</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-solid-bg"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionSolidBg === i ? "" : "collapsed"
                      } accordion-header-primary`}
                      onClick={() =>
                        setActiveAccordionSolidBg(
                          activeAccordionSolidBg === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator "></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Active Background</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-active-header</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-active-header"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionActiveHeader === i ? "" : "collapsed"
                      } accordion-header-primary`}
                      onClick={() =>
                        setActiveAccordionActiveHeader(
                          activeAccordionActiveHeader === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator "></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card className="transparent-card">
            <Card.Header className="d-block">
              <Card.Title>Accordion header shadow</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-header-shadow</code> and{" "}
                <code>accordion-rounded</code> class with <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-header-shadow accordion-rounded"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionHeaderShadow === i ? "" : "collapsed"
                      } accordion-header--primary`}
                      onClick={() =>
                        setActiveAccordionHeaderShadow(
                          activeAccordionHeaderShadow === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator "></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Rounded Stylish</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-rounded-stylish</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-rounded-stylish accordion-bordered"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeaccordionRoundedStylish === i ? "" : "collapsed"
                      } accordion-header-primary`}
                      onClick={() =>
                        setActiveaccordionRoundedStylish(
                          activeaccordionRoundedStylish === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator "></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
        {/* <!-- Column starts --> */}
        <Col xl="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Accordion Gradient</Card.Title>
              <Card.Text className="m-0 subtitle">
                Add <code>accordion-gradient</code> class with{" "}
                <code>accordion</code>
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Accordion
                className="accordion accordion-rounded-stylish accordion-gradient"
                defaultActiveKey="0"
              >
                {defaultAccordion.map((d, i) => (
                  <div className="accordion-item" key={i}>
                    <Accordion.Toggle
                      as={Card.Text}
                      eventKey={`${i}`}
                      className={`accordion-header ${
                        activeAccordionGradient === i ? "" : "collapsed"
                      } accordion-header--primary`}
                      onClick={() =>
                        setActiveAccordionGradient(
                          activeAccordionGradient === i ? -1 : i
                        )
                      }
                    >
                      <span className="accordion-header-icon"></span>
                      <span className="accordion-header-text">{d.title}</span>
                      <span className="accordion-header-indicator "></span>
                    </Accordion.Toggle>
                    <Accordion.Collapse
                      eventKey={`${i}`}
                      className="accordion__body"
                    >
                      <div className="accordion-body-text">{d.text}</div>
                    </Accordion.Collapse>
                  </div>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
        {/* <!-- Column ends --> */}
      </Row>{" "}
    </Fragment>
  );
};

export default UiAccordion;
