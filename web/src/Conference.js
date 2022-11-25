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
import {Alert, Button, Col, Empty, Menu, Popover, Row, Space, Steps} from "antd";
import * as Setting from "./Setting";
import i18next from "i18next";
import {Link} from "react-router-dom";

const {SubMenu} = Menu;
const {Step} = Steps;
class Conference extends React.Component {
  constructor(props) {
    super(props);
    // noinspection JSAnnotator
    this.state = {
      classes: props,
      defaultItem: "",
      selectedKey: this.props.conference.defaultItem,
      topselectedKey: this.props.conference.defaulttopItem,
      conference: {},
    };
  }
  UNSAFE_componentWillMount() {
    const url = window.location.href;
    const thiskeys = url.split("/");
    if (thiskeys.length !== 3 && thiskeys[thiskeys.length - 1] === "conference") {
      window.location.replace(window.location + "/" + this.state.conference.name);
      this.props.history.push(this.state.conference.name);
    }

  }

  handleUrl() {
    const url = this.props.location.pathname;
    const thiskeys = url.split("/");
    const thiskey = thiskeys[thiskeys.length - 1];
    return thiskey;
  }

  handleClick = info => {
    this.setState({
      selectedKey: info,
    });
  };

  handletopClick = info => {
    this.setState({
      topselectedKey: info,
    });
  };

  renderMenu(treeItems) {
    let mode;
    if (!Setting.isMobile()) {
      mode = "vertical";
    } else {
      mode = "horizontal";
    }

    const theme = "light";
    // const theme = "dark";

    return (
      <Menu
        // style={{ width: 256 }}
        defaultSelectedKeys={[this.state.defaultItem]}
        defaultOpenKeys={["sub1"]}
        mode={mode}
        theme={theme}
        className={"conferenceMenu"}
        style={{backgroundColor: "white"}}
        onClick={this.handleClick}
      >
        {
          treeItems.map((treeItem, i) => {
            // if (i === 0) {
            //   return null;
            // }
            if (treeItem.children.length === 0) {
              return (
                <Menu.Item key={treeItem.title}>
                  <Link to={"/conference" + "/" + this.state.conference.name + treeItem.path}></Link>
                  {this.props.language !== "en" ? treeItem.title : treeItem.titleEn}
                </Menu.Item>
              );
            } else {
              return (
                <SubMenu key={treeItem.title} title={this.props.language !== "en" ? treeItem.title : treeItem.titleEn}>
                  {
                    treeItem.children.map((treeItem2, i) => {
                      return (
                        <Menu.Item key={treeItem2.title}>
                          {this.props.language !== "en" ? treeItem2.title : treeItem2.titleEn}
                        </Menu.Item>
                      );
                    })
                  }
                </SubMenu>
              );
            }
          })
        }
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Introduction*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Committees*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Hosting Organizations*/}
        {/* </Menu.Item>*/}
        {/* <Menu.Item key="2" icon={<CalendarOutlined />}>*/}
        {/*  Navigation Two*/}
        {/* </Menu.Item>*/}
        {/* <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">*/}
        {/*  <Menu.Item key="3">Option 3</Menu.Item>*/}
        {/*  <Menu.Item key="4">Option 4</Menu.Item>*/}
        {/*  <SubMenu key="sub1-2" title="Submenu">*/}
        {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
        {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
        {/*  </SubMenu>*/}
        {/* </SubMenu>*/}
        {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">*/}
        {/*  <Menu.Item key="7">Option 7</Menu.Item>*/}
        {/*  <Menu.Item key="8">Option 8</Menu.Item>*/}
        {/*  <Menu.Item key="9">Option 9</Menu.Item>*/}
        {/*  <Menu.Item key="10">Option 10</Menu.Item>*/}
        {/* </SubMenu>*/}
        {/* <Menu.Item key="link" icon={<LinkOutlined />}>*/}
        {/*  <a href="https://ant.design" target="_blank" rel="noopener noreferrer">*/}
        {/*    Ant Design*/}
        {/*  </a>*/}
        {/* </Menu.Item>*/}
      </Menu>
    );
  }

  getSelectedTreeItem(treeItems) {
    if (this.handleUrl() === this.state.conference.name) {
      return treeItems;
    }
    const res = treeItems?.map(treeItem => {
      if (treeItem.key === this.handleUrl()) {
        return treeItem;
      } else {
        return null;
      }
    }).filter(treeItem => treeItem !== null);
    // if (treeItems.length > 0) {
    return res;

    // } else {
    //   return null;
    // }
  }

  renderPage(treeItem) {
    if (treeItem === undefined || treeItem === null) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      );
    }
    return (
      <div>
        {/* <div style={{textAlign: "center", fontSize: "x-large"}}>*/}
        {/*  {*/}
        {/*    treeItem.title*/}
        {/*  }*/}
        {/* </div>*/}
        <div style={{marginTop: "40px"}} dangerouslySetInnerHTML={{__html: this.props.language !== "en" ? treeItem.content : treeItem.contentEn}} />
      </div>
    );
  }

