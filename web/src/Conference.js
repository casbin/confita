import React from "react";
import {Col, Menu, Row} from "antd";
import {AppstoreOutlined, CalendarOutlined, LinkOutlined, MailOutlined, SettingOutlined} from "@ant-design/icons";

const { SubMenu } = Menu;

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  componentWillMount() {
  }

  renderMenu() {
    const mode = "inline";
    const theme = "light";

    return (
      <Menu
        // style={{ width: 256 }}
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
      >
        <Menu.Item key="1" icon={<MailOutlined />}>
          Introduction
        </Menu.Item>
        <Menu.Item key="1" icon={<MailOutlined />}>
          Committees
        </Menu.Item>
        <Menu.Item key="1" icon={<MailOutlined />}>
          Hosting Organizations
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />}>
          Navigation Two
        </Menu.Item>
        <SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="3">Option 3</Menu.Item>
          <Menu.Item key="4">Option 4</Menu.Item>
          <SubMenu key="sub1-2" title="Submenu">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
          </SubMenu>
        </SubMenu>
        <SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
        </SubMenu>
        <Menu.Item key="link" icon={<LinkOutlined />}>
          <a href="https://ant.design" target="_blank" rel="noopener noreferrer">
            Ant Design
          </a>
        </Menu.Item>
      </Menu>
    )
  }

  render() {
    const conference = this.props.conference;

    return (
      <Row style={{marginTop: '10px'}} >
        <Col span={4}>
          {
            this.renderMenu()
          }
        </Col>
        <Col span={20} >
          {
            conference.name
          }
        </Col>
      </Row>
    )
  }
}

export default Conference;
