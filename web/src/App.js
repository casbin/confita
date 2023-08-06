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

import React, {Component} from "react";
import {Link, Redirect, Route, Switch, withRouter} from "react-router-dom";
import {Avatar, BackTop, Col, Dropdown, Layout, List, Menu, Modal, Popover, Row} from "antd";
import {CloseCircleTwoTone, DownOutlined, LogoutOutlined, SettingOutlined} from "@ant-design/icons";
import "./App.less";
import * as Setting from "./Setting";
import * as AccountBackend from "./backend/AccountBackend";
import AuthCallback from "./AuthCallback";
import * as Conf from "./Conf";
import HomePage from "./HomePage";
import PaymentPage from "./PaymentPage";
import ContactPage from "./ContactPage";
import ConferenceListPage from "./ConferenceListPage";
import ConferenceEditPage from "./ConferenceEditPage";
import SubmissionListPage from "./SubmissionListPage";
import SubmissionEditPage from "./SubmissionEditPage";
import PaymentListPage from "./PaymentListPage";
import RoomListPage from "./RoomListPage";
import RoomEditPage from "./RoomEditPage";
import RoomPage from "./RoomPage";
import SigninPage from "./SigninPage";
import i18next from "i18next";
import SelectLanguageBox from "./SelectLanguageBox";
import CompetitionListPage from "./CompetitionListPage";
import CodeListPage from "./CodeListPage";
import CodeEditPage from "./CodeEditPage";
import {withTranslation} from "react-i18next";

