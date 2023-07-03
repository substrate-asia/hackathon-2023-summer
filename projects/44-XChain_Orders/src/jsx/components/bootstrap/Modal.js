import React, { useState } from "react";
import {Link} from 'react-router-dom';
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import PageTitle from "../../layouts/PageTitle";

const UiModal = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [contentModal, setContentModal] = useState(false);
  const [modalCentered, setModalCentered] = useState(false);
  const [modalWithTooltip, setModalWithTooltip] = useState(false);
  const [gridInsideModal, setGridInsideModal] = useState(false);
  const [largeModal, setLargeModal] = useState(false);
  const [smallModal, setSmallModal] = useState(false);
  return (
    <div className="h-80">
      <PageTitle
        pageContent="Modal"
        motherMenu={"Bootstrap"}
        activeMenu={"Modal"}
      />
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Card.Title>Bootstrap Modal</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text className="mb-4">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. A,
                minima! Eligendi minima illum itaque harum aliquam vel, sunt
                magni dolorem! Cum quaerat est cupiditate saepe quidem, fugiat
                in at magni ad provident distinctio eum tempore laboriosam
                adipisci, tempora cumque ex quis unde voluptatem consequuntur.
                Excepturi quibusdam accusamus deleniti officiis ullam
                repellendus magni unde? Saepe quibusdam vel, ipsum numquam
                ratione tempore. Dolor optio aliquid in velit eaque, sed
                delectus reprehenderit quam quidem a eum id nostrum ullam
                obcaecati error deleniti modi quasi harum possimus voluptatum
                repellat saepe! Omnis dolor maiores eaque deserunt
                exercitationem incidunt autem et voluptatibus molestias quod
                explicabo ipsam nam vitae a architecto, consectetur quas facilis
                sed nulla, placeat eum ex, ducimus in. Hic quo necessitatibus
                autem tempora provident!
              </Card.Text>
              <div className="bootstrap-modal">
                {/* <!-- Button trigger modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setBasicModal(true)}
                >
                  Basic modal
                </Button>
                {/* <!-- Modal --> */}
                <Modal className="fade" show={basicModal}>
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setBasicModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>Modal body text goes here.</Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => setBasicModal(false)}
                      variant="danger light"
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>

                {/* <!-- Button trigger modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setContentModal(true)}
                >
                  Long content Modal
                </Button>
                {/* <!-- Modal --> */}
                <Modal className="fade" show={contentModal}>
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setContentModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                    <p>
                      Praesent commodo cursus magna, vel scelerisque nisl
                      consectetur et. Vivamus sagittis lacus vel augue laoreet
                      rutrum faucibus dolor auctor.
                    </p>
                    <p>
                      Aenean lacinia bibendum nulla sed consectetur. Praesent
                      commodo cursus magna, vel scelerisque nisl consectetur et.
                      Donec sed odio dui. Donec ullamcorper nulla non metus
                      auctor fringilla.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setContentModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>
                {/* <!-- Button trigger modal --> */}
                <Button
                  variant="primary"
                  type="button"
                  className="mb-2 me-2"
                  onClick={() => setModalCentered(true)}
                >
                  Modal centered
                </Button>
                {/* <!-- Modal --> */}
                <Modal className="fade" show={modalCentered}>
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      onClick={() => setModalCentered(false)}
                      variant=""
                      className="btn-close"
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Cras mattis consectetur purus sit amet fermentum. Cras
                      justo odio, dapibus ac facilisis in, egestas eget quam.
                      Morbi leo risus, porta ac consectetur ac, vestibulum at
                      eros.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      onClick={() => setModalCentered(false)}
                      variant="danger light"
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>

                {/* <!-- Button trigger modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setModalWithTooltip(true)}
                >
                  Modal with tooltip
                </Button>
                {/* <!-- Modal --> */}
                <Modal className="fade" show={modalWithTooltip}>
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setModalWithTooltip(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>
                    <h5>Popover in a modal</h5>
                    <p>
                      This{" "}
                      <Link to={"#"} 
                        role="button"
                        data-container="body"
                        data-toggle="popover"
                        className="btn btn-secondary popover-test"
                        title="Popover title"
                        data-content="Popover body content is set in this attribute."
                      >
                        button
                      </Link>{" "}
                      triggers a popover on click.
                    </p>
                    <hr />
                    <h5>Tooltips in a modal</h5>
                    <p>
                      <Link to={"#"}
                        className="tooltip-test text-primary"
                        data-toggle="tooltip"
                        title="Told you!"
                      >
                        This link
                      </Link>{" "}
                      and{" "}
                      <Link to={"#"}
                        className="tooltip-test text-primary"
                        data-toggle="tooltip"
                        title="Another one!"
                      >
                        that link
                      </Link>{" "}
                      have tooltips on hover.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setModalWithTooltip(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>

                {/* <!-- Button trigger modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setGridInsideModal(true)}
                >
                  Grid Inside Modal
                </Button>
                {/* <!-- Modal --> */}
                <Modal className="fade" show={gridInsideModal}>
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setGridInsideModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>
                    <Container>
                      <Row>
                        <Col md="4">.col-md-4</Col>
                        <Col md="4" className="ms-auto">
                          .col-md-4 .ms-auto
                        </Col>
                      </Row>
                      <Row>
                        <Col md="3" className="ms-auto">
                          .col-md-3 .ms-auto
                        </Col>
                        <Col md="2" className="ms-auto">
                          .col-md-2 .ms-auto
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6" className="ms-auto">
                          .col-md-6 .ms-auto
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="9">
                          Level 1: .col-sm-9
                          <Row>
                            <Col sm="6">Level 2: .col-8 .col-sm-6</Col>
                            <Col sm="6">Level 2: .col-4 .col-sm-6</Col>
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setGridInsideModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>

                {/* <!-- Large modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setLargeModal(true)}
                >
                  Large modal
                </Button>
                <Modal
                  className="fade bd-example-modal-lg"
                  show={largeModal}
                  size="lg"
                >
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setLargeModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>Modal body text goes here.</Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setLargeModal(false)}
                    >
                      Close
                    </Button>
                    <Button
                      variant=""
                      type="button"
                      className="btn btn-primary"
                    >
                      Save changes
                    </Button>
                  </Modal.Footer>
                </Modal>

                {/* <!-- Small modal --> */}
                <Button
                  variant="primary"
                  className="mb-2 me-2"
                  onClick={() => setSmallModal(true)}
                >
                  Small modal
                </Button>
                <Modal
                  className="fade bd-example-modal-sm"
                  size="sm"
                  show={smallModal}
                >
                  <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Button
                      variant=""
                      className="btn-close"
                      onClick={() => setSmallModal(false)}
                    >
                      
                    </Button>
                  </Modal.Header>
                  <Modal.Body>Modal body text goes here.</Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="danger light"
                      onClick={() => setSmallModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary">Save changes</Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UiModal;
