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

import React, {Component} from 'react';
import {Switch, Redirect, Route, withRouter, Link} from 'react-router-dom';
import {Avatar, BackTop, Dropdown, Layout, Menu} from 'antd';
import {DownOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import './App.less';
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
import RoomListPage from "./RoomListPage";
import RoomEditPage from "./RoomEditPage";
import SigninPage from "./SigninPage";
import i18next from "i18next";
import SelectLanguageBox from "./SelectLanguageBox";

const {Header, Footer} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      selectedMenuKey: 0,
      account: undefined,
      uri: null,
    };

    Setting.initServerUrl();
    Setting.initCasdoorSdk(Conf.AuthConfig);
  }

  componentWillMount() {
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
    if (uri === '/') {
      this.setState({selectedMenuKey: '/'});
    } else if (uri.includes('/payments')) {
      this.setState({ selectedMenuKey: '/payments' });
    } else if (uri.includes('/contact')) {
      this.setState({ selectedMenuKey: '/contact' });
    } else if (uri.includes('/conferences')) {
      this.setState({ selectedMenuKey: '/conferences' });
    } else if (uri.includes('/submissions')) {
      this.setState({ selectedMenuKey: '/submissions' });
    } else if (uri.includes('/rooms')) {
      this.setState({ selectedMenuKey: '/rooms' });
    } else {
      this.setState({selectedMenuKey: 'null'});
    }
  }

  onUpdateAccount(account) {
    this.setState({
      account: account
    });
  }

  setLanguage(account) {
    // let language = account?.language;
    let language = localStorage.getItem("language");
    if (language !== "" && language !== i18next.language) {
      Setting.setLanguage(language);
    }
  }

  getAccount() {
    AccountBackend.getAccount()
      .then((res) => {
        let account = res.data;
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
        if (res.status === 'ok') {
          this.setState({
            account: null
          });

          Setting.showMessage("success", `Successfully signed out, redirected to homepage`);
          Setting.goToLink("/");
          // this.props.history.push("/");
        } else {
          Setting.showMessage("error", `Signout failed: ${res.msg}`);
        }
      });
  }

  handleRightDropdownClick(e) {
    if (e.key === '/account') {
      Setting.openLink(Setting.getMyProfileUrl(this.state.account));
    } else if (e.key === '/logout') {
      this.signout();
    }
  }

  renderAvatar() {
    if (this.state.account.avatar === "") {
      return (
        <Avatar style={{ backgroundColor: Setting.getAvatarColor(this.state.account.name), verticalAlign: 'middle' }} size="large">
          {Setting.getShortName(this.state.account.name)}
        </Avatar>
      )
    } else {
      return (
        <Avatar src={this.state.account.avatar} style={{verticalAlign: 'middle' }} size="large">
          {Setting.getShortName(this.state.account.name)}
        </Avatar>
      )
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
      <Dropdown key="/rightDropDown" overlay={menu} className="rightDropDown">
        <div className="ant-dropdown-link" style={{float: 'right', cursor: 'pointer'}}>
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
    )
  }

  renderAccount() {
    let res = [];

    if (this.state.account === undefined) {
      return null;
    } else if (this.state.account === null) {
      res.push(
        <Menu.Item key="/signup" style={{float: 'right', marginRight: '20px'}}>
          <a href={Setting.getSignupUrl()}>
            {i18next.t("account:Sign Up")}
          </a>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="/signin" style={{float: 'right'}}>
          <a href={Setting.getSigninUrl()}>
            {i18next.t("account:Sign In")}
          </a>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="/" style={{float: 'right'}}>
          <a href="/">
            {i18next.t("general:Home")}
          </a>
        </Menu.Item>
      );
    } else {
      res.push(this.renderRightDropdown());
    }

    return res;
  }

  renderMenu() {
    let res = [];

    if (this.state.account === null || this.state.account === undefined) {
      return [];
    }

    res.push(
      <Menu.Item key="/">
        <a href="/">
          {i18next.t("general:Home")}
        </a>
        {/*<Link to="/">*/}
        {/*  Home*/}
        {/*</Link>*/}
      </Menu.Item>
    );

    res.push(
      <Menu.Item key="/payments">
        <Link to="/payments">
          {i18next.t("general:Payments")}
        </Link>
      </Menu.Item>
    );

    if (this.state.account.isAdmin) {
      res.push(
        <Menu.Item key="/conferences">
          <Link to="/conferences">
            {i18next.t("general:Conferences")}
          </Link>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="/resources">
          <a target="_blank" rel="noreferrer" href={Setting.getMyProfileUrl(this.state.account).replace("/account", "/resources")}>
            {i18next.t("general:Resources")}
          </a>
        </Menu.Item>
      );
    }

    res.push(
      <Menu.Item key="/submissions">
        <Link to="/submissions">
          {i18next.t("general:Submissions")}
        </Link>
      </Menu.Item>
    );

    res.push(
      <Menu.Item key="/contact">
        <Link to="/contact">
          {i18next.t("general:Service Desk")}
        </Link>
      </Menu.Item>
    );

    if (this.state.account.isAdmin) {
      res.push(
        <Menu.Item key="/rooms">
          <Link to="/rooms">
            {i18next.t("general:Rooms")}
          </Link>
        </Menu.Item>
      );
    }

    return res;
  }

  renderHomeIfSignedIn(component) {
    if (this.state.account !== null && this.state.account !== undefined) {
      return <Redirect to='/' />
    } else {
      return component;
    }
  }

  renderSigninIfNotSignedIn(component) {
    if (this.state.account === null) {
      sessionStorage.setItem("from", window.location.pathname);
      return <Redirect to='/signin' />
    } else if (this.state.account === undefined) {
      return null;
    }
    else {
      return component;
    }
  }

  renderContent() {
    return (
      <div>
        <Header style={{padding: '0', marginBottom: '3px'}}>
          {
            Setting.isMobile() ? null : <a className="logo" href={"/"}/>
          }
          <Menu
            // theme="dark"
            mode={"horizontal"}
            selectedKeys={[`${this.state.selectedMenuKey}`]}
            style={{lineHeight: '64px'}}
          >
            {
              this.renderMenu()
            }
            {
              this.renderAccount()
            }
            <SelectLanguageBox />
          </Menu>
        </Header>
        <Switch>
          <Route exact path="/callback" component={AuthCallback}/>
          <Route exact path="/" render={(props) => <HomePage account={this.state.account} {...props} />}/>
          <Route exact path="/payments" render={(props) => this.renderSigninIfNotSignedIn(<PaymentPage account={this.state.account} {...props} />)}/>
          <Route exact path="/contact" render={(props) => this.renderSigninIfNotSignedIn(<ContactPage account={this.state.account} {...props} />)}/>
          <Route exact path="/signin" render={(props) => this.renderHomeIfSignedIn(<SigninPage {...props} />)}/>
          <Route exact path="/conferences" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceListPage account={this.state.account} {...props} />)}/>
          <Route exact path="/conferences/:conferenceName" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceEditPage account={this.state.account} {...props} />)}/>
          <Route exact path="/submissions" render={(props) => this.renderSigninIfNotSignedIn(<SubmissionListPage account={this.state.account} {...props} />)}/>
          <Route exact path="/submissions/:userName/:submissionName" render={(props) => this.renderSigninIfNotSignedIn(<SubmissionEditPage account={this.state.account} {...props} />)}/>
          <Route exact path="/rooms" render={(props) => this.renderSigninIfNotSignedIn(<RoomListPage account={this.state.account} {...props} />)}/>
          <Route exact path="/rooms/:userName/:roomName" render={(props) => this.renderSigninIfNotSignedIn(<RoomEditPage account={this.state.account} {...props} />)}/>
        </Switch>
      </div>
    )
  }

  renderFooter() {
    // How to keep your footer where it belongs ?
    // https://www.freecodecamp.org/neyarnws/how-to-keep-your-footer-where-it-belongs-59c6aa05c59c/

    return (
      <Footer id="footer" style={
        {
          borderTop: '1px solid #e8e8e8',
          backgroundColor: 'white',
          textAlign: 'center',
        }
      }>
        Made with <span style={{color: 'rgb(255, 255, 255)'}}>❤️</span> by <a style={{fontWeight: "bold", color: "black"}} target="_blank" rel="noreferrer" href="https://casbin.org">Casbin</a>, { Setting.isMobile() ? "Mobile" : "Desktop" } View
      </Footer>
    )
  }

  render() {
    return (
      <div id="parent-area">
        <BackTop/>
        <div id="content-wrap">
          {
            this.renderContent()
          }
        </div>
        {
          this.renderFooter()
        }
      </div>
    );
  }
}

export default withRouter(App);
