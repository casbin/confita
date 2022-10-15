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
import {Button, Card, Col, DatePicker, Input, Row, Select, Switch, TimePicker} from "antd";
import * as RoomBackend from "./backend/RoomBackend";
import {CopyOutlined, LinkOutlined} from "@ant-design/icons";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import ParticipantTable from "./ParticipantTable";
import moment from "moment";
import Video from "./Video";
import copy from "copy-to-clipboard";

const {Option} = Select;

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

  UNSAFE_componentWillMount() {
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
    if (["videoWidth", "videoHeight"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateRoomField(key, value) {
    value = this.parseRoomField(key, value);

    const room = this.state.room;
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
      } style={{marginLeft: "5px"}} type="inner">
        <Row style={{marginTop: "10px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("submission:Conference")}:
          </Col>
          <Col span={2} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.room.conference} onChange={(value => {this.updateRoomField("conference", value);})}>
              {
                this.state.conferences.map((conference, index) => <Option key={index} value={conference.name}>{conference.name}</Option>)
              }
            </Select>
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Name")}:
          </Col>
          <Col span={2} >
            <Input value={this.state.room.name} onChange={e => {
              this.updateRoomField("name", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Display name")}:
          </Col>
          <Col span={3} >
            <Input value={this.state.room.displayName} onChange={e => {
              this.updateRoomField("displayName", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Speaker")}:
          </Col>
          <Col span={6} >
            <Input value={this.state.room.speaker} onChange={e => {
              this.updateRoomField("speaker", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Date")}:
          </Col>
          <Col span={3} >
            <DatePicker defaultValue={moment(this.state.room.date, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateRoomField("date", timeString);
            }} />
          </Col>
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Start time")}:
          </Col>
          <Col span={3} >
            <TimePicker value={moment(this.state.room.startTime, "HH:mm")} format={"HH:mm"} onChange={(time, timeString) => {
              this.updateRoomField("startTime", timeString);
            }} />
          </Col>
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:End time")}:
          </Col>
          <Col span={4} >
            <TimePicker value={moment(this.state.room.endTime, "HH:mm")} format={"HH:mm"} onChange={(time, timeString) => {
              this.updateRoomField("endTime", timeString);
            }} />
          </Col>
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Location")}:
          </Col>
          <Col span={6} >
            <Input value={this.state.room.location} onChange={e => {
              this.updateRoomField("location", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:SDK key")}:
          </Col>
          <Col span={7} >
            <Input value={this.state.room.sdkKey} onChange={e => {
              this.updateRoomField("sdkKey", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Signature")}:
          </Col>
          <Col span={12} >
            <Input value={this.state.room.signature} onChange={e => {
              this.updateRoomField("signature", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Meeting No.")}:
          </Col>
          <Col span={2} >
            <Input value={this.state.room.meetingNumber} onChange={e => {
              this.updateRoomField("meetingNumber", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Passcode")}:
          </Col>
          <Col span={2} >
            <Input value={this.state.room.passcode} onChange={e => {
              this.updateRoomField("passcode", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Invite link")}:
          </Col>
          <Col span={12} >
            <Input prefix={<LinkOutlined />} value={this.state.room.inviteLink} onChange={e => {
              this.updateRoomField("inviteLink", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Start URL")}:
          </Col>
          <Col span={7} >
            <Input prefix={<LinkOutlined />} value={this.state.room.startUrl} onChange={e => {
              this.updateRoomField("startUrl", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Image URL")}:
          </Col>
          <Col span={12} >
            <Input prefix={<LinkOutlined />} value={this.state.room.imageUrl} onChange={e => {
              this.updateRoomField("imageUrl", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Ingest domain")}:
          </Col>
          <Col span={3} >
            <Input prefix={<LinkOutlined />} value={this.state.room.ingestDomain} onChange={e => {
              this.updateRoomField("ingestDomain", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Ingest auth key")}:
          </Col>
          <Col span={6} >
            <Input value={this.state.room.ingestAuthKey} onChange={e => {
              this.updateRoomField("ingestAuthKey", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Video width")}:
          </Col>
          <Col span={2} >
            <Input value={this.state.room.videoWidth} onChange={e => {
              this.updateRoomField("videoWidth", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Video height")}:
          </Col>
          <Col span={2} >
            <Input value={this.state.room.videoHeight} onChange={e => {
              this.updateRoomField("videoHeight", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Ingest URL")}:
          </Col>
          <Col span={22} >
            <Input.Group compact>
              <Input style={{width: "900px"}} prefix={<LinkOutlined />} disabled={true} value={Setting.getIngestUrl(this.state.room)} onChange={e => {}} />
              <Button icon={<CopyOutlined />} onClick={() => {
                const ingestUrl = Setting.getIngestUrl(this.state.room);
                copy(ingestUrl);
                Setting.showMessage("success", `Ingest URL copied to clipboard successfully: ${ingestUrl}`);
              }} />
            </Input.Group>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Streaming domain")}:
          </Col>
          <Col span={3} >
            <Input prefix={<LinkOutlined />} value={this.state.room.streamingDomain} onChange={e => {
              this.updateRoomField("streamingDomain", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Streaming auth key")}:
          </Col>
          <Col span={6} >
            <Input value={this.state.room.streamingAuthKey} onChange={e => {
              this.updateRoomField("streamingAuthKey", e.target.value);
            }} />
          </Col>
          <Col span={1} />
          <Col style={{marginTop: "5px"}} span={3}>
            {i18next.t("room:Mobile streaming auth key")}:
          </Col>
          <Col span={6} >
            <Input value={this.state.room.mobileStreamingAuthKey} onChange={e => {
              this.updateRoomField("mobileStreamingAuthKey", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Streaming URL")}:
          </Col>
          <Col span={22} >
            <Input.Group compact>
              <Input style={{width: "900px"}} prefix={<LinkOutlined />} disabled={true} value={Setting.getStreamingUrl(this.state.room)} onChange={e => {}} />
              <Button icon={<CopyOutlined />} onClick={() => {
                const streamingUrl = Setting.getStreamingUrl(this.state.room);
                copy(streamingUrl);
                Setting.showMessage("success", `Streaming URL copied to clipboard successfully: ${streamingUrl}`);
              }} />
            </Input.Group>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Video URL")}:
          </Col>
          <Col span={22} >
            <Input prefix={<LinkOutlined />} value={this.state.room.videoUrl} onChange={e => {
              this.updateRoomField("videoUrl", e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("room:Participants")}:
          </Col>
          <Col span={22} >
            <ParticipantTable
              title={i18next.t("room:Participants")}
              table={this.state.room.participants}
              room={this.state.room}
              onUpdateTable={(value) => {this.updateRoomField("participants", value);}}
            />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Status")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: "100%"}} value={this.state.room.status} onChange={(value => {this.updateRoomField("status", value);})}>
              {
                [
                  {id: "Started", name: i18next.t("room:Started")},
                  {id: "Ended", name: i18next.t("room:Ended")},
                  {id: "Hidden", name: i18next.t("room:Hidden")},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("room:Is public")}:
          </Col>
          <Col span={1} >
            <Switch checked={this.state.room.isPublic} onChange={checked => {
              this.updateRoomField("isPublic", checked);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: "20px"}} >
          <Col style={{marginTop: "5px"}} span={2}>
            {i18next.t("general:Preview")}:
          </Col>
          <Col span={22} >
            {
              !this.state.room.isLive ? null : (
                <Video room={this.state.room} />
              )
            }
          </Col>
        </Row>
      </Card>
    );
  }

  submitRoomEdit() {
    const room = Setting.deepCopy(this.state.room);
    RoomBackend.updateRoom(this.state.room.owner, this.state.roomName, room)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", "Successfully saved");
          this.setState({
            roomName: this.state.room.name,
          });
          this.props.history.push(`/rooms/${this.state.room.owner}/${this.state.room.name}`);
        } else {
          Setting.showMessage("error", "failed to save: server side failure");
          this.updateRoomField("name", this.state.roomName);
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
