import React from "react";
import * as Setting from "./Setting";
import { Menu, Dropdown} from "antd";
import { createFromIconfontCN } from '@ant-design/icons';
import './App.css';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2680620_ffij16fkwdg.js',
});

class SelectLanguageBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  render() {
    const menu = (
      <Menu onClick={(e) => {
        Setting.changeLanguage(e.key);
      }}>
        <Menu.Item key="en" icon={<IconFont type="icon-en" />}>English</Menu.Item>
        <Menu.Item key="zh" icon={<IconFont type="icon-zh" />}>简体中文</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown overlay={menu} >
        <div className="language_box" />
      </Dropdown>
    );
  }
}

export default SelectLanguageBox;
