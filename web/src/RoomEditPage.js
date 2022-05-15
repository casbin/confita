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
import {Button, Card, Col, Input, Row, Select} from 'antd';
import * as RoomBackend from "./backend/RoomBackend";
import {LinkOutlined} from "@ant-design/icons";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import Room from "./Room";
import ParticipantTable from "./ParticipantTable";

const { Option } = Select;

class RoomEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      userName: props.match.params.userName,
      roomName: props.match.params.roomName,
      room: null,
      conferences: [],
    };
  }

  componentWillMount() {
    this.getRoom();
    this.getGlobalConferences();
  }

  getGlobalConferences() {
    ConferenceBackend.getGlobalConferences()
      .then(res => {
        this.setState({
          conferences: res,
        });
      });
  }

  getRoom() {
    RoomBackend.getRoom(this.state.userName, this.state.roomName)
      .then((room) => {
        this.setState({
          room: room,
        });
      });
  }

  parseRoomField(key, value) {
    if (["score"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateRoomField(key, value) {
    value = this.parseRoomField(key, value);

    let room = this.state.room;
    room[key] = value;
    this.setState({
      room: room,
    });
  }

  renderRoom() {
    return (
      <Card size="small" title={
        <div>
          {i18next.t("room:Edit Room")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitRoomEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.room.name} onChange={e => {
              this.updateRoomField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Display name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.room.displayName} onChange={e => {
              this.updateRoomField('displayName', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Conference")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.room.conference} onChange={(value => {this.updateRoomField('conference', value);})}>
              {
                this.state.conferences.map((conference, index) => <Option key={index} value={conference.name}>{conference.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("room:Server URL")}:
          </Col>
          <Col span={22} >
            <Input prefix={<LinkOutlined/>} value={this.state.room.serverUrl} onChange={e => {
              this.updateRoomField('serverUrl', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("room:Empty timeout")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.room.emptyTimeout} onChange={e => {
              this.updateRoomField('emptyTimeout', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("room:Max count")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.room.maxCount} onChange={e => {
              this.updateRoomField('maxCount', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("room:Participants")}:
          </Col>
          <Col span={22} >
            <ParticipantTable
              title={i18next.t("room:Participants")}
              table={this.state.room.participants}
              onUpdateTable={(value) => { this.updateRoomField('participants', value)}}
            />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Preview")}:
          </Col>
          <Col span={22} >
            <Room room={this.state.room} account={this.props.account} onGetRoom={() => {this.getRoom()}} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Status")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.room.status} onChange={(value => {this.updateRoomField('status', value);})}>
              {
                [
                  {id: 'Started', name: i18next.t("room:Started")},
                  {id: 'Ended', name: i18next.t("room:Ended")},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
      </Card>
    )
  }

  submitRoomEdit() {
    let room = Setting.deepCopy(this.state.room);
    RoomBackend.updateRoom(this.state.room.owner, this.state.roomName, room)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            roomName: this.state.room.name,
          });
          this.props.history.push(`/rooms/${this.state.room.owner}/${this.state.room.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateRoomField('name', this.state.roomName);
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
              this.state.room !== null ? this.renderRoom() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitRoomEdit.bind(this)}>{i18next.t("general:Save")}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RoomEditPage;
