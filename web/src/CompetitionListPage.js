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
import "./CompetitionListPage.less";
import i18next from "i18next";

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
    // this.setState({title: "Casbin”2022全球开源软件大赛：赛道二“Casdoor单点登录系统"});
    // this.setState({brief: "近年来，开源软件的应用场景不断延伸。在传统软件行业，开源软件逐渐应用于操作系统、数据库、云计算、大数据、机器学习等多个流程。"});

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
            <div className="competition-list-item ant-card ant-card-bordered ant-card-hoverable">
              <div className="top ALGORITHEM">
                <a href="/competition/entrance/532029/introduction" target="_blank">
                  <div className="title">
                    Casbin”2022全球开源软件大赛：赛道二“Casdoor单点登录系统
                  </div>
                </a>
                <div className="brief">
                  近年来，开源软件的应用场景不断延伸。在传统软件行业，开源软件逐渐应用于操作系统、数据库、云计算、大数据、机器学习等多个流程。
                </div>
              </div>
              <div className="bottom">
                <div className="content">
                  <div className="list-row-item">
                    <div className="row-item-data">
                      算法大赛
                    </div>
                    <div className="row-item-title">
                      Casbin大赛组委会
                    </div>
                  </div>
                  <div className="list-row-item">
                    <div className="row-item-data">
                      ￥150000
                    </div>
                    <div className="row-item-title">
                        奖金
                    </div>
                  </div>
                </div>
                <div className="footer">
                  <div className="logo1">
                    <span>举办方</span>
                    <img src="https://cdn.casbin.org/img/casbin_logo_1024x256.png" alt="" className="photo">
                    </img>
                  </div>
                  <a href="#" target="_blank">
                    <button type="button" className="ant-btn ant-btn-primary btn1">
                      <span>{i18next.t("general:Competitions")}</span>
                    </button>
                  </a>
                </div>
              </div>
            </div>
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
