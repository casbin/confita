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
import * as Setting from "./Setting";
import {Menu} from "antd";
import {createFromIconfontCN} from "@ant-design/icons";
import "./App.less";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2680620_ffij16fkwdg.js",
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
        <Menu.Item key="en" className="rightDropDown" style={{float: "right", cursor: "pointer", marginRight: "20px"}} icon={<React.Fragment>&nbsp;&nbsp;&nbsp;&nbsp;<IconFont type="icon-en" /></React.Fragment>}
          onClick={() => {
            Setting.changeLanguage("en");
          }}
          onItemHover={() => {}}
        >
          &nbsp;
          English
          &nbsp;
          &nbsp;
        </Menu.Item>
        <Menu.Item key="zh" className="rightDropDown" style={{float: "right", cursor: "pointer"}} icon={<React.Fragment>&nbsp;&nbsp;&nbsp;&nbsp;<IconFont type="icon-zh" /></React.Fragment>}
          onClick={() => {
            Setting.changeLanguage("zh");
          }}
          onItemHover={() => {}}
        >
          &nbsp;
          中文
          &nbsp;
          &nbsp;
        </Menu.Item>
      </React.Fragment>
    );
  }
}

export default SelectLanguageBox;