  renderCompetition(conference) {
    if (conference.type !== "Competition") {
      return null;
    }
    return (
      <div style={{marginTop: "20px"}}>
        <Alert
          banner
          showIcon={false}
          style={{backgroundImage: "url(https://storage.googleapis.com/kaggle-competitions/kaggle/15696/logos/header.png?t=2019-10-04-16-16-53)", backgroundRepeat: "no-repeat", backgroundSize: "100% 100%"}}
          message={
            <h2 style={{color: "white", fontWeight: "700"}}>
              <span style={{marginRight: "10px"}}>
                {conference.displayName}
              </span>
              {
                Setting.getTag(conference.displayState)
              }
            </h2>}
          description={<div style={{color: "white"}}>
            <h3 style={{color: "white"}}>
              {conference.introduction}
            </h3>
            <div>
              {i18next.t("conference:Organizer")}: {conference.organizer}
            </div>
            <br />
            {i18next.t("conference:Person count")} <span style={{marginLeft: "10px", fontSize: 20, color: "rgb(255,77,79)"}}>{conference.personCount}</span>
            <span style={{float: "right", color: "white", fontWeight: "700"}}>
              {
                Setting.getTags(conference.tags)
              }
            </span>
            <br />
          </div>}
          type="info"
          action={
            <Space direction="vertical" style={{textAlign: "center"}}>
              &nbsp;
              <div style={{fontSize: 30, color: "rgb(255,77,79)"}}>
                 ￥{`${conference.bonus}`.replace("000", ",000")}
              </div>
            </Space>
          }
        />
      </div>
    );
  }
  rendertopmenu(conferencetree) {
    const mode = "horizontal";

    const theme = "light";
    return (
      <div style={{marginBottom: "20px", position: "sticky", top: "0"}}>
        <Menu
        // style={{ width: 256 }}
          defaultselectedkeys={[this.state.topselectedKey]}
          defaultOpenKeys={["sub1"]}
          mode={mode}
          theme={theme}
          className={"conferencetopMenu"}
          style={{border: "1px solid rgb(240,240,240)", backgroundColor: "white", position: "sticky", top: "0", zIndex: "auto"}}
          onClick={this.handletopClick}
        >
          {
            conferencetree.map((treeItem, i) => {
            // if (i === 0) {
            //   return null;
            // }

              if (treeItem.children.length === 0) {
                return (
                  <Menu.Item key={treeItem.title}>
                    {this.props.language !== "en" ? treeItem.title : treeItem.titleEn}
                  </Menu.Item>
                );
              } else {
                return (
                  <SubMenu key={treeItem.title} title={this.props.language !== "en" ? treeItem.title : treeItem.titleEn}>
                    {
                      treeItem.children.map((treeItem2, i) => {
                        return (
                          <Menu.Item key={treeItem2.title}>
                            {this.props.language !== "en" ? treeItem2.title : treeItem2.titleEn}
                          </Menu.Item>
                        );
                      })
                    }
                  </SubMenu>
                );
              }
            })
          }
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Introduction*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Committees*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="1" icon={<MailOutlined />}>*/}
          {/*  Hosting Organizations*/}
          {/* </Menu.Item>*/}
          {/* <Menu.Item key="2" icon={<CalendarOutlined />}>*/}
          {/*  Navigation Two*/}
          {/* </Menu.Item>*/}
          {/* <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">*/}
          {/*  <Menu.Item key="3">Option 3</Menu.Item>*/}
          {/*  <Menu.Item key="4">Option 4</Menu.Item>*/}
          {/*  <SubMenu key="sub1-2" title="Submenu">*/}
          {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
          {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
          {/*  </SubMenu>*/}
          {/* </SubMenu>*/}
          {/* <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">*/}
          {/*  <Menu.Item key="7">Option 7</Menu.Item>*/}
          {/*  <Menu.Item key="8">Option 8</Menu.Item>*/}
          {/*  <Menu.Item key="9">Option 9</Menu.Item>*/}
          {/*  <Menu.Item key="10">Option 10</Menu.Item>*/}
          {/* </SubMenu>*/}
          {/* <Menu.Item key="link" icon={<LinkOutlined />}>*/}
          {/*  <a href="https://ant.design" target="_blank" rel="noopener noreferrer">*/}
          {/*    Ant Design*/}
          {/*  </a>*/}
          {/* </Menu.Item>*/}
        </Menu>
      </div>
    );
  }
  rendersteps(conference) {
    return (
      <Steps style={{marginTop: "30px"}} current={1} progressDot={(dot, {status, index}) => {
        return (
          <Popover
            content={
              <span>
                    step {index} status: {status}
              </span>
            }>
            {dot}
          </Popover>
        );
      }}>
        {
          this.state.conference.steps.map((step, i) => {
            return (
              <Step key={step.title} description={step.date}></Step>
            );
          })
        }
        {/* <Step title="报名" description="04/06-05/11" />*/}
        {/* <Step title="初赛" description="06/01-07/31" />*/}
        {/* <Step title="复赛" description="08/01-09/30" />*/}
        {/* <Step title="决赛" description="09/30" />*/}
      </Steps>
    );
  }
  renderTitle(title) {
    return (
      <div style={{color: "#00000066", backgroundColor: "#FBFBFB", border: "1px solid #dedfe0", borderRadius: "4px solid #dedfe0", borderBottom: "none", padding: "12px 16px"}}>
        {title}
      </div>
    );
  }
  render() {
    const conference = this.state.conference;
    if (!Setting.isMobile()) {
      return (
        <div style={{marginLeft: "10%", marginRight: "10%"}}>
          <Row>
            <Col span={24} >
              {
                this.renderCompetition(conference)
              }
            </Col>
          </Row>
          <Row style={{position: "sticky", top: "0", zIndex: "1"}}>
            <Col span={24} >
              {
                this.rendertopmenu(conference.topItems)
              }
            </Col>
          </Row>
          <Row style={{zIndex: "1"}}>
            <Col span={24} >
              {
                this.renderTitle(this.state.topselectedKey.key)
              }
            </Col>
          </Row>
          <Row style={{border: "1px solid #dedfe0"}}>
            <Col span={4} style={{borderRight: "1px solid #dedfe0"}}>
              {
                this.renderMenu(conference.treeItems)
              }
            </Col>
            <Col span={1} >
            </Col>
            <Col span={19} >
              {
                this.renderPage(this.getSelectedTreeItem(this.state.conference.treeItems)[0])
              }
            </Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            <Col span={20}>
              {this.rendersteps(conference.treeItems[0])}
            </Col>
            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={12}>
              <Button style={{marginLeft: "45%", marginBottom: "20px", marginTop: "20px"}} shape={""} type="primary" onClick={() => this.props.history.push("/submissions")}>
                {i18next.t("conference:Apple Now")}
              </Button>
            </Col>
            <Col span={12}>
              <Button style={{marginLeft: "45%", marginBottom: "20px", marginTop: "20px"}} shape={""} type="primary" danger onClick={() => Setting.openLinkSafe(conference.resultUrl)}>
                {i18next.t("conference:View Result")}
              </Button>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row>
            <Row>
              <Col span={24} >
                {
                  this.renderCompetition(conference)
                }
              </Col>
            </Row>
            <Col span={24} >
              {
                this.renderMenu(conference.treeItems)
              }
            </Col>
          </Row>
          <Row>
            <Col span={1} />
            <Col span={22} >
              {
                this.renderPage(this.getSelectedTreeItem(conference.treeItems[0]))
              }
            </Col>
            <Col span={1} />
          </Row>
        </div>
      );
    }
  }
}

export default Conference ;
