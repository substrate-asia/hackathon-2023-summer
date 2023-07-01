import React, { Fragment } from "react";
import { Row, Col, Card, Button, Dropdown, ButtonGroup } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

const UiButton = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Buttons"
        pageContent="Buttons"
        motherMenu="Bootstrap"
      />
      <div className="btn-page">
        <Row>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Default button style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary">
                  Primary
                </Button>
                <Button className="me-2" variant="secondary">
                  Secondary
                </Button>
                <Button className="me-2" variant="success">
                  Success
                </Button>
                <Button className="me-2" variant="danger">
                  Danger
                </Button>
                <Button className="me-2" variant="warning">
                  Warning
                </Button>
                <Button className="me-2" variant="info">
                  Info
                </Button>
                <Button className="me-2" variant="light">
                  Light
                </Button>
                <Button variant="dark">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Button Light style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary light">
                  Primary
                </Button>
                <Button className="me-2" variant="secondary light">
                  Secondary
                </Button>
                <Button className="me-2" variant="success light">
                  Success
                </Button>
                <Button className="me-2" variant="danger light">
                  Danger
                </Button>
                <Button className="me-2" variant="warning light">
                  Warning
                </Button>
                <Button className="me-2" variant="info light">
                  Info
                </Button>
                <Button className="me-2" variant="light light">
                  Light
                </Button>
                <Button variant="dark light">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Outline Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Default outline button style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="outline-primary">
                  Primary
                </Button>
                <Button className="me-2" variant="outline-secondary">
                  Secondary
                </Button>
                <Button className="me-2" variant="outline-success">
                  Success
                </Button>
                <Button className="me-2" variant="outline-danger">
                  Danger
                </Button>
                <Button className="me-2" variant="outline-warning">
                  Warning
                </Button>
                <Button className="me-2" variant="outline-info">
                  Info
                </Button>
                <Button className="me-2" variant="outline-light">
                  Light
                </Button>
                <Button variant="outline-dark">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Button Sizes</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-lg .btn-sm .btn-xs</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary btn-lg">
                  Large Button
                </Button>
                <Button className="me-2" variant="primary">
                  Default Button
                </Button>
                <Button className="me-2" variant="primary btn-sm">
                  Small Button
                </Button>
                <Button className="me-2" variant="primary btn-xs">
                  Extra Small Button
                </Button>
                <Button variant="primary btn-xxs">Extra Small Button</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Outline Button Sizes</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-lg .btn-sm .btn-xs</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="outline-primary btn-lg">
                  Large button
                </Button>
                <Button className="me-2" variant="outline-primary">
                  Default button
                </Button>
                <Button className="me-2" variant="outline-primary btn-md">
                  Small button
                </Button>
                <Button className="me-2" variant="outline-primary btn-sm">
                  Small button
                </Button>
                <Button variant="outline-primary btn-xs">
                  Extra small button
                </Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Rounded Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-rounded</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Card.Title></Card.Title>
                <Button className="me-2" variant="primary btn-rounded">
                  Primary
                </Button>
                <Button className="me-2" variant="secondary btn-rounded">
                  Secondary
                </Button>
                <Button className="me-2" variant="success btn-rounded">
                  Success
                </Button>
                <Button className="me-2" variant="danger btn-rounded">
                  Danger
                </Button>
                <Button className="me-2" variant="warning btn-rounded">
                  Warning
                </Button>
                <Button className="me-2" variant="info btn-rounded">
                  Info
                </Button>
                <Button className="me-2" variant="light btn-rounded">
                  Light
                </Button>
                <Button variant="dark btn-rounded">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Rounded outline Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-rounded</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <div className="rounded-button">
                  <Button
                    className="me-2"
                    variant="outline-primary btn-rounded"
                  >
                    Primary
                  </Button>
                  <Button
                    className="me-2"
                    variant="outline-secondary btn-rounded"
                  >
                    Secondary
                  </Button>
                  <Button
                    className="me-2"
                    variant="outline-success btn-rounded"
                  >
                    Success
                  </Button>
                  <Button className="me-2" variant="outline-danger btn-rounded">
                    Danger
                  </Button>
                  <Button
                    className="me-2"
                    variant="outline-warning btn-rounded"
                  >
                    Warning
                  </Button>
                  <Button className="me-2" variant="outline-info btn-rounded">
                    Info
                  </Button>
                  <Button className="me-2" variant="outline-light btn-rounded">
                    Light
                  </Button>
                  <Button variant="outline-dark btn-rounded">Dark</Button>
                </div>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Button Right icons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-icon-end</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary">
                  Add to cart{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-shopping-cart" />
                  </span>
                </Button>
                <Button className="me-2" variant="info">
                  Add to wishlist{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-heart" />
                  </span>
                </Button>
                <Button className="me-2" variant="danger">
                  Remove{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-close" />
                  </span>
                </Button>
                <Button className="me-2" variant="secondary">
                  Sent message{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-envelope" />
                  </span>
                </Button>
                <Button className="me-2" variant="warning">
                  Add bookmark{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-star" />
                  </span>
                </Button>
                <Button variant="success">
                  Success{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-check" />
                  </span>
                </Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Button Left icons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-icon-start</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary btn-rounded">
                  <span className="btn-icon-start text-primary">
                    <i className="fa fa-shopping-cart" />
                  </span>
                  Buy
                </Button>
                <Button className="me-2" variant="info btn-rounded">
                  <span className="btn-icon-start text-info">
                    <i className="fa fa-plus color-info" />
                  </span>
                  Add
                </Button>
                <Button className="me-2" variant="danger btn-rounded">
                  <span className="btn-icon-start text-danger">
                    <i className="fa fa-envelope color-danger" />
                  </span>
                  Email
                </Button>
                <Button className="me-2" variant="secondary btn-rounded">
                  <span className="btn-icon-start text-secondary">
                    <i className="fa fa-share-alt color-secondary" />{" "}
                  </span>
                  Share
                </Button>
                <Button className="me-2" variant="warning btn-rounded">
                  <span className="btn-icon-start text-warning">
                    <i className="fa fa-download color-warning" />
                  </span>
                  Download
                </Button>
                <Button variant="success btn-rounded">
                  <span className="btn-icon-start text-success">
                    <i className="fa fa-upload color-success" />
                  </span>
                  Upload
                </Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Square Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-square</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary btn-square">
                  Primary
                </Button>
                <Button className="me-2" variant="secondary btn-square">
                  Secondary
                </Button>
                <Button className="me-2" variant="success btn-square">
                  Success
                </Button>
                <Button className="me-2" variant="danger btn-square">
                  Danger
                </Button>
                <Button className="me-2" variant="warning btn-square">
                  Warning
                </Button>
                <Button className="me-2" variant="info btn-square">
                  Info
                </Button>
                <Button className="me-2" variant="light btn-square">
                  Light
                </Button>
                <Button variant="dark btn-square">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Square Outline Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-square</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="outline-primary btn-square">
                  Primary
                </Button>
                <Button className="me-2" variant="outline-secondary btn-square">
                  Secondary
                </Button>
                <Button className="me-2" variant="outline-success btn-square">
                  Success
                </Button>
                <Button className="me-2" variant="outline-danger btn-square">
                  Danger
                </Button>
                <Button className="me-2" variant="outline-warning btn-square">
                  Warning
                </Button>
                <Button className="me-2" variant="outline-info btn-square">
                  Info
                </Button>
                <Button className="me-2" variant="outline-light btn-square">
                  Light
                </Button>
                <Button variant="outline-dark btn-square">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Rounded Button</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-rounded</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="primary btn-rounded">
                  Primary
                </Button>
                <Button className="me-2" variant="secondary btn-rounded">
                  Secondary
                </Button>
                <Button className="me-2" variant="success btn-rounded">
                  Success
                </Button>
                <Button className="me-2" variant="danger btn-rounded">
                  Danger
                </Button>
                <Button className="me-2" variant="warning btn-rounded">
                  Warning
                </Button>
                <Button className="me-2" variant="info btn-rounded">
                  Info
                </Button>
                <Button className="me-2" variant="light btn-rounded">
                  Light
                </Button>
                <Button variant="dark btn-rounded">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Rounded outline Buttons</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-rounded</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="outline-primary btn-rounded">
                  Primary
                </Button>
                <Button
                  className="me-2"
                  variant="outline-secondary btn-rounded"
                >
                  Secondary
                </Button>
                <Button className="me-2" variant="outline-success btn-rounded">
                  Success
                </Button>
                <Button className="me-2" variant="outline-danger btn-rounded">
                  Danger
                </Button>
                <Button className="me-2" variant="outline-warning btn-rounded">
                  Warning
                </Button>
                <Button className="me-2" variant="outline-info btn-rounded">
                  Info
                </Button>
                <Button className="me-2" variant="outline-light btn-rounded">
                  Light
                </Button>
                <Button variant="outline-dark btn-rounded">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Dropdown Button</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Default dropdown button style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle className="me-2" variant="primary">
                      Primary
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle className="me-2" variant="secondary">
                      Secondary
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle className="me-2" variant="success">
                      Success
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle className="me-2" variant="warning">
                      Warning
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>

                <ButtonGroup>
                  <Dropdown>
                    <Dropdown.Toggle variant="danger">Danger</Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                      <Dropdown.Item to="#">Dropdown link</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </ButtonGroup>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Buttons Transparent</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Button transparent style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button variant="primary tp-btn">Primary</Button>
                <Button variant="secondary tp-btn">Secondary</Button>
                <Button variant="success tp-btn">Success</Button>
                <Button variant="danger tp-btn">Danger</Button>
                <Button variant="warning tp-btn">Warning</Button>
                <Button variant="info tp-btn">Info</Button>
                <Button variant="light tp-btn">Light</Button>
                <Button variant="dark tp-btn">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Buttons Transparent Light</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  Button transparent light style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button variant="primary tp-btn-light">Primary</Button>
                <Button variant="secondary tp-btn-light">Secondary</Button>
                <Button variant="success tp-btn-light">Success</Button>
                <Button variant="danger tp-btn-light">Danger</Button>
                <Button variant="warning tp-btn-light">Warning</Button>
                <Button variant="info tp-btn-light">Info</Button>
                <Button variant="tp-btn-light text-black">Light</Button>
                <Button variant="dark tp-btn-light">Dark</Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Disabled Button</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>disabled="disabled"</code> to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button
                  className="me-2"
                  variant="primary btn-rounded"
                  disabled="disabled"
                >
                  Primary
                </Button>
                <Button
                  className="me-2"
                  variant="secondary btn-rounded"
                  disabled="disabled"
                >
                  Secondary
                </Button>
                <Button
                  className="me-2"
                  variant="success btn-rounded"
                  disabled="disabled"
                >
                  Success
                </Button>
                <Button
                  className="me-2"
                  variant="danger btn-rounded"
                  disabled="disabled"
                >
                  Danger
                </Button>
                <Button
                  className="me-2"
                  variant="warning btn-rounded"
                  disabled="disabled"
                >
                  Warning
                </Button>
                <Button variant="info btn-rounded" disabled="disabled">
                  Info
                </Button>
              </div>
            </Card>
          </Col>
          <Col lg="12">
            <Card>
              <Card.Header className="d-block">
                <Card.Title>Socia icon Buttons with Name</Card.Title>
                <Card.Text className="mb-0 subtitle">
                  add <code>.btn-facebook, .btn-twitter, .btn-youtube...</code>{" "}
                  to change the style
                </Card.Text>
              </Card.Header>
              <div className="card-body">
                <Button className="me-2" variant="facebook">
                  Facebook{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-facebook" />
                  </span>
                </Button>
                <Button className="me-2" variant="twitter">
                  Twitter{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-twitter" />
                  </span>
                </Button>
                <Button className="me-2" variant="youtube">
                  Youtube{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-youtube" />
                  </span>
                </Button>
                <Button className="me-2" variant="instagram">
                  Instagram{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-instagram" />
                  </span>
                </Button>
                <Button className="me-2" variant="pinterest">
                  Pinterest{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-pinterest" />
                  </span>
                </Button>
                <Button className="me-2" variant="linkedin">
                  Linkedin{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-linkedin" />
                  </span>
                </Button>
                <Button className="me-2" variant="google-plus">
                  Google +{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-google-plus" />
                  </span>
                </Button>
                <Button className="me-2" variant="google">
                  Google{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-google" />
                  </span>
                </Button>
                <Button className="me-2" variant="snapchat">
                  Snapchat{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-snapchat" />
                  </span>
                </Button>
                <Button className="me-2" variant="whatsapp">
                  Whatsapp{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-whatsapp" />
                  </span>
                </Button>
                <Button className="me-2" variant="tumblr">
                  Tumblr{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-tumblr" />
                  </span>
                </Button>
                <Button className="me-2" variant="reddit">
                  Reddit{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-reddit" />
                  </span>
                </Button>
                <Button className="me-2" variant="spotify">
                  Spotify{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-spotify" />
                  </span>
                </Button>
                <Button className="me-2" variant="yahoo">
                  Yahoo{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-yahoo" />
                  </span>
                </Button>
                <Button className="me-2" variant="dribbble">
                  Dribbble{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-dribbble" />
                  </span>
                </Button>
                <Button className="me-2" variant="skype">
                  Skype{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-skype" />
                  </span>
                </Button>
                <Button className="me-2" variant="quora">
                  Quora{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-quora" />
                  </span>
                </Button>
                <Button variant="vimeo">
                  Vimeo{" "}
                  <span className="btn-icon-end">
                    <i className="fa fa-vimeo" />
                  </span>
                </Button>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </Fragment>
  );
};

export default UiButton;
