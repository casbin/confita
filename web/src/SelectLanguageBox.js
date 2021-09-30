import React from "react";
import {Link} from "react-router-dom";
import * as Setting from "./Setting";
import { Menu} from "antd";
import { createFromIconfontCN } from '@ant-design/icons';
import './App.less';

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
    return (
      <React.Fragment>
        <Menu.Item key="en" style={{float: 'right', marginRight: '20px'}} icon={<IconFont type="icon-en" />}>
          <Link style={{color: "black"}} onClick={() => {
            Setting.changeLanguage("en");
          }}>
            English
          </Link>
        </Menu.Item>
        <Menu.Item key="zh" style={{float: 'right', marginRight: '20px'}} icon={<IconFont type="icon-zh" />}>
          <Link style={{color: "black"}} onClick={() => {
            Setting.changeLanguage("zh");
          }}>
            简体中文
          </Link>
        </Menu.Item>
      </React.Fragment>
    );
  }
}

export default SelectLanguageBox;