const {Header, Footer} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      selectedMenuKey: 0,
      account: undefined,
      isDupSession: false,
      uri: null,
    };

    Setting.initServerUrl();
    Setting.initCasdoorSdk(Conf.AuthConfig);
  }

  UNSAFE_componentWillMount() {
    this.updateMenuKey();
    this.getAccount();
  }

  componentDidUpdate() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (this.state.uri !== uri) {
      this.updateMenuKey();
    }
  }

  updateMenuKey() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    this.setState({
      uri: uri,
    });
    if (uri === "/") {
      this.setState({selectedMenuKey: "/"});
    } else if (uri.includes("/payments")) {
      this.setState({selectedMenuKey: "/payments"});
    } else if (uri.includes("/contact")) {
      this.setState({selectedMenuKey: "/contact"});
    } else if (uri.includes("/competitions")) {
      this.setState({selectedMenuKey: "/competitions"});
    } else if (uri.includes("/conferences")) {
      this.setState({selectedMenuKey: "/conferences"});
    } else if (uri.includes("/code")) {
      this.setState({selectedMenuKey: "/code"});
    } else if (uri.includes("/submissions")) {
      this.setState({selectedMenuKey: "/submissions"});
    } else if (uri.includes("/all-pays")) {
      this.setState({selectedMenuKey: "/all-pays"});
    } else if (uri.includes("/rooms")) {
      this.setState({selectedMenuKey: "/rooms"});
    } else if (uri.includes("/public-rooms")) {
      this.setState({selectedMenuKey: "/public-rooms"});
    } else {
      this.setState({selectedMenuKey: "/"});
    }
  }

  onUpdateAccount(account) {
    this.setState({
      account: account,
    });
  }

  setLanguage(account) {
    // let language = account?.language;
    const language = localStorage.getItem("language");
    if (language !== "" && language !== i18next.language) {
      Setting.setLanguage(language);
    }
  }

  getAccount() {
    AccountBackend.getAccount()
      .then((res) => {
        if (res.status === "error" && res.msg === "you have signed in from another place, this session has been ended") {
          this.setState({
            isDupSession: true,
          });
          return;
        }

        const account = res.data;
        if (account !== null) {
          this.setLanguage(account);
        }

        this.setState({
          account: account,
        });
      });
  }

  signout() {
    AccountBackend.signout()
      .then((res) => {
        if (res.status === "ok") {
          this.setState({
            account: null,
          });

          Setting.showMessage("success", "Successfully signed out, redirected to homepage");
          Setting.goToLink("/");
          // this.props.history.push("/");
        } else {
          Setting.showMessage("error", `Signout failed: ${res.msg}`);
        }
      });
  }

  handleRightDropdownClick(e) {
    if (e.key === "/account") {
      Setting.openLink(Setting.getMyProfileUrl(this.state.account));
    } else if (e.key === "/logout") {
      this.signout();
    }
  }

  renderAvatar() {
    if (this.state.account.avatar === "") {
      return (
        <Avatar style={{backgroundColor: Setting.getAvatarColor(this.state.account.name), verticalAlign: "middle"}} size="large">
          {Setting.getShortName(this.state.account.name)}
        </Avatar>
      );
    } else {
      return (
        <Avatar src={this.state.account.avatar} style={{verticalAlign: "middle"}} size="large">
          {Setting.getShortName(this.state.account.name)}
        </Avatar>
      );
    }
  }

  renderRightDropdown() {
    const menu = (
      <Menu onClick={this.handleRightDropdownClick.bind(this)}>
        <Menu.Item key="/account">
          <SettingOutlined />
          {i18next.t("account:My Account")}
        </Menu.Item>
        <Menu.Item key="/logout">
          <LogoutOutlined />
          {i18next.t("account:Sign Out")}
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu}>
        <div className="top-right-button">
          &nbsp;
          &nbsp;
          {
            this.renderAvatar()
          }
          &nbsp;
          &nbsp;
          {Setting.isMobile() ? null : Setting.getShortName(this.state.account.displayName)} &nbsp; <DownOutlined />
          &nbsp;
          &nbsp;
          &nbsp;
        </div>
      </Dropdown>
    );
  }

  renderAccount() {
    const res = [];

    if (this.state.account === undefined) {
      return null;
    } else if (this.state.account === null) {
      res.push(
        <div key="/signin">
          <a href={Setting.getSigninUrl()} className="signin-button">
            {i18next.t("account:Sign In")}
          </a>
        </div>
      );
      res.push(
        <div key="/signup" style={{marginRight: "1rem"}}>
          <a href={Setting.getSignupUrl()} className="signup-button">
            {i18next.t("account:Sign Up")}
          </a>
        </div>
      );
    } else {
      res.push(this.renderRightDropdown());
    }

    return res;
  }

  renderMenu() {
    const res = [];

    res.push(
      <Menu.Item key="/">
        <Link to="/">
          {i18next.t("general:Home")}
        </Link>
      </Menu.Item>
    );

    if (this.state.account === null || this.state.account === undefined) {
      if (!Conf.IsConferenceMode) {
        res.push(
          <Menu.Item key="/competitions">
            <Link to="/competitions">
              {i18next.t("general:Competitions")}
            </Link>
          </Menu.Item>
        );
      }

      res.push(
        <Menu.Item key="/public-rooms">
          <Link to="/public-rooms">
            {i18next.t("general:Public Rooms")}
          </Link>
        </Menu.Item>
      );

      return res;
    }

    res.push(
      <Menu.Item key="/payments">
        <Link to="/payments">
          {i18next.t("general:Payments")}
        </Link>
      </Menu.Item>
    );

    if (!Conf.IsConferenceMode) {
      res.push(
        <Menu.Item key="/competitions">
          <Link to="/competitions">
            {i18next.t("general:Competitions")}
          </Link>
        </Menu.Item>
      );
    }

    if (Setting.isAdminUser(this.state.account)) {
      res.push(
        <Menu.Item key="/conferences">
          <Link to="/conferences">
            {i18next.t("general:Conferences")}
          </Link>
        </Menu.Item>
      );

      if (!Conf.IsConferenceMode) {
        res.push(
          <Menu.Item key="/code">
            <Link to="/code">
              {i18next.t("general:Code")}
            </Link>
          </Menu.Item>
        );
      }
    }

    res.push(
      <Menu.Item key="/submissions">
        <Link to="/submissions">
          {i18next.t("general:Submissions")}
        </Link>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="/videos">
        <a target="_blank" rel="noreferrer" href={Setting.getMyProfileUrl(this.state.account).replace("/account", "/resources")}>
          {i18next.t("general:Videos")}
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="/contact">
        <Link to="/contact">
          {i18next.t("general:Service Desk")}
        </Link>
      </Menu.Item>
    );

    if (Setting.isAdminUser(this.state.account) || Setting.isEditorUser(this.state.account)) {
      res.push(
        <Menu.Item key="/all-pays">
          <Link to="/all-pays">
            {i18next.t("general:All Payments")}
          </Link>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="/users">
          <a target="_blank" rel="noreferrer" href={Setting.getMyProfileUrl(this.state.account).replace("/account", "/users")}>
            {i18next.t("general:Users")}
          </a>
        </Menu.Item>
      );
    }

    res.push(
      <Menu.Item key="/rooms">
        <Link to="/rooms">
          {i18next.t("general:Rooms")}
        </Link>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="/public-rooms">
        <Link to="/public-rooms">
          {i18next.t("general:Public Rooms")}
        </Link>
      </Menu.Item>
    );

    return res;
  }

  renderDupSessionModal() {
    if (!this.state.isDupSession) {
      return null;
    }

    const handleOk = () => {
      this.signout();
    };

    return (
      <Modal
        title={
          <div>
            <CloseCircleTwoTone twoToneColor="rgb(255,77,79)" />
            {" " + i18next.t("general:You have signed in from another place...")}
          </div>
        }
        visible={true}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        onOk={handleOk}
        onCancel={() => {}}
        okText={i18next.t("general:Sign Out")}
        closable={false}
      >
        <div>
          {i18next.t("general:Only one session is allowed to access this page. You have signed in from another place, this session has been ended automatically. If you want to sign in with this device again, please click 'Sign Out', and sign in with this device, the other session will be kicked off.")}
        </div>
      </Modal>
    );
  }

  renderHomeIfSignedIn(component) {
    if (this.state.account !== null && this.state.account !== undefined) {
      return <Redirect to="/" />;
    } else {
      return component;
    }
  }

  renderSigninIfNotSignedIn(component) {
    if (this.state.account === null) {
      sessionStorage.setItem("from", window.location.pathname);
      return <Redirect to="/signin" />;
    } else if (this.state.account === undefined) {
      return null;
    } else {
      return component;
    }
  }

  renderContact() {
    if (Conf.ContactInfo.length === 0) {
      return null;
    }

    return (
      <Popover content={
        <div style={{width: "300px"}}>
          <List
            itemLayout="horizontal"
            dataSource={Conf.ContactInfo}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.logo} />}
                  title={<a target="_blank" rel="noreferrer" href={item.joinLink}>{item.title}</a>}
                  description={
                    <div>
                      <Row>
                        <Col span={10}>
                          {i18next.t("room:Meeting ID")}:
                        </Col>
                        <Col span={14}>
                          {item.meetingId}
                        </Col>
                      </Row>
                      <Row>
                        <Col span={10}>
                          {i18next.t("room:Passcode")}:
                        </Col>
                        <Col span={14}>
                          {item.passcode}
                        </Col>
                      </Row>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      } trigger="click">
        <div key="/support" style={{marginRight: "1rem"}}>

          <a href={Setting.getSignupUrl()} className="signup-button">
            {i18next.t("room:Support")}
          </a>
        </div>
      </Popover>
    );
  }

  renderContent() {
    return (
      <div>
        <Header style={{padding: "0", marginBottom: "3px", display: "flex", flexWrap: "nowrap", backgroundColor: "white", borderBottom: "1px solid #f0f0f0"}}>
          {
            Setting.isMobile() ? null : (
              <Link to={"/"}>
                <div className="logo" />
              </Link>
            )
          }
          <Menu
            // theme="dark"
            mode={"horizontal"}
            selectedKeys={[`${this.state.selectedMenuKey}`]}
            style={{lineHeight: "64px", width: "70%", marginRight: "auto", border: "none"}}
          >
            {
              this.renderMenu()
            }
          </Menu>
          <div
            className="top-right-layout"
          >
            {
              this.renderContact()
            }
            <SelectLanguageBox />
            {
              this.renderAccount()
            }
          </div>
        </Header>
        <Switch>
          <Route exact path="/callback" component={AuthCallback} />
          <Route exact path="/" render={(props) => <HomePage account={this.state.account} {...props} />} />
          <Route exact path="/signin" render={(props) => this.renderHomeIfSignedIn(<SigninPage {...props} />)} />
          <Route exact path="/payments" render={(props) => this.renderSigninIfNotSignedIn(<PaymentPage account={this.state.account} {...props} />)} />
          <Route exact path="/contact" render={(props) => this.renderSigninIfNotSignedIn(<ContactPage account={this.state.account} {...props} />)} />
          <Route path="/competitions" render={(props) => <CompetitionListPage account={this.state.account} {...props} />} />
          <Route exact path="/conferences" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceListPage account={this.state.account} {...props} />)} />
          <Route exact path="/conferences/:conferenceName" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceEditPage account={this.state.account} {...props} />)} />
          <Route exact path="/code" render={(props) => <CodeListPage account={this.state.account} {...props} />} />
          <Route exact path="/code/:codeName" render={(props) => this.renderSigninIfNotSignedIn(<CodeEditPage account={this.state.account} {...props} />)} />
          <Route exact path="/submissions" render={(props) => this.renderSigninIfNotSignedIn(<SubmissionListPage account={this.state.account} {...props} />)} />
          <Route exact path="/submissions/:userName/:submissionName" render={(props) => this.renderSigninIfNotSignedIn(<SubmissionEditPage account={this.state.account} {...props} />)} />
          <Route exact path="/all-pays" render={(props) => this.renderSigninIfNotSignedIn(<PaymentListPage account={this.state.account} {...props} />)} />
          <Route exact path="/rooms" render={(props) => this.renderSigninIfNotSignedIn(<RoomListPage key={"rooms"} account={this.state.account} {...props} />)} />
          <Route exact path="/rooms/:userName/:roomName" render={(props) => this.renderSigninIfNotSignedIn(<RoomEditPage account={this.state.account} {...props} />)} />
          <Route exact path="/rooms/:userName/:roomName/view" render={(props) => <RoomPage account={this.state.account} {...props} />} />
          <Route exact path="/rooms/:userName/:roomName/:slotName/view" render={(props) => <RoomPage account={this.state.account} {...props} />} />
          <Route exact path="/public-rooms" render={(props) => <RoomListPage key={"public-rooms"} account={this.state.account} isPublic={true} {...props} />} />
          <Route exact path="/:menu+" render={(props) => <HomePage account={this.state.account} {...props} />} />
        </Switch>
      </div>
    );
  }

  renderFooter() {
    // How to keep your footer where it belongs ?
    // https://www.freecodecamp.org/news/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c/

    return (
      <Footer id="footer" style={
        {
          borderTop: "1px solid #e8e8e8",
          backgroundColor: "white",
          textAlign: "center",
        }
      }>
        {
          Setting.getLanguage() !== "en" ? (
            <React.Fragment>
              {Conf.title}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {Conf.titleEn}
            </React.Fragment>
          )
        }
      </Footer>
    );
  }

  render() {
    return (
      <div id="parent-area">
        <BackTop />
        <div id="content-wrap">
          {
            this.renderContent()
          }
        </div>
        {
          this.renderFooter()
        }
        {
          this.renderDupSessionModal()
        }
      </div>
    );
  }
}

export default withRouter(withTranslation()(App));
