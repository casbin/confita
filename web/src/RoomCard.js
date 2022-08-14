// Copyright 2022 The Casbin Authors. All Rights Reserved.
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
import {withRouter} from "react-router-dom";
import {Button, Card, Col, Popconfirm, Tooltip} from "antd";
import {VideoCameraOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";
import i18next from "i18next";
import QrCode from "./QrCode";

const { Meta } = Card;

class RoomCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  registerRoom(index) {
    this.props.onRegisterRoom(index);
  }

  renderButtons(index, room, startUrl, joinUrl) {
    if (Setting.isAdminUser(this.props.account)) {
      return (
        <div>
          <a target="_blank" rel="noreferrer" href={startUrl}>
            <Button disabled={startUrl === ""} style={{marginRight: '10px', marginBottom: '10px'}} danger>{i18next.t("room:Join In")}</Button>
          </a>
          {
            (startUrl === "") ? (
              <Button disabled={startUrl === ""} style={{marginRight: '10px'}} danger>{i18next.t("room:Scan QR Code")}</Button>
            ) : (
              <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={startUrl} />}>
                <Button disabled={startUrl === ""} style={{marginRight: '10px'}} danger>{i18next.t("room:Scan QR Code")}</Button>
              </Tooltip>
            )
          }
          <Button icon={<VideoCameraOutlined />} style={{marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>{i18next.t("room:Watch Live")}</Button>
          <Button style={{marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}`)}>{i18next.t("general:Edit")}</Button>
          <Popconfirm
            title={`Sure to delete room: ${room.name} ?`}
            onConfirm={() => this.deleteRoom(index)}
            okText="OK"
            cancelText="Cancel"
          >
            <Button type="danger">{i18next.t("general:Delete")}</Button>
          </Popconfirm>
        </div>
      )
    } else {
      return (
        <div>
          {
            joinUrl !== "" ? null : (
              <Button disabled={room.meetingNumber === ""} style={{marginRight: '10px'}} type="primary" onClick={() => this.registerRoom(index)}>
                {i18next.t("room:Register")}
              </Button>
            )
          }
          <a target="_blank" rel="noreferrer" href={joinUrl}>
            <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginRight: '10px', marginBottom: '10px'}} type="primary">{i18next.t("room:Join In")}</Button>
          </a>
          {
            (room.meetingNumber === "" || joinUrl === "") ? (
              <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginRight: '10px'}}>{i18next.t("room:Scan QR Code")}</Button>
            ) : (
              <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={joinUrl} />}>
                <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginRight: '10px'}}>{i18next.t("room:Scan QR Code")}</Button>
              </Tooltip>
            )
          }
          <Button icon={<VideoCameraOutlined />} style={{marginRight: '10px'}} type="primary" danger onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>{i18next.t("room:Watch Live")}</Button>
        </div>
      )
    }
  }

  renderCardMobile(logo, link, title, desc, time, isSingle, index, room, isAdmin, startUrl, joinUrl) {
    const gridStyle = {
      width: '100vw',
      textAlign: 'center',
      cursor: 'pointer',
    };

    return (
      <Card.Grid style={gridStyle}>
        <img src={logo} alt="logo" height={60} style={{marginBottom: '20px', padding: '10px'}}/>
        <Meta
          title={title}
          description={desc}
        />
      </Card.Grid>
    )
  }

  renderCard(logo, link, title, desc, time, isSingle, index, room, isAdmin, startUrl, joinUrl) {
    return (
      <Col style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px", marginBottom: "20px"}} span={6}>
        <Card
          hoverable
          cover={
            <img alt="logo" src={logo} style={{width: "100%", height: "210px", objectFit: "scale-down", padding: "10px"}} />
          }
          style={isSingle ? {width: "400px", cursor: "default"} : {width: "100%", cursor: "default"}}
        >
          <Meta title={title} description={desc} />
          <br/>
          <Meta title={""} description={time} />
          <br/>
          <br/>
          {
            this.renderButtons(index, room, startUrl, joinUrl)
          }
        </Card>
      </Col>
    )
  }

  render() {
    const index = this.props.index;
    const room = this.props.room;
    const isAdmin = Setting.isAdminUser(this.props.account);

    const startUrl = room.startUrl;
    const participant = room.participants.filter(participant => participant.name === this.props.account.name)[0];
    const joinUrl = participant === undefined ? "" : participant.joinUrl;

    if (Setting.isMobile()) {
      return this.renderCardMobile(this.props.logo, this.props.link, this.props.title, this.props.desc, this.props.time, this.props.isSingle, index, room, isAdmin, startUrl, joinUrl);
    } else {
      return this.renderCard(this.props.logo, this.props.link, this.props.title, this.props.desc, this.props.time, this.props.isSingle, index, room, isAdmin, startUrl, joinUrl);
    }
  }
}

export default withRouter(RoomCard);
