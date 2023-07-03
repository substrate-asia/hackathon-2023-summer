import React, { Fragment } from "react";
import {Link} from 'react-router-dom';
import PageTitle from "../../layouts/PageTitle";
import {
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  ButtonGroup,
  SplitButton,
} from "react-bootstrap";

const UiDropDown = () => {
  return (
    <Fragment>
      <PageTitle
        activeMenu="Dropdown"
        pageContent="Label"
        motherMenu="Bootstrap"
      />
      <Row>
        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Basic Dropdown</Card.Title>
              <Card.Text className="m-0 subtitle">
                A dropdown menu is a toggleable menu that allows the user to
                choose one value from a predefined list
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Dropdown button
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dropdown Divider</Card.Title>
              <Card.Text className="m-0 subtitle">
                The <code>.dropdown-divider</code> class is used to separate
                links inside the dropdown menu with a thin horizontal border
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Dropdown button
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item href="#">Another link</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dropdown Header</Card.Title>
              <Card.Text className="m-0 subtitle">
                The <code>.dropdown-header</code> class is used to add headers
                inside the dropdown menu
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Dropdown button
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <h5 className="dropdown-header">Dropdown header</h5>
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                    <h5 className="dropdown-header">Dropdown header</h5>
                    <Dropdown.Item href="#">Another link</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Disable and Active items</Card.Title>
              <Card.Text className="m-0 subtitle">
                The <code>.dropdown-header</code> class is used to add headers
                inside the dropdown menu
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Dropdown button
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">Normal</Dropdown.Item>
                    <Link to={"#"} className="dropdown-item active">
                      Active
                    </Link>
                    <Link to={"#"} className="dropdown-item disabled">
                      Disabled
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Align Right</Card.Title>
              <Card.Text className="m-0 subtitle">
                To right-align the dropdown, add the{" "}
                <code>.dropdown-menu-end</code> class to the element with
                .dropdown-menu
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary">
                    Dropdown button
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-right">
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dropup</Card.Title>
              <Card.Text className="m-0 subtitle">
                The <code>.dropup</code> class makes the dropdown menu expand
                upwards instead of downwards
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                {/* <!-- Default dropup button --> */}
                <DropdownButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-up"
                  drop="up"
                  variant="primary"
                  title="Dropup"
                  className="me-1 mt-1"
                >
                  <Dropdown.Item href="#">Link 1</Dropdown.Item>
                  <Dropdown.Item href="#">Link 2</Dropdown.Item>
                  <Dropdown.Item href="#">Link 3</Dropdown.Item>
                </DropdownButton>

                {/* <!-- Split dropup button --> */}
                <SplitButton
                  as={ButtonGroup}
                  variant="primary"
                  id="dropdown-button-drop-up"
                  className="mt-1"
                  drop="up"
                  title="Split dropup"
                >
                  <Dropdown.Item href="#">Link 1</Dropdown.Item>
                  <Dropdown.Item href="#">Link 2</Dropdown.Item>
                  <Dropdown.Item href="#">Link 3</Dropdown.Item>
                </SplitButton>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dropright </Card.Title>
              <Card.Text className="m-0 subtitle">
                Trigger dropdown menus at the right of the elements by adding{" "}
                <code>.dropend</code> to the parent element
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                {/* <!-- Default dropright button --> */}
                <div className="btn-group dropright ">
                  <DropdownButton
                    as={ButtonGroup}
                    id="dropdown-button-drop-right"
                    drop="right"
                    variant="primary"
                    title=" Dropright"
                    className="me-1 mb-1"
                  >
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </DropdownButton>
                </div>

                {/* <!-- Split dropright button --> */}
                <div className="btn-group dropright ">
                  <SplitButton
                    as={ButtonGroup}
                    variant="primary"
                    id="dropdown-button-drop-right"
                    className="mb-1 me-1"
                    drop="righy"
                    title="Split dropright"
                  >
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </SplitButton>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dropstart </Card.Title>
              <Card.Text className="m-0 subtitle">
                Trigger dropdown menus at the right of the elements by adding{" "}
                <code>.dropstart </code> to the parent element
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="basic-dropdown">
                {/* <!-- Default dropleft button --> */}
                <DropdownButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-start"
                  drop="start"
                  variant="primary"
                  className="dropstart me-1 mt-1"
                  title="dropstart"
                >
                  <Dropdown.Item href="#">Link 1</Dropdown.Item>
                  <Dropdown.Item href="#">Link 2</Dropdown.Item>
                  <Dropdown.Item href="#">Link 3</Dropdown.Item>
                </DropdownButton>

                {/* <!-- Split dropleft button --> */}
                <div className="btn-group ">
                  <SplitButton
                    as={ButtonGroup}
                    variant="primary"
                    id="dropdown-button-drop-start"
                    className="dropstart mt-1"
                    drop="start"
                    title="Split dropstart"
                  >
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </SplitButton>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Button Dropdowns</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="button-dropdown">
                {[
                  "Primary",
                  "Secondary",
                  "Success",
                  "Info",
                  "Warning",
                  "Danger",
                ].map((variant) => (
                  <SplitButton
                    key={variant}
                    as={ButtonGroup}
                    variant={variant.toLowerCase()}
                    id="dropdown-button-drop-dwon"
                    className="mt-1 me-1"
                    drop="dwon"
                    title={` ${variant}`}
                  >
                    <Dropdown.Item href="#">Link 1</Dropdown.Item>
                    <Dropdown.Item href="#">Link 2</Dropdown.Item>
                    <Dropdown.Item href="#">Link 3</Dropdown.Item>
                  </SplitButton>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Sizing</Card.Title>
              <Card.Text className="m-0 subtitle">
                Button dropdowns work with buttons of all sizes, including
                default and split dropdown buttons.
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="dropdown-size">
                {/* <!-- Large button groups (default and split) --> */}
                <DropdownButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-down"
                  drop="down"
                  variant="primary"
                  size="lg"
                  title=" Large button"
                  className="me-1 mb-1"
                >
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </DropdownButton>

                <SplitButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-down"
                  drop="down"
                  variant="primary"
                  size="lg"
                  title=" Large split button"
                  className="me-1"
                >
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </SplitButton>

                {/* <!-- Small button groups (default and split) --> */}

                <DropdownButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-down"
                  drop="down"
                  variant="primary"
                  size="sm"
                  className="mt-1 me-1"
                  title=" Large button"
                >
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </DropdownButton>

                <SplitButton
                  as={ButtonGroup}
                  id="dropdown-button-drop-down"
                  drop="down"
                  variant="primary"
                  size="sm"
                  title=" Large split button"
                  className="mt-1 me-1"
                >
                  <Dropdown.Item href="#">Action</Dropdown.Item>
                  <Dropdown.Item href="#">Another action</Dropdown.Item>
                  <Dropdown.Item href="#">Something else here</Dropdown.Item>
                  <div className="dropdown-divider"></div>
                  <Dropdown.Item href="#">Separated link</Dropdown.Item>
                </SplitButton>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Custom style</Card.Title>
              <Card.Text className="m-0 subtitle">
                Use <code>.custom-dropdown</code> this class for this style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle variant="" className="ps-0 mt-1 mb-2">
                      Last 7 days
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Last 1 Month</Dropdown.Item>
                      <Dropdown.Item href="#">Last 6 Month</Dropdown.Item>
                      <Dropdown.Item href="#">Last 10 Month</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-primary"
                      size="sm"
                      className="mt-1 mb-2"
                    >
                      Last 7 days
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Last 1 Month</Dropdown.Item>
                      <Dropdown.Item href="#">Last 6 Month</Dropdown.Item>
                      <Dropdown.Item href="#">Last 10 Month</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-primary"
                      size="sm"
                      className="mt-1 mb-2"
                    >
                      Last 1 Hour
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Last 1 hour</Dropdown.Item>
                      <Dropdown.Item href="#">Last 2 hour</Dropdown.Item>
                      <Dropdown.Item href="#">Last 3 hour</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="primary"
                      size="sm"
                      className="mt-1 mb-2"
                    >
                      Last 1 Hour
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Last 1 hour</Dropdown.Item>
                      <Dropdown.Item href="#">Last 2 hour</Dropdown.Item>
                      <Dropdown.Item href="#">Last 3 hour</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="primary"
                      className="btn btn-sm btn-primary mt-1 mb-2"
                      data-toggle="dropdown"
                    >
                      <i className="ti-search m-r-5" /> 3 AM
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">6 AM</Dropdown.Item>
                      <Dropdown.Item href="#">9 AM</Dropdown.Item>
                      <Dropdown.Item href="#">12 AM</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="primary"
                      size="sm"
                      id="whiteSpace"
                      className="mt-1 mb-2"
                    >
                      <i className="ti-calendar m-r-5" /> March 20, 2018 &nbsp;
                      To &nbsp;April 20, 2018
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">
                        May 20, 2018 &nbsp; To &nbsp; June 20, 2018
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        July 20, 2018 &nbsp; To &nbsp; August 20, 2018
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="button"
                      variant=""
                      className="btn sharp btn-primary tp-btn mt-1"
                      id="tp-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24" />
                          <circle fill="#000000" cx="12" cy="5" r="2" />
                          <circle fill="#000000" cx="12" cy="12" r="2" />
                          <circle fill="#000000" cx="12" cy="19" r="2" />
                        </g>
                      </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Option 1</Dropdown.Item>
                      <Dropdown.Item href="#">Option 2</Dropdown.Item>
                      <Dropdown.Item href="#">Option 3</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>

                <Col xl={3}>
                  <Dropdown>
                    <Dropdown.Toggle
                      as="button"
                      variant=""
                      className="btn sharp btn-primary tp-btn mt-1"
                      id="tp-btn"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        width="18px"
                        height="18px"
                        viewBox="0 0 24 24"
                        version="1.1"
                      >
                        <g
                          stroke="none"
                          strokeWidth="1"
                          fill="none"
                          fillRule="evenodd"
                        >
                          <rect x="0" y="0" width="24" height="24" />
                          <circle fill="#000000" cx="12" cy="5" r="2" />
                          <circle fill="#000000" cx="12" cy="12" r="2" />
                          <circle fill="#000000" cx="12" cy="19" r="2" />
                        </g>
                      </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Option 1</Dropdown.Item>
                      <Dropdown.Item href="#">Option 2</Dropdown.Item>
                      <Dropdown.Item href="#">Option 3</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiDropDown;
