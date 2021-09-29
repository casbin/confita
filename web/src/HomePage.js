import React from "react";
import {Carousel, Col, Row} from "antd";
import Conference from "./Conference";
import * as ConferenceBackend from "./backend/ConferenceBackend";

const owner = "admin";
const conferenceName = "conference_0";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conferenceName: conferenceName,
      conference: null,
    };
  }

  componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(owner, this.state.conferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  renderCarousel(conference) {
    const contentStyle = {
      height: '250px',
      color: '#fff',
      lineHeight: '160px',
      textAlign: 'center',
      background: '#364d79',
    };

    return (
      <Carousel autoplay>
        {
          conference.carousels.map((carousel, i) => {
            return (
              <div>
                <h3 style={contentStyle}>
                  <img alt={`carousel-${i}`} style={{width: '100%', height: '100%'}} src={carousel}/>
                </h3>
              </div>
            )
          })
        }
      </Carousel>
    )
  }

  renderHome() {
    if (this.state.conference === null) {
      return null;
    }

    return (
      <div>
        {
          this.renderCarousel(this.state.conference)
        }
        <Conference conference={this.state.conference} />
      </div>
    )
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={3}>
          </Col>
          <Col span={18}>
            {
              this.renderHome()
            }
          </Col>
          <Col span={3}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
