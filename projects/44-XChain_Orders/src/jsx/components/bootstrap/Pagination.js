import React from "react";
import { Fragment } from "react";

import PageTitle from "../../layouts/PageTitle.js";
import { Row, Card, Nav, Col, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

const UiPagination = () => {
  const active = 1;
  let items = [];

  for (let number = 1; number <= 4; number++) {
    items.push(
      <Pagination.Item key={number} active={number === active}>
        {number}
      </Pagination.Item>
    );
  }
  const pag = (size, gutter, variant, bg, circle) => (
    <Pagination
      size={size}
      className={`mt-4  ${gutter ? "pagination-gutter" : ""} ${
        variant && `pagination-${variant}`
      } ${!bg && "no-bg"} ${circle && "pagination-circle"}`}
    >
      <li className="page-item page-indicator">
        <Link className="page-link" to="#">
          <i className="la la-angle-left" />
        </Link>
      </li>
      {items}
      <li className="page-item page-indicator">
        <Link className="page-link" to="#">
          <i className="la la-angle-right" />
        </Link>
      </li>
    </Pagination>
  );
  return (
    <Fragment>
      <PageTitle
        activeMenu="Pagination"
        motherMenu="Bootstrap"
        pageContent="Pagination"
      />
      <Row>
        <Col xl={6} className=" col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Pagination</Card.Title>
              <Card.Text className="mb-0 subtitle">
                Default pagination style
              </Card.Text>
            </Card.Header>
            <Card.Body className="pt-0">
              <Nav>{pag("", false, "", true, false)}</Nav>

              <Nav>{pag("sm", false, "", true, false)}</Nav>

              <Nav>{pag("xs", false, "", true, false)}</Nav>
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className=" col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Pagination Gutter</Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.pagination-gutter</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body className="pt-0">
              <Nav>{pag("", true, "", true, false)}</Nav>
              <Nav>{pag("sm", true, "", true, false)}</Nav>
              <Nav>{pag("xs", true, "", true, false)}</Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className=" col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Pagination Color</Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.pagination-gutter</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body className="pt-0">
              <Nav>{pag("", true, "primary", false, false)}</Nav>
              <Nav>{pag("", true, "danger", true, false)}</Nav>
              <Nav>{pag("sm", true, "info", true, false)}</Nav>
              <Nav>{pag("xs", true, "warning", true, false)}</Nav>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className=" col-xxl-6">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Pagination Circle</Card.Title>
              <Card.Text className="mb-0 subtitle">
                add <code>.pagination-circle</code> to change the style
              </Card.Text>
            </Card.Header>
            <Card.Body className="pt-0">
              <Nav>{pag("", true, "", true, true)}</Nav>
              <Nav>{pag("sm", true, "", true, true)}</Nav>
              <Nav>{pag("xs", true, "", true, true)}</Nav>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiPagination;
