import React, { Fragment } from "react";
import PageTitle from "../../layouts/PageTitle";
import { Row, Card, Col, ListGroup, Badge, Tab } from "react-bootstrap";

const UiListGroup = () => {
  const listItem = [
    "Cras justo odio",
    "Dapibus ac facilisis in",
    "Morbi leo risus",
    "Porta ac consectetur ac",
    "Vestibulum at eros",
  ];
  return (
    <Fragment>
      <PageTitle
        activeMenu="List Group"
        motherMenu="Bootstrap"
        pageContent="List Group"
      />
      <Row>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>Basic List Group</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup as="ul">
                  {listItem.map((list, i) => (
                    <Fragment key={i}>
                      <ListGroup.Item as="li">{list}</ListGroup.Item>
                    </Fragment>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>List Active items</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup as="ul">
                  {listItem.map((list, i) => (
                    <Fragment key={i}>
                      {i === 0 ? (
                        <ListGroup.Item as="li" active>
                          {list}
                        </ListGroup.Item>
                      ) : (
                        <ListGroup.Item as="li">{list}</ListGroup.Item>
                      )}
                    </Fragment>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>List Disabled items</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup as="ul">
                  {listItem.map((list, i) => (
                    <Fragment key={i}>
                      {i === 0 ? (
                        <ListGroup.Item as="li" disabled>
                          {list}
                        </ListGroup.Item>
                      ) : (
                        <ListGroup.Item as="li">{list}</ListGroup.Item>
                      )}
                    </Fragment>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>Links and buttons items</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup>
                  {listItem.map((list, i) => (
                    <Fragment key={i}>
                      {i === 0 ? (
                        <ListGroup.Item action active>
                          {list}
                        </ListGroup.Item>
                      ) : i === listItem.length - 1 ? (
                        <ListGroup.Item
						action
                          className="list-group-item-action disabled"
                        >
                          {list}
                        </ListGroup.Item>
                      ) : (
                        <ListGroup.Item action>{list}</ListGroup.Item>
                      )}
                    </Fragment>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>Flush</Card.Title>
            </Card.Header>
            <Card.Body>
              <ListGroup as="ul" variant="flush">
                {listItem.map((list, i) => (
                  <Fragment key={i}>
                    <ListGroup.Item as="li">{list}</ListGroup.Item>
                  </Fragment>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="4">
          <Card>
            <Card.Header>
              <Card.Title>With badges</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup>
                  {listItem.map((list, i) => (
                    <ListGroup.Item
                      className="d-flex justify-content-between align-items-center"
                      key={i}
                    >
                      {list}
                      <Badge variant="primary" pill>
                        {i + 1}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="6">
          <Card>
            <Card.Header>
              <Card.Title>Custom content</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup>
                  <ListGroup.Item
                    action
                    active
                    className="flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-3 text-white">
                        List group item heading
                      </h5>
                      <small>3 days ago</small>
                    </div>
                    <p className="mb-1">
                      Donec id elit non mi porta gravida at eget metus. Maecenas
                      sed diam eget risus varius blandit.
                    </p>
                    <small>Donec id elit non mi porta.</small>
                  </ListGroup.Item>
                  <ListGroup.Item  action className="flex-column">
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-3">List group item heading</h5>
                      <small className="text-muted">3 days ago</small>
                    </div>
                    <p className="mb-1">
                      Donec id elit non mi porta gravida at eget metus. Maecenas
                      sed diam eget risus varius blandit.
                    </p>
                    <small className="text-muted">
                      Donec id elit non mi porta.
                    </small>
                  </ListGroup.Item>
                  <ListGroup.Item
                    action
                    className="flex-column align-items-start"
                  >
                    <div className="d-flex w-100 justify-content-between">
                      <h5 className="mb-3">List group item heading</h5>
                      <small className="text-muted">3 days ago</small>
                    </div>
                    <p className="mb-1">
                      Donec id elit non mi porta gravida at eget metus. Maecenas
                      sed diam eget risus varius blandit.
                    </p>
                    <small className="text-muted">
                      Donec id elit non mi porta.
                    </small>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl="6">
          <Card>
            <Card.Header>
              <Card.Title>Contextual</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <ListGroup as="ul">
                  <ListGroup.Item variant="">
                    Dapibus ac facilisis in
                  </ListGroup.Item>
                  <ListGroup.Item variant="primary">
                    This is a primary list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="secondary">
                    This is a secondary list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="success">
                    This is a success list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="danger">
                    This is a danger list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="warning">
                    This is a warning list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="info">
                    This is a info list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="light">
                    This is a light list group item
                  </ListGroup.Item>
                  <ListGroup.Item variant="dark">
                    This is a dark list group item
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <div className="col-lg-12">
          <Card>
            <Card.Header>
              <Card.Title>List Tab</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="basic-list-group">
                <Row>
                  <Tab.Container defaultActiveKey="#home">
                    <Col lg="6" xl="2">
                      <ListGroup className="mb-4" id="list-tab">
                        <ListGroup.Item action href="#home">
                          Home
                        </ListGroup.Item>
                        <ListGroup.Item action href="#profile">
                          Profile
                        </ListGroup.Item>
                        <ListGroup.Item action href="#messages">
                          Messages
                        </ListGroup.Item>
                        <ListGroup.Item action href="#settings">
                          Settings
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                    <Col lg="6" xl="10">
                      <Tab.Content>
                        <Tab.Pane eventKey="#home">
                          <h4 className="mb-4">Home Tab Content</h4>
                          <p>
                            Velit aute mollit ipsum ad dolor consectetur nulla
                            officia culpa adipisicing exercitation fugiat
                            tempor. Voluptate deserunt sit sunt nisi aliqua
                            fugiat proident ea ut. Mollit voluptate
                            reprehenderit occaecat nisi ad non minim tempor sunt
                            voluptate consectetur exercitation id ut nulla. Ea
                            et fugiat aliquip nostrud sunt incididunt
                            consectetur culpa aliquip eiusmod dolor. Anim ad
                            Lorem aliqua in cupidatat nisi enim eu nostrud do
                            aliquip veniam minim.
                          </p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#profile">
                          <h4 className="mb-4">Profile Tab Content</h4>
                          <p>
                            Cupidatat quis ad sint excepteur laborum in esse
                            qui. Et excepteur consectetur ex nisi eu do cillum
                            ad laborum. Mollit et eu officia dolore sunt Lorem
                            culpa qui commodo velit ex amet id ex. Officia anim
                            incididunt laboris deserunt anim aute dolor
                            incididunt veniam aute dolore do exercitation. Dolor
                            nisi culpa ex ad irure in elit eu dolore. Ad laboris
                            ipsum reprehenderit irure non commodo enim culpa
                            commodo veniam incididunt veniam ad.
                          </p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#messages">
                          <h4 className="mb-4">Messages Tab Content</h4>
                          <p>
                            Ut ut do pariatur aliquip aliqua aliquip
                            exercitation do nostrud commodo reprehenderit aute
                            ipsum voluptate. Irure Lorem et laboris nostrud amet
                            cupidatat cupidatat anim do ut velit mollit
                            consequat enim tempor. Consectetur est minim nostrud
                            nostrud consectetur irure labore voluptate irure.
                            Ipsum id Lorem sit sint voluptate est pariatur eu ad
                            cupidatat et deserunt culpa sit eiusmod deserunt.
                            Consectetur et fugiat anim do eiusmod aliquip nulla
                            laborum elit adipisicing pariatur cillum.
                          </p>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#settings">
                          <h4 className="mb-4">Settings Tab Content</h4>
                          <p>
                            Irure enim occaecat labore sit qui aliquip
                            reprehenderit amet velit. Deserunt ullamco ex elit
                            nostrud ut dolore nisi officia magna sit occaecat
                            laboris sunt dolor. Nisi eu minim cillum occaecat
                            aute est cupidatat aliqua labore aute occaecat ea
                            aliquip sunt amet. Aute mollit dolor ut exercitation
                            irure commodo non amet consectetur quis amet culpa.
                            Quis ullamco nisi amet qui aute irure eu. Magna
                            labore dolor quis ex labore id nostrud deserunt
                            dolor eiusmod eu pariatur culpa mollit in irure.
                          </p>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Tab.Container>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Fragment>
  );
};

export default UiListGroup;
