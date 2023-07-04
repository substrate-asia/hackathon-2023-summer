import React, { Fragment } from "react";

import PageTitle from "../../layouts/PageTitle";
import { Row, Col, Card,  Tab, Nav } from "react-bootstrap";

const UiTab = () => {
  const tabData = [
    {
      name: "Home",
      icon: "home",
      content:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove.",
    },
    {
      name: "Profile",
      icon: "user",
      content:
        "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.      ",
    },
    {
      name: "Contact",
      icon: "phone",
      content:
        "Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove.",
    },

    {
      name: "Message",
      icon: "envelope",
      content:
        "Raw denim you probably haven't heard of them jean shorts Austin. Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor.      ",
    },
  ];

  return (
    <Fragment>
      <PageTitle activeMenu="Tab" motherMenu="Bootstrap" pageContent="Tab" />
      <Row>
        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Default Tab</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="default-tab">
                <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                  <Nav as="ul" className="nav-tabs">
                    {tabData.map((data, i) => (
                      <Nav.Item as="li" key={i}>
                        <Nav.Link eventKey={data.name.toLowerCase()}>
                          <i className={`la la-${data.icon} me-2`} />
                          {data.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                  <Tab.Content className="pt-4">
                    {tabData.map((data, i) => (
                      <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                        <h4>This is {data.name} title</h4>
                        <p>{data.content}</p>
                        <p>{data.content}</p>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Custom Tab 1</Card.Title>
            </Card.Header>
            <Card.Body>
              {/* <!-- Nav tabs --> */}
              <div className="custom-tab-1">
                <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                  <Nav as="ul" className="nav-tabs">
                    {tabData.map((data, i) => (
                      <Nav.Item as="li" key={i}>
                        <Nav.Link eventKey={data.name.toLowerCase()}>
                          <i className={`la la-${data.icon} me-2`} />
                          {data.name}
                        </Nav.Link>
                      </Nav.Item>
                    ))}
                  </Nav>
                  <Tab.Content className="pt-4">
                    {tabData.map((data, i) => (
                      <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                        <h4>This is {data.name} title</h4>
                        <p>{data.content}</p>
                        <p>{data.content}</p>
                      </Tab.Pane>
                    ))}
                  </Tab.Content>
                </Tab.Container>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Nav Pills Tabs</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                <Nav as="ul" className="nav-pills mb-4 light">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Nav.Item as="li" key={i}>
                          <Nav.Link eventKey={data.name.toLowerCase()}>
                            Tab {i === 1 ? "Two" : i === 2 ? "Three" : "One"}
                          </Nav.Link>
                        </Nav.Item>
                      )
                  )}
                </Nav>
                <Tab.Content className="">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                          <p>{data.content}</p>
                          <p>{data.content}</p>
                        </Tab.Pane>
                      )
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Nav Pills Tabs</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                <Nav as="ul" className="nav-pills mb-4 justify-content-end">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Nav.Item as="li" key={i}>
                          <Nav.Link eventKey={data.name.toLowerCase()}>
                            Tab {i === 1 ? "Two" : i === 2 ? "Three" : "One"}
                          </Nav.Link>
                        </Nav.Item>
                      )
                  )}
                </Nav>
                <Tab.Content className="">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                          <p>{data.content}</p>
                          <p>{data.content}</p>
                        </Tab.Pane>
                      )
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Vertical Nav Pill</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                  <Col sm={4}>
                    <Nav as="ul" className="flex-column nav-pills mb-3">
                      {tabData.map((data, i) => (
                        <Nav.Item as="li" key={i}>
                          <Nav.Link eventKey={data.name.toLowerCase()}>
                            {data.name}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </Col>
                  <Col sm={8}>
                    <Tab.Content className="ms-2">
                      {tabData.map((data, i) => (
                        <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                          <p>
                            {data.content} {data.content}
                          </p>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>{" "}
                  </Col>
                </Tab.Container>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Header>
              <Card.Title>Vertical Nav Pill</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row>
                <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                  <Col sm={8}>
                    <Tab.Content>
                      {tabData.map((data, i) => (
                        <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                          <p>
                            {data.content} {data.content}
                          </p>
                        </Tab.Pane>
                      ))}
                    </Tab.Content>
                  </Col>
                  <Col sm={4} id="order-2">
                    <Nav as="div" variant="pills" className="flex-column ms-2">
                      {tabData.map((data, i) => (
                        <Nav.Item as="a" key={i}>
                          <Nav.Link eventKey={data.name.toLowerCase()}>
                            {data.name}
                          </Nav.Link>
                        </Nav.Item>
                      ))}
                    </Nav>
                  </Col>
                </Tab.Container>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <div className="col-xl-12">
          <Card>
            <Card.Header>
              <Card.Title>Tab with icon</Card.Title>
            </Card.Header>
            <Card.Body>
              <Tab.Container defaultActiveKey={tabData[0].name.toLowerCase()}>
                <Nav as="ul" className="nav-tabs">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Nav.Item as="li" key={i}>
                          <Nav.Link eventKey={data.name.toLowerCase()}>
                            <i
                              className={`ti-${i === 2 ? "email" : data.icon}`}
                            />
                          </Nav.Link>
                        </Nav.Item>
                      )
                  )}
                </Nav>
                <Tab.Content className="pt-4">
                  {tabData.map(
                    (data, i) =>
                      i !== tabData.length - 1 && (
                        <Tab.Pane eventKey={data.name.toLowerCase()} key={i}>
                          <h4>This is icon title</h4>
                          <p>{data.content}</p>
                          <p>{data.content}</p>
                        </Tab.Pane>
                      )
                  )}
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Fragment>
  );
};

export default UiTab;
