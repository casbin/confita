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
import {Col, Menu, Pagination, Row} from "antd";
import * as Setting from "./Setting";
import CompetitionCard from "./CompetitionCard";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import "./CompetitionListPage.less";
import i18next from "i18next";
import {Link} from "react-router-dom";


class CompetitionListPage extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type {{ classes: any, competitions: null | { carousels: string[], displayName: string, introduction: string, organizer: string }[], pageSize: number, pageNum: number, topActivate: boolean}}
     */
    this.state = {
      classes: props,
      competitions: null,
      pageSize: 10,
      pageNum: 0,
      topActivate: false,
    };

    this.navigationRef = React.createRef();
  }

  UNSAFE_componentWillMount() {
    this.getCompetitions();
    this.listenScroll();
  }

  listenScroll() {
    window.addEventListener("scroll", () => this.setState({
      topActivate: this.navigationRef.current ? this.navigationRef.current?.getBoundingClientRect().top <= 0 : false,
    }));
  }

  getCompetitions() {
    ConferenceBackend.getConferences("admin")
      .then((res) => {
        this.setState({
          competitions: res,
        });
      });
  }

  renderCard(index, competition) {
    return (
      <CompetitionCard key={index} competition={competition} />
    );
  }

  /**
   * @param {{ link: string, label: string }} item 
   */
  renderNavigationButton(item) {

    const {link, label} = item;

    return <Link className={`navigation-button ${location.pathname.includes(link) ? "activate" : ""}`} key={link} to={`/competitions/${link}`}>
      {label}
    </Link>;
  }

  renderNavigationBar() {

    const items = [{
      link: "activate",
      label: "Active",
    }, {
      link: "algo",
      label: "算法大赛",
    }, {
      link: "innovantion",
      label: "创新应用大赛",
    }, {
      link: "prog",
      label: "程序设计大赛",
    }, {
      link: "learn",
      label: "学习赛",
    }, {
      link: "visual",
      label: "可视化大赛",
    }, {
      link: "ragnarok",
      label: "诸神大战",
    }];

    if (Setting.isMobile()) {
      return <Menu mode={"inline"}>{items.map(({link, label}) => <Menu.Item key={link}>{label}</Menu.Item>)}</Menu>;
    }

    return <div onClick={() => window.scrollTo({top: 0})} ref={this.navigationRef}><div className={`navigation-bar ${this.state.topActivate ? "top-activate" : ""}`}>{items.map(this.renderNavigationButton)}</div></div>;
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

    const idx = this.state.pageNum * this.state.pageSize;
    const visibles = competitions.slice(idx, idx + this.state.pageSize);
    return visibles.map((competition, i) => this.renderCard(i, competition));
  }

  /**
   * 
   * @param {number} page 
   * @param {number} pageSize 
   */
  onPaginationChange(page, pageSize) {
    this.setState({
      pageNum: page - 1,
      pageSize,
    });

  }

  render() {
    return (
      <div className="competition-list-page">
        {Setting.isMobile() ? null :
          <div className="top-banner">
            <p>Casbin 2022全球开源软件大赛</p>
            <p>Casbin 是一个强大的、高效的开源访问控制框架，其权限管理机制支持多种访问控制模型。</p>
          </div>}
        <Row>
          <Col span={24}>
            {
              this.renderNavigationBar()
            }
          </Col>
        </Row>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div className={Setting.isMobile() ? "competition-card-list-mobile" : "competition-card-list"}>
            {
              this.renderCards()
            }
          </div>
        </div>
        <Row style={{padding: "5rem"}}>
          <Col span={24} style={{display: "flex", justifyContent: "center"}}>
            <Pagination showQuickJumper current={this.state.pageNum + 1} total={this.state.competitions?.length} onChange={this.onPaginationChange.bind(this)} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CompetitionListPage;
