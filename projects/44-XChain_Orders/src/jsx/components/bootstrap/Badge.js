import React from "react";

/// Bootstrap
import { Col, Badge, Card, Row } from "react-bootstrap";

import PageTitle from "../../layouts/PageTitle";

const UiBadge = () => {
  return (
    <div className="badge-demo">
      <PageTitle
        motherMenu="Bootstrap"
        activeMenu="Badge"
        pageContent="Badge"
      />
      <Row>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Badges Size</Card.Title>
						<Card.Text className="mb-0 subtitle">
							Default Bootstrap Badges
						</Card.Text>
					</Card.Header>
					<Card.Body>
						<div className="bootstrap-badge">
							<Badge variant="primary badge-xs light">Primary</Badge>
							<Badge variant="primary badge-sm light">Primary</Badge>
							<Badge variant="secondary light">Secondary</Badge>
							<Badge variant="danger badge-lg light">Danger</Badge>
							<Badge variant="warning badge-xl light">Warning</Badge>
						</div>
					</Card.Body>
				</Card>
			</Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Badges Light</Card.Title>
						<Card.Text className="mb-0 subtitle">
							Default Bootstrap Badges
						</Card.Text>
					</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge variant="primary light">Primary</Badge>
						<Badge variant="secondary light">Secondary</Badge>
						<Badge variant="success light">Success</Badge>
						<Badge variant="danger light">Danger</Badge>
						<Badge variant="warning light">Warning</Badge>
						<Badge variant="info light">Info</Badge>
						<Badge variant="light light">Light</Badge>
						<Badge variant="dark light">Dark</Badge>
					</div>
					<div className="bootstrap-badge">
						<Badge variant="primary light">1</Badge>
						<Badge variant="secondary light">2</Badge>
						<Badge variant="success light">3</Badge>
						<Badge variant="danger light">4</Badge>
						<Badge variant="warning light">5</Badge>
						<Badge variant="info light">6</Badge>
						<Badge variant="light light">7</Badge>
						<Badge variant="dark light">8</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Badges </Card.Title>
					<Card.Text className="mb-0 subtitle">
						Default Bootstrap Badges
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge variant="primary">Primary</Badge>
						<Badge variant="secondary">Secondary</Badge>
						<Badge variant="success">Success</Badge>
						<Badge variant="danger">Danger</Badge>
						<Badge variant="warning">Warning</Badge>
						<Badge variant="info">Info</Badge>
						<Badge variant="light">Light</Badge>
						<Badge variant="dark">Dark</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>
        <Col lg="6">
			<Card>
				<Card.Header className="d-block">
					<Card.Title>Pill Badge </Card.Title>
					<Card.Text className="mb-0 subtitle">
						add <code>.badge-pill</code> to change the style
					</Card.Text>
				</Card.Header>
				<Card.Body>
					<div className="bootstrap-badge">
						<Badge variant="primary">Pill badge</Badge>
						<Badge variant="secondary">Pill badge</Badge>
						<Badge variant="success">Pill badge</Badge>
						<Badge variant="danger">Pill badge</Badge>
						<Badge variant="warning">Pill badge</Badge>
						<Badge variant="info">Pill badge</Badge>
						<Badge variant="light">Pill badge</Badge>
						<Badge variant="dark">Pill badge</Badge>
					</div>
				</Card.Body>
			</Card>
        </Col>

        <Col lg="6">
          <Card>
				<Card.Header className="d-block">
					<Card.Title>Link Badge </Card.Title>
					<Card.Text className="mb-0 subtitle">
						Link badge add in anchor tag
					</Card.Text>
				</Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
					<Badge as="a" href="" variant="primary">Links</Badge>
					<Badge as="a" href="" variant="secondary">Links</Badge>
					<Badge as="a" href="" variant="success">Links</Badge>
					<Badge as="a" href="" variant="danger">Links</Badge>
					<Badge as="a" href="" variant="warning">Links</Badge>
					<Badge as="a" href="" variant="info">Links</Badge>
					<Badge as="a" href="" variant="light">Links</Badge>
					<Badge as="a" href="" variant="dark">Links</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-rounded</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="primary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="secondary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="success badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="danger badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="warning badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="info badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="light badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="dark badge-rounded">
                  Rounded
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded Outline Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-rounded</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="outline-primary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-secondary badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-success badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-danger badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-warning badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-info badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-light badge-rounded">
                  Rounded
                </Badge>

                <Badge as="a" href="" variant="outline-dark badge-rounded">
                  Rounded
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Outline Circle Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-circle</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="outline-primary badge-circle">
                  1
                </Badge>

                <Badge as="a" href="" variant="outline-secondary badge-circle">
                  2
                </Badge>

                <Badge as="a" href="" variant="outline-success badge-circle">
                  3
                </Badge>

                <Badge as="a" href="" variant="outline-danger badge-circle">
                  4
                </Badge>

                <Badge as="a" href="" variant="outline-warning badge-circle">
                  5
                </Badge>

                <Badge as="a" href="" variant="outline-info badge-circle">
                  6
                </Badge>

                <Badge as="a" href="" variant="outline-light badge-circle">
                  7
                </Badge>

                <Badge as="a" href="" variant="outline-dark badge-circle">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Circle Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.badge-circle</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="primary badge-circle">
                  1
                </Badge>

                <Badge as="a" href="" variant="secondary badge-circle">
                  2
                </Badge>

                <Badge as="a" href="" variant="success badge-circle">
                  3
                </Badge>

                <Badge as="a" href="" variant="danger badge-circle">
                  4
                </Badge>

                <Badge as="a" href="" variant="warning badge-circle">
                  5
                </Badge>

                <Badge as="a" href="" variant="info badge-circle">
                  6
                </Badge>

                <Badge as="a" href="" variant="light badge-circle">
                  7
                </Badge>

                <Badge as="a" href="" variant="dark badge-circle">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Outline Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                Default bootstrap outline baadge
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="outline-primary">
                  1
                </Badge>

                <Badge as="a" href="" variant="outline-secondary">
                  2
                </Badge>

                <Badge as="a" href="" variant="outline-success">
                  3
                </Badge>

                <Badge as="a" href="" variant="outline-danger">
                  4
                </Badge>

                <Badge as="a" href="" variant="outline-warning">
                  5
                </Badge>

                <Badge as="a" href="" variant="outline-info">
                  6
                </Badge>

                <Badge as="a" href="" variant="outline-light">
                  7
                </Badge>

                <Badge as="a" href="" variant="outline-dark">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Number Badge </Card.Title>
              <Card.Text className="mb-0 subtitle">
                Default bootstrap outline baadge
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="primary">
                  1
                </Badge>

                <Badge as="a" href="" variant="secondary">
                  2
                </Badge>

                <Badge as="a" href="" variant="success">
                  3
                </Badge>

                <Badge as="a" href="" variant="danger">
                  4
                </Badge>

                <Badge as="a" href="" variant="warning">
                  5
                </Badge>

                <Badge as="a" href="" variant="info">
                  6
                </Badge>

                <Badge as="a" href="" variant="light">
                  7
                </Badge>

                <Badge as="a" href="" variant="dark">
                  8
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg="6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Badge Sizes </Card.Title>
              <Card.Text className="mb-0 subtitle">
                add{" "}
                <code>.badge-xs .badge-sm .badge-md .badge-lg .badge-xl</code>{" "}
                to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <div className="bootstrap-badge">
                <Badge as="a" href="" variant="primary badge-xs">
                  xs
                </Badge>

                <Badge as="a" href="" variant="secondary badge-sm">
                  sm
                </Badge>

                <Badge as="a" href="" variant="success badge-md">
                  md
                </Badge>

                <Badge as="a" href="" variant="danger badge-lg">
                  lg
                </Badge>

                <Badge as="a" href="" variant="warning badge-xl">
                  xl
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UiBadge;
