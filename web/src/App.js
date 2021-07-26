import React, {Component} from 'react';
import {Switch, Redirect, Route, withRouter} from 'react-router-dom';
import {Avatar, BackTop, Dropdown, Layout, Menu} from 'antd';
import {DownOutlined, LogoutOutlined, SettingOutlined} from '@ant-design/icons';
import './App.css';
import * as Setting from "./Setting";
import * as AccountBackend from "./backend/AccountBackend";
import * as Auth from "./auth/Auth";
import AuthCallback from "./auth/AuthCallback";
import * as Conf from "./Conf";
import HomePage from "./HomePage";
import ConferenceListPage from "./ConferenceListPage";
import ConferenceEditPage from "./ConferenceEditPage";
import ResourceListPage from "./ResourceListPage";
import ResourceEditPage from "./ResourceEditPage";
import SigninPage from "./SigninPage";

const {Header, Footer} = Layout;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      selectedMenuKey: 0,
      account: undefined,
    };

    Setting.initServerUrl();
    Auth.initAuthWithConfig(Conf.AuthConfig);
  }

  componentWillMount() {
    this.updateMenuKey();
    this.getAccount();
  }

  updateMenuKey() {
    // eslint-disable-next-line no-restricted-globals
    const uri = location.pathname;
    if (uri === '/') {
      this.setState({selectedMenuKey: '/'});
    } else if (uri.includes('/conferences')) {
      this.setState({ selectedMenuKey: '/conferences' });
    } else if (uri.includes('/resources')) {
      this.setState({ selectedMenuKey: '/resources' });
    } else {
      this.setState({selectedMenuKey: 'null'});
    }
  }

  onUpdateAccount(account) {
    this.setState({
      account: account
    });
  }

  getAccount() {
    AccountBackend.getAccount()
      .then((res) => {
        this.setState({
          account: res.data,
        });
      });
  }

  signout() {
    this.setState({
      expired: false,
      submitted: false,
    });

    AccountBackend.signout()
      .then((res) => {
        if (res.status === 'ok') {
          this.setState({
            account: null
          });

          Setting.showMessage("success", `Successfully signed out, redirected to homepage`);
          Setting.goToLink("/");
        } else {
          Setting.showMessage("error", `Signout failed: ${res.msg}`);
        }
      });
  }

  handleRightDropdownClick(e) {
    if (e.key === '0') {
      Setting.openLink(Auth.getMyProfileUrl(this.state.account));
    } else if (e.key === '1') {
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
        <Menu.Item key='0'>
          <SettingOutlined />
          My Account
        </Menu.Item>
        <Menu.Item key='1'>
          <LogoutOutlined />
          Signout
        </Menu.Item>
      </Menu>
    );

    return (
      <Dropdown key="200" overlay={menu} >
        <a className="ant-dropdown-link" href="#" style={{float: 'right'}}>
          {
            this.renderAvatar()
          }
          &nbsp;
          &nbsp;
          {Setting.isMobile() ? null : Setting.getShortName(this.state.account.name)} &nbsp; <DownOutlined />
          &nbsp;
          &nbsp;
          &nbsp;
        </a>
      </Dropdown>
    )
  }

  renderAccount() {
    let res = [];

    if (this.state.account === undefined) {
      return null;
    } else if (this.state.account === null) {
      res.push(
        <Menu.Item key="101" style={{float: 'right', marginRight: '20px'}}>
          <a href={Auth.getSignupUrl()}>
            Signup
          </a>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="102" style={{float: 'right'}}>
          <a href={Auth.getSigninUrl()}>
            Signin
          </a>
        </Menu.Item>
      );
      res.push(
        <Menu.Item key="103" style={{float: 'right'}}>
          <a href="/">
            Home
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
          Home
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="/conferences">
        <a href="/conferences">
          Conferences
        </a>
      </Menu.Item>
    );
    res.push(
      <Menu.Item key="/resources">
        <a href="/resources">
          Resources
        </a>
      </Menu.Item>
    );

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
            Setting.isMobile() ? null : <a className="logo_with_text" href={"/"}/>
          }
          <Menu
            // theme="dark"
            mode={"horizontal"}
            defaultSelectedKeys={[`${this.state.selectedMenuKey}`]}
            style={{lineHeight: '64px'}}
          >
            {
              this.renderMenu()
            }
            {
              this.renderAccount()
            }
          </Menu>
        </Header>
        <Switch>
          <Route exact path="/callback" component={AuthCallback}/>
          <Route exact path="/" render={(props) => <HomePage account={this.state.account} {...props} />}/>
          <Route exact path="/signin" render={(props) => this.renderHomeIfSignedIn(<SigninPage {...props} />)}/>
          <Route exact path="/conferences" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceListPage account={this.state.account} {...props} />)}/>
          <Route exact path="/conferences/:conferenceName" render={(props) => this.renderSigninIfNotSignedIn(<ConferenceEditPage account={this.state.account} {...props} />)}/>
          <Route exact path="/resources" render={(props) => this.renderSigninIfNotSignedIn(<ResourceListPage account={this.state.account} {...props} />)}/>
          <Route exact path="/resources/:resourceName" render={(props) => this.renderSigninIfNotSignedIn(<ResourceEditPage account={this.state.account} {...props} />)}/>
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
        Made with <span style={{color: 'rgb(255, 255, 255)'}}>❤️</span> by <a style={{fontWeight: "bold", color: "black"}} target="_blank" href="https://casbin.org">Casbin</a>, { Setting.isMobile() ? "Mobile" : "Desktop" } View
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
