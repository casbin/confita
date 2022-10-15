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
import {Button, Card, Col, Input, Row} from "antd";
import * as CodeBackend from "./backend/CodeBackend";
import * as Setting from "./Setting";
import i18next from "i18next";

class CodeEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      codeName: props.match.params.codeName,
      code: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getCode();
  }

  getCode() {
    CodeBackend.getCode(this.props.account.name, this.state.codeName)
      .then((code) => {
        this.setState({
          code: code,
        });
      });
  }

  parseCodeField(key, value) {
    if (["score"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateCodeField(key, value) {
    value = this.parseCodeField(key, value);

    const code = this.state.code;
    code[key] = value;
    this.setState({
      code: code,
    });
  }

  renderCode() {
    return (
      <Card size="small" title={
        <div>
          {i18next.t("code:Edit Code")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitCodeEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={{marginLeft: "5px"}} type="inner">
        <Row style={{marginTop: "10px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.code.name} onChange={e => {
              this.updateCodeField("name", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Display name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.code.displayName} onChange={e => {
              this.updateCodeField("displayName", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("code:Notebook")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.code.notebook} onChange={e => {
              this.updateCodeField("notebook", e.target.value);
            }} />
          </Col>
        </Row>
      </Card>
    );
  }

  submitCodeEdit() {
    const code = Setting.deepCopy(this.state.code);
    CodeBackend.updateCode(this.state.code.owner, this.state.codeName, code)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", "Successfully saved");
          this.setState({
            codeName: this.state.code.name,
          });
          this.props.history.push(`/code/${this.state.code.name}`);
        } else {
          Setting.showMessage("error", "failed to save: server side failure");
          this.updateCodeField("name", this.state.codeName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `failed to save: ${error}`);
      });
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.state.code !== null ? this.renderCode() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitCodeEdit.bind(this)}>{i18next.t("general:Save")}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CodeEditPage;
