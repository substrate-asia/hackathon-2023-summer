import React from 'react'
import { Fragment } from 'react'

/// Page Title
import PageTitle from '../../layouts/PageTitle'

/// Images
import img1 from '../../../images/big/img1.jpg'
import img2 from '../../../images/big/img2.jpg'
import img3 from '../../../images/big/img3.jpg'
import img4 from '../../../images/big/img4.jpg'
import img5 from '../../../images/big/img5.jpg'
import img6 from '../../../images/big/img6.jpg'
import img7 from '../../../images/big/img7.jpg'

/// Bootstrap
import { Row, Col, Card, Carousel } from 'react-bootstrap'

/// carousel data
const carousel1 = [img1, img2, img3]
const carousel2 = [
  { img: img2, text: 'Frist' },
  { img: img3, text: 'Second' },
  { img: img4, text: 'Third' },
]
const carousel3 = [img3, img4, img5]
//const carousel4 = [img4, img5, img6]
const carousel5 = [
  { img: img5, text: 'Frist' },
  { img: img6, text: 'Second' },
  { img: img7, text: 'Third' },
]

const UiCarousel = () => {
  return (
    <Fragment>
      <PageTitle motherMenu='Bootstrap' activeMenu='Carousel' />
      <Row>
        <Col xl={6}>
          <Card>
            <Card.Body className='p-4'>
              <h4 className='card-intro-title'>Slides only</h4>
              <Carousel>
                {carousel1.map((carousel, i) => (
                  <Carousel.Item key={i}>
                    <img
                      src={carousel}
                      className='d-block w-100'
                      alt={`Slide ${i + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Body className='p-4'>
              <h4 className='card-intro-title'>With Captions</h4>
              <Carousel controls={false} indicators={false}>
                {carousel2.map((carousel, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className='d-block w-100'
                      src={carousel.img}
                      alt={`${carousel.text} slide`}
                    />
                    <Carousel.Caption className=' d-none d-md-block'>
                      <h5>{carousel.text} slide label</h5>
                      <p>
                        Nulla vitae elit libero, a pharetra augue mollis
                        interdum.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Body className='p-4'>
              <h4 className='card-intro-title'>Slides only</h4>
              <Carousel controls={false} indicators={false}>
                {carousel3.map((carousel, i) => (
                  <Carousel.Item key={i}>
                    <img
                      src={carousel}
                      className='d-block w-100'
                      alt={`Slide ${i + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Body className='p-4'>
              <h4 className='card-intro-title mb-4'>Slides With indicators</h4>
              <Carousel>
                {carousel1.map((carousel, i) => (
                  <Carousel.Item key={i}>
                    <img
                      src={carousel}
                      className='d-block w-100'
                      alt={`Slide ${i + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6}>
          <Card>
            <Card.Body className='p-4'>
              <h4 className='card-intro-title mb-4'>Slides With captions</h4>
              <Carousel>
                {carousel5.map((carousel, i) => (
                  <Carousel.Item key={i}>
                    <img
                      className='d-block w-100'
                      src={carousel.img}
                      alt={`${carousel.text} slide`}
                    />
                    <Carousel.Caption className=' d-none d-md-block'>
                      <h5>{carousel.text} slide label</h5>
                      <p>
                        Nulla vitae elit libero, a pharetra augue mollis
                        interdum.
                      </p>
                    </Carousel.Caption>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default UiCarousel
