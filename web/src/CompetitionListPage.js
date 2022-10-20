// Copyright 2022 The casbin Authors. All Rights Reserved.
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
import {Card, Col, Row} from "antd";
import * as Setting from "./Setting";
import CompetitionCard from "./CompetitionCard";
import * as ConferenceBackend from "./backend/ConferenceBackend";

class CompetitionListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      competitions: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getCompetitions();
  }

  getCompetitions() {
    ConferenceBackend.getConferences("admin")
      .then((res) => {
        this.setState({
          competitions: res,
        });
      });
  }

  renderCard(index, competition, isSingle) {
    return (
      <CompetitionCard key={index} competition={competition} />
    );
  }

  renderCards() {
    const competitions = this.state.competitions;
    if (competitions === null) {
      return null;
    }

    const isSingle = competitions.length === 1;

    if (Setting.isMobile()) {
      return (
        <Card bodyStyle={{padding: 0}}>
          {
            competitions.map((competition, i) => {
              return this.renderCard(i, competition, isSingle);
            })
          }
        </Card>
      );
    } else {
      return (
        <div style={{marginRight: "15px", marginLeft: "15px"}}>
          <Row style={{marginLeft: "-20px", marginRight: "-20px", marginTop: "20px"}} gutter={24}>
            {
              competitions.map((competition, i) => {
                return this.renderCard(i, competition, isSingle);
              })
            }
          </Row>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderCards()
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompetitionListPage;
