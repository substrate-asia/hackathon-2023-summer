import React, { Fragment, useState } from "react";
import {Link} from 'react-router-dom';
import data from "./alertData";
import PageTitle from "../../layouts/PageTitle";
import { Row, Card, Col, Alert, Button, Badge, Media } from "react-bootstrap";

const UiAlert = () => {
  const [socialMedia, setSocialMedia] = useState(
    Array.from(data.socialMediaData)
  );

  const [leftIconBig, setLeftIconBig] = useState(
    Array.from(data.leftBigIconData)
  );

  const [basicData, setBasicData] = useState(Array.from(data.mainData));
  const [solidColor, setSolidColor] = useState(Array.from(data.mainData));
  const [square] = useState(Array.from(data.mainData));
  const [rounded] = useState(Array.from(data.mainData));
  const [dismissable, setDismissable] = useState(Array.from(data.mainData));
  const [alt, setAlt] = useState(Array.from(data.mainData));
  const [solidAlt, setSolidAlt] = useState(Array.from(data.mainData));
  const [dismissableWithSolid, setDismissableWithSolid] = useState(
    Array.from(data.mainData)
  );
  const [withLink, setWithLink] = useState(Array.from(data.mainData));
  const [withLinkAndSolidColor, setWithLinkAndSolidColor] = useState(
    Array.from(data.mainData)
  );
  const [inlineNotifications] = useState(
    Array.from(data.mainData)
  );
  const [iconLeft, setIconLeft] = useState(Array.from(data.mainData));
  const [outline, setOutline] = useState(Array.from(data.mainData));
  const [messageAlert, setMessageAlert] = useState(Array.from(data.mainData));
  const [messageAlertWithSolidColor, setMessageAlertWithSolidColor] = useState(
    Array.from(data.mainData)
  );

  const onClick = (index, setData, variables) =>
    setData(variables.filter((data, i) => i !== index && data));

  const btn = (i, dataset, data, height) => (
    <Button
      variant=""
      className={`btn-close ${height ? "" : ""}`}
      ata-dismiss="alert"
      aria-label="btn-close"
      onClick={() => onClick(i, dataset, data)}
    >
     
    </Button>
  );

  const alertDefferentMsg = () =>
    data.variant === "info"
      ? "Hey! Take a quick look."
      : data.variant === "dark" ||
        data.variant === "light" ||
        data.variant === "danger"
      ? "Error! Something Went wrong"
      : data.variant === "warning"
      ? "Warning! Why you did it to me!"
      : "WOW! Eveything looks OK.";

  return (
    <Fragment>
      <PageTitle motherMenu="Bootstrap" activeMenu="Alert" />
      <Row>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Basic Alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {basicData.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible fade show"
                >
                  {data.emoji}
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setBasicData, basicData, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Solid color alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
                add <code>.solid</code> class to change the solid color.
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {solidColor.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="solid alert-dismissible fade show"
                >
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setSolidColor, solidColor, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Square alerts</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-square</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              {square.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="solid alert-square"
                >
                  <strong>{data.msg}</strong> {data.text}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Rounded alerts</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-rounded</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              {rounded.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="solid alert-rounded"
                >
                  <strong>{data.msg}</strong> {data.text}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dismissable Alerts</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              {dismissable.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible fade show"
                >
                  {data.emoji}
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setDismissable, dismissable, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alerts alt</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-alt</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              {alt.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible alert-alt fade show"
                >
                  {data.emoji}
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setAlt, alt, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Solid Alt</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-alt.solid</code> class to change the solid
                color.
              </p>
            </Card.Header>
            <Card.Body>
              {solidAlt.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible solid alert-alt fade show"
                >
                  {data.emoji}
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setSolidAlt, solidAlt, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Dismissable with solid</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              {dismissableWithSolid.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible solid  fade show"
                >
                  {data.emoji}
                  <strong>{data.msg}</strong> {data.text}
                  {btn(i, setDismissableWithSolid, dismissableWithSolid, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert with Link</Card.Title>
              <p className="mb-0 subtitle">Bootstrap default style</p>
            </Card.Header>
            <Card.Body>
              {withLink.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible  fade show"
                >
                  <strong>{alertDefferentMsg(data)}</strong>{" "}
                  <Link to={"#"}>
                    {" "}
                    {data.variant === "info"
                      ? "My birthday party"
                      : data.variant === "dark" ||
                        data.variant === "light" ||
                        data.variant === "danger"
                      ? "Click here for details."
                      : data.variant === "warning"
                      ? "Check this out"
                      : "Please check this one as well"}{" "}
                  </Link>
                  {btn(i, setWithLink, withLink, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert with Link and solid color</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> class to change the solid color.
              </p>
            </Card.Header>
            <Card.Body>
              {withLinkAndSolidColor.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible solid fade show"
                >
                  <strong>{alertDefferentMsg(data)}</strong>{" "}
                  <Badge
                    variant={data.variant}
                    as="a"
                    href="#"
                    className="badge-sm light ms-1"
                  >
                    upgrade
                  </Badge>
                  {btn(
                    i,
                    setWithLinkAndSolidColor,
                    withLinkAndSolidColor,
                    true
                  )}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={12}>
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Inline Notifications</Card.Title>
              <p className="mb-0 subtitle">Default inline notification</p>
            </Card.Header>
            <Card.Body>
              <Row>
                {inlineNotifications.map((data, i) => (
                  <Col xl={6} key={i}>
                    <Alert
                      variant={data.variant}
                      className="alert alert-primary notification"
                    >
                      <p className="notificaiton-title mb-2">
                        <strong>Success!</strong> Vampires The Romantic Ideology
                        Behind Them
                      </p>
                      <p>
                        The following article covers a topic that has recently
                        moved to center stage-at lease it seems that way.
                      </p>
                      <Button variant={data.variant} size="sm">
                        Confirm
                      </Button>
                      <Button variant="link" size="sm">
                        Cancel
                      </Button>
                    </Alert>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert Icon Left</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-right-icon</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              {iconLeft.map((data, i) => (
                <Alert
                  key={i}
                  variant={data.variant}
                  className="alert-dismissible fade show solid alert-right-icon"
                >
                  <span>
                    <i className={data.icon}></i>
                  </span>
                  {data.msg} {data.text}
                  {btn(i, setIconLeft, iconLeft, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert outline</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.alert-outline-primary,secondary,success...</code> to
                change the style
              </p>
            </Card.Header>
            <Card.Body>
              {outline.map((data, i) => (
                <Alert
                  key={i}
                  variant={`outline-${data.variant}`}
                  className=" alert-dismissible fade show"
                >
                  {data.msg} {data.text}
                  {btn(i, setOutline, outline, true)}
                </Alert>
              ))}
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert Social</Card.Title>
              <p className="mb-0 subtitle">
                add{" "}
                <code>
                  .alert-social .facebook,.twitter,.linkedin,.google-plus
                </code>{" "}
                to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
                {socialMedia.map((social, i) => (
                  <Col xl={6} key={i}>
                    <Alert
                      variant="social"
                      className={`alert-dismissible ${social.name
                        .split(" ")
                        .join("-")
                        .toLocaleLowerCase()}`}
                    >
                      {btn(i, setSocialMedia, socialMedia, false)}
                      <Media>
                        <div className="alert-social-icon">
                          <span>
                            <i className={social.icon} />
                          </span>
                        </div>
                        <Media.Body>
                          <h5 className="mt-1 mb-2 text-white">
                            {social.name}
                          </h5>
                          <p className="mb-0">
                            Cras sit amet nibh libero, in gravida nulla. tempus
                            viverra turpis. Fusce condimentum nunc ac nisi
                            vulputate fringilla. Donec lacinia congue felis in
                            faucibus.
                          </p>
                        </Media.Body>
                      </Media>
                    </Alert>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Message Alert</Card.Title>
              <Card.Text className="subtitle mb-0">
                Bootstrap default style
              </Card.Text>
            </Card.Header>
            <Card.Body>
              <Row>
                {messageAlert.map((data, i) => (
                  <Col xl={6} key={i}>
                    <Alert variant={data.variant} className="alert-dismissible">
                      {btn(i, setMessageAlert, messageAlert, false)}
                      <Media>
                        <Media.Body>
                          <h5 className="mt-1 mb-1">Notifications</h5>
                          <p className="mb-0">
                            Cras sit amet nibh libero, in gravida nulla. tempus
                            viverra turpis. Fusce condimentum nunc ac nisi
                            vulputate fringilla. Donec lacinia congue felis in
                            faucibus.
                          </p>
                        </Media.Body>
                      </Media>
                    </Alert>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Message Alert with Solid color</Card.Title>
              <p className="mb-0 subtitle">
                add <code>.solid</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
                {messageAlertWithSolidColor.map((data, i) => (
                  <Col xl={6} key={i}>
                    <Alert
                      variant={data.variant}
                      className="alert-dismissible solid"
                    >
                      {btn(
                        i,
                        setMessageAlertWithSolidColor,
                        messageAlertWithSolidColor,
                        false
                      )}
                      <Media>
                        <Media.Body>
                          <h5 className="mt-1 mb-2 text-white">
                            Notifications
                          </h5>
                          <p className="mb-0">
                            Cras sit amet nibh libero, in gravida nulla. tempus
                            viverra turpis. Fusce condimentum nunc ac nisi
                            vulputate fringilla. Donec lacinia congue felis in
                            faucibus.
                          </p>
                        </Media.Body>
                      </Media>
                    </Alert>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} className="col-xl-12 col-xxl-12">
          <Card>
            <Card.Header className="d-block">
              <Card.Title>Alert left icon big </Card.Title>
              <p className="mb-0 subtitle">
                add <code>.left-icon-big</code> to change the style
              </p>
            </Card.Header>
            <Card.Body>
              <Row>
                {leftIconBig.map((data, i) => (
                  <Col xl={6} key={i}>
                    <Alert
                      variant={data.variant}
                      className="alert-dismissible left-icon-big"
                    >
                      {btn(i, setLeftIconBig, leftIconBig, false)}
                      <Media>
                        <div variant="" className="alert-left-icon-big">
                          <span>
                            <i className={`mdi mdi-${data.icon}`}></i>
                          </span>
                        </div>
                        <Media.Body>
                          <h6 className="mt-1 mb-2">{data.text}</h6>
                          <p className="mb-0">{data.msg}</p>
                        </Media.Body>
                      </Media>
                    </Alert>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default UiAlert;
