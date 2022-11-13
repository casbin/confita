// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Carousel, Col, Row} from "antd";
import Conference from "./Conference";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import * as Conf from "./Conf";

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conference: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(Conf.DefaultOwner, Conf.DefaultConferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  renderCarousel(conference) {
    const contentStyle = {
      // height: '150px',
      color: "#fff",
      lineHeight: "160px",
      textAlign: "center",
      background: "#364d79",
    };

    return (
      <Carousel autoplay>
        {
          conference.carousels.map((carousel, i) => {
            return (
              <div key={i}>
                <h3 style={contentStyle}>
                  <img alt={`carousel-${i}`} style={{width: "100%", height: conference.carouselHeight === "" ? "100%" : conference.carouselHeight}} src={carousel} />
                </h3>
              </div>
            );
          })
        }
      </Carousel>
    );
  }

  renderHome() {
    if (this.state.conference === null) {
      return null;
    }

    return (
      <div>
        <div style={{marginBottom: "-8px"}}>
          {
            this.renderCarousel(this.state.conference)
          }
        </div>
        <Conference conference={this.state.conference} language={Setting.getLanguage()} history={this.props.history} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
          <Col span={!Setting.isMobile() ? 18 : 24}>
            {
              this.renderHome()
            }
          </Col>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default HomePage;
