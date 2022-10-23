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
