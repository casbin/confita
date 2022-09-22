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
import {Button, Card, Col, DatePicker, Input, InputNumber, Row, Select, Switch} from 'antd';
import {LinkOutlined} from "@ant-design/icons";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import moment from "moment";
import Conference from "./Conference";
import ConferenceEdit from "./ConferenceEdit";
import i18next from "i18next";

const { Option } = Select;

class ConferenceEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conferenceName: props.match.params.conferenceName,
      conference: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(this.props.account.name, this.state.conferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  parseConferenceField(key, value) {
    if (["score"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateConferenceField(key, value) {
    value = this.parseConferenceField(key, value);

    let conference = this.state.conference;
    conference[key] = value;
    this.setState({
      conference: conference,
    });
  }

  renderConference() {
    return (
      <Card size="small" title={
        <div>
          {i18next.t("conference:Edit Conference")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitConferenceEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.name} onChange={e => {
              this.updateConferenceField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Display name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.displayName} onChange={e => {
              this.updateConferenceField('displayName', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Type")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.type} onChange={(value => {this.updateConferenceField('type', value);})}>
              {
                [
                  {id: 'Conference', name: 'Conference'},
                  {id: 'Competition', name: 'Competition'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Introduction")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.introduction} onChange={e => {
              this.updateConferenceField('introduction', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Start date")}:
          </Col>
          <Col span={5} >
            <DatePicker defaultValue={moment(this.state.conference.startDate, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateConferenceField('startDate', timeString);
            }} />
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:End date")}:
          </Col>
          <Col span={10} >
            <DatePicker defaultValue={moment(this.state.conference.endDate, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateConferenceField('endDate', timeString);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Organizer")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.organizer} onChange={e => {
              this.updateConferenceField('organizer', e.target.value);
            }} />
          </Col>
        </Row>
        {
          this.state.conference.type !== "Conference" ? null : (
            <React.Fragment>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Location")}:
                </Col>
                <Col span={22} >
                  <Input value={this.state.conference.location} onChange={e => {
                    this.updateConferenceField('location', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Address")}:
                </Col>
                <Col span={22} >
                  <Input value={this.state.conference.address} onChange={e => {
                    this.updateConferenceField('address', e.target.value);
                  }} />
                </Col>
              </Row>
            </React.Fragment>
          )
        }
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Carousels")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} mode="tags" style={{width: '100%'}} placeholder="Please input"
                    value={this.state.conference.carousels}
                    onChange={value => {
                      this.updateConferenceField('carousels', value);
                    }}
            >
              {
                this.state.conference.carousels.map((carousel, index) => <Option key={carousel}>{carousel}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Carousel height")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.carouselHeight} onChange={e => {
              this.updateConferenceField('carouselHeight', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Enable submission")}:
          </Col>
          <Col span={1} >
            <Switch checked={this.state.conference.enableSubmission} onChange={checked => {
              this.updateConferenceField('enableSubmission', checked);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Tags")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} mode="tags" style={{width: '100%'}} placeholder="Please input"
                    value={this.state.conference.tags}
                    onChange={value => {
                      this.updateConferenceField('tags', value);
                    }}
            />
          </Col>
        </Row>
        {
          this.state.conference.type !== "Competition" ? null : (
            <React.Fragment>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Dataset URL")}:
                </Col>
                <Col span={22} >
                  <Input prefix={<LinkOutlined/>} value={this.state.conference.datasetUrl} onChange={e => {
                    this.updateConferenceField('datasetUrl', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Preview URL")}:
                </Col>
                <Col span={22} >
                  <Input prefix={<LinkOutlined/>} value={this.state.conference.datasetPreviewUrl} onChange={e => {
                    this.updateConferenceField('datasetPreviewUrl', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Result URL")}:
                </Col>
                <Col span={22} >
                  <Input prefix={<LinkOutlined/>} value={this.state.conference.resultUrl} onChange={e => {
                    this.updateConferenceField('resultUrl', e.target.value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Bonus")}:
                </Col>
                <Col span={22} >
                  <InputNumber min={0} value={this.state.conference.bonus} onChange={value => {
                    this.updateConferenceField('bonus', value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("conference:Person count")}:
                </Col>
                <Col span={22} >
                  <InputNumber min={0} value={this.state.conference.personCount} onChange={value => {
                    this.updateConferenceField('personCount', value);
                  }} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={2}>
                  {i18next.t("general:Display state")}:
                </Col>
                <Col span={22} >
                  <Input value={this.state.conference.displayState} onChange={e => {
                    this.updateConferenceField('displayState', e.target.value);
                  }} />
                </Col>
              </Row>
            </React.Fragment>
          )
        }
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Status")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.status} onChange={(value => {this.updateConferenceField('status', value);})}>
              {
                [
                  {id: 'Public', name: 'Public (Everyone can see it)'},
                  {id: 'Hidden', name: 'Hidden (Only yourself can see it)'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Default item")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.defaultItem} onChange={value => {this.updateConferenceField('defaultItem', value);}}>
              {
                this.state.conference.treeItems.filter(treeItem => treeItem.children.length === 0).map((treeItem, index) => <Option key={treeItem.title}>{`${treeItem.title} | ${treeItem.titleEn}`}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Language")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.language} onChange={(value => {this.updateConferenceField('language', value);})}>
              {
                [
                  {id: 'zh', name: 'zh'},
                  {id: 'en', name: 'en'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("conference:Menu")}:
          </Col>
          <Col span={22} >
            <ConferenceEdit conference={this.state.conference} language={this.state.conference.language} onUpdateTreeItems={(value) => { this.updateConferenceField('treeItems', value)}} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Preview")}:
          </Col>
          <Col span={22} >
            <Conference conference={this.state.conference} language={this.state.conference.language} />
          </Col>
        </Row>
      </Card>
    )
  }

  submitConferenceEdit() {
    let conference = Setting.deepCopy(this.state.conference);
    ConferenceBackend.updateConference(this.state.conference.owner, this.state.conferenceName, conference)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            conferenceName: this.state.conference.name,
          });
          this.props.history.push(`/conferences/${this.state.conference.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateConferenceField('name', this.state.conferenceName);
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
              this.state.conference !== null ? this.renderConference() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitConferenceEdit.bind(this)}>{i18next.t("general:Save")}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConferenceEditPage;
