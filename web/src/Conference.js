import React from "react";
import {Col, Empty, Menu, Row} from "antd";

class Conference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      selectedKey: 0,
    };
  }

  componentWillMount() {
  }

  handleClick = info => {
    const selectedKey = info.key;
    this.setState({
      selectedKey: selectedKey,
    });
  };

  renderMenu(treeItems) {
    const mode = "inline";
    const theme = "light";
    // const theme = "dark";

    return (
      <Menu
        // style={{ width: 256 }}
        defaultSelectedKeys={['0']}
        defaultOpenKeys={['sub1']}
        mode={mode}
        theme={theme}
        className={"conferenceMenu"}
        style={{border: "1px solid rgb(240,240,240)"}}
        onClick={this.handleClick}
      >
        {
          treeItems.map((treeItem, i) => {
            if (i === 0) {
              return null;
            }

            return (
              <Menu.Item key={`${i}`}>
                {treeItem.title}
              </Menu.Item>
            )
          })
        }
        {/*<Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Introduction*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Committees*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="1" icon={<MailOutlined />}>*/}
        {/*  Hosting Organizations*/}
        {/*</Menu.Item>*/}
        {/*<Menu.Item key="2" icon={<CalendarOutlined />}>*/}
        {/*  Navigation Two*/}
        {/*</Menu.Item>*/}
        {/*<SubMenu key="sub1" icon={<AppstoreOutlined />} title="Navigation Two">*/}
        {/*  <Menu.Item key="3">Option 3</Menu.Item>*/}
        {/*  <Menu.Item key="4">Option 4</Menu.Item>*/}
        {/*  <SubMenu key="sub1-2" title="Submenu">*/}
        {/*    <Menu.Item key="5">Option 5</Menu.Item>*/}
        {/*    <Menu.Item key="6">Option 6</Menu.Item>*/}
        {/*  </SubMenu>*/}
        {/*</SubMenu>*/}
        {/*<SubMenu key="sub2" icon={<SettingOutlined />} title="Navigation Three">*/}
        {/*  <Menu.Item key="7">Option 7</Menu.Item>*/}
        {/*  <Menu.Item key="8">Option 8</Menu.Item>*/}
        {/*  <Menu.Item key="9">Option 9</Menu.Item>*/}
        {/*  <Menu.Item key="10">Option 10</Menu.Item>*/}
        {/*</SubMenu>*/}
        {/*<Menu.Item key="link" icon={<LinkOutlined />}>*/}
        {/*  <a href="https://ant.design" target="_blank" rel="noopener noreferrer">*/}
        {/*    Ant Design*/}
        {/*  </a>*/}
        {/*</Menu.Item>*/}
      </Menu>
    )
  }

  getTreeItem(treeItems) {
    if (this.state.selectedKey === null) {
      return null;
    }

    return treeItems[this.state.selectedKey];
  }

  renderPage(treeItem) {
    if (treeItem === undefined || treeItem === null) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )
    }

    return (
      <div>
        {/*<div style={{textAlign: "center", fontSize: "x-large"}}>*/}
        {/*  {*/}
        {/*    treeItem.title*/}
        {/*  }*/}
        {/*</div>*/}
        <div style={{marginTop: "40px"}} dangerouslySetInnerHTML={{ __html: treeItem.content }} />
      </div>
    )
  }

  render() {
    const conference = this.props.conference;

    return (
      <Row style={{marginTop: '10px'}} >
        <Col span={4} >
          {
            this.renderMenu(conference.treeItems)
          }
        </Col>
        <Col span={1} >
        </Col>
        <Col span={19} >
          {
            this.renderPage(this.getTreeItem(conference.treeItems))
          }
        </Col>
      </Row>
    )
  }
}

export default Conference;
