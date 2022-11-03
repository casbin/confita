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
import {Button, Card, Col, Popconfirm, Spin, Tag, Tooltip} from "antd";
import {ClockCircleOutlined, PlayCircleOutlined, SyncOutlined, VideoCameraOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";
import i18next from "i18next";
import QrCode from "./QrCode";
import Slot from "./Slot";

const {Meta} = Card;

class RoomCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      nowTime: new Date(),
    };
  }

  UNSAFE_componentWillMount() {
    if (!Setting.isAdminUser(this.props.account) && this.props.room.meetingNumber !== "" && this.getJoinUrl() === "") {
      this.registerRoom(this.props.index);
    }

    this.setTimer();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setTimer() {
    const handler = () => {
      this.setState({
        nowTime: new Date(),
      });
    };
    this.interval = setInterval(handler, 1000);
  }

  registerRoom(index) {
    this.props.onRegisterRoom(index);
  }

  getJoinUrl() {
    if (this.props.account === null) {
      return "(anonymous)";
    }

    const room = this.props.room;
    const participant = room.participants.filter(participant => participant.name === this.props.account.name)[0];
    return participant === undefined ? "" : participant.joinUrl;
  }

  renderButtons(index, room) {
    const startUrl = room.startUrl;
    const joinUrl = this.getJoinUrl();

    if (Setting.isAdminUser(this.props.account)) {
      return (
        <div style={{textAlign: "center"}}>
          <a target="_blank" rel="noreferrer" href={startUrl}>
            <Button disabled={startUrl === ""} style={{marginRight: "10px", marginBottom: "10px"}} danger>{i18next.t("room:Join In")}</Button>
          </a>
          {
            Setting.isMobile() ? null : (
              (startUrl === "") ? (
                <Button disabled={startUrl === ""} style={{marginRight: "10px", marginBottom: "10px"}} danger>{i18next.t("room:Scan QR Code")}</Button>
              ) : (
                <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={startUrl} />}>
                  <Button disabled={startUrl === ""} style={{marginRight: "10px", marginBottom: "10px"}} danger>{i18next.t("room:Scan QR Code")}</Button>
                </Tooltip>
              )
            )
          }
          <Button disabled={!room.isLive} icon={<VideoCameraOutlined />} style={{marginRight: "10px", marginBottom: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>
            {i18next.t("room:Watch Live")}
            {Setting.getRoomLiveUserCount(room)}
          </Button>
          <Button disabled={room.isLive || room.videoUrl === ""} icon={<PlayCircleOutlined />} style={{marginRight: "10px", marginBottom: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>{i18next.t("room:Watch Playback")}</Button>
          <Button style={{marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}`)}>{i18next.t("general:Edit")}</Button>
          <Popconfirm
            title={`Sure to delete room: ${room.name} ?`}
            onConfirm={() => this.deleteRoom(index)}
            okText="OK"
            cancelText="Cancel"
          >
            <Button type="danger">{i18next.t("general:Delete")}</Button>
          </Popconfirm>
        </div>
      );
    } else {
      return (
        <div style={{textAlign: "center"}}>
          {
            this.props.account === null ? null : (
              <React.Fragment>
                <a target="_blank" rel="noreferrer" href={joinUrl}>
                  <Button disabled={room.meetingNumber === "" || joinUrl === "" || joinUrl === "(anonymous)"} style={{marginRight: "10px", marginBottom: "10px"}} type="primary" >{i18next.t("room:Join In")}</Button>
                </a>
                {
                  Setting.isMobile() ? null : (
                    (room.meetingNumber === "" || joinUrl === "" || joinUrl === "(anonymous)") ? (
                      <Button disabled={room.meetingNumber === "" || joinUrl === "" || joinUrl === "(anonymous)"} style={{marginRight: "10px", marginBottom: "10px"}}>{i18next.t("room:Scan QR Code")}</Button>
                    ) : (
                      <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={joinUrl} />}>
                        <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginRight: "10px", marginBottom: "10px"}}>{i18next.t("room:Scan QR Code")}</Button>
                      </Tooltip>
                    )
                  )
                }
              </React.Fragment>
            )
          }
          <Button disabled={!room.isLive} icon={<VideoCameraOutlined />} style={{marginRight: "10px", marginBottom: "10px"}} type="primary" danger onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>
            {i18next.t("room:Watch Live")}
            {Setting.getRoomLiveUserCount(room)}
          </Button>
          <Button disabled={room.isLive || room.videoUrl === ""} icon={<PlayCircleOutlined />} style={{marginRight: "10px", marginBottom: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>{i18next.t("room:Watch Playback")}</Button>
        </div>
      );
    }
  }

  renderSlotState(slotState) {
    if (slotState === "LIVE") {
      return (
        <Tag icon={<SyncOutlined spin />} color="error">
          {slotState}
        </Tag>
      );
    } else if (slotState === "NEXT") {
      return (
        <Tag icon={<ClockCircleOutlined />} color="default">
          {slotState}
        </Tag>
      );
    } else {
      return null;
    }
  }

  renderCardMobile(logo, link, title, desc, time, slotState, isSingle, index, room) {
    const gridStyle = {
      width: "100vw",
      textAlign: "center",
      cursor: "pointer",
    };

    return (
      <Card.Grid style={gridStyle}>
        <img src={logo} alt="logo" height={60} style={{marginBottom: "20px", padding: "0px"}} />
        <Meta title={Setting.getLanguageText(title)} description={
          <span style={{fontWeight: "bold", color: "rgb(90,90,90)"}}>
            {this.renderSlotState(slotState)}
            {desc}
          </span>
        } />
        <br />
        <Meta title={""} description={time} />
        <br />
        {
          this.renderButtons(index, room)
        }
      </Card.Grid>
    );
  }

  renderCard(logo, link, title, desc, time, slotState, isSingle, index, room) {
    return (
      <Col style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px", marginBottom: "20px"}} span={6}>
        <Card
          hoverable
          cover={
            <img alt="logo" src={logo} style={{width: "100%", height: "210px", objectFit: "scale-down", padding: "20px"}} />
          }
          style={isSingle ? {width: "420px", cursor: "default"} : {width: "22vw", cursor: "default"}}
        >
          <Meta title={Setting.getLanguageText(title)} description={
            <span style={{fontWeight: "bold", color: "rgb(90,90,90)"}}>
              {this.renderSlotState(slotState)}
              {desc}
            </span>
          } />
          <br />
          <Meta title={""} description={time} />
          <br />
          <br />
          {
            this.renderButtons(index, room)
          }
          <Slot slots={room.slots} />
        </Card>
      </Col>
    );
  }

  getSlotTimeDiff(slot, key) {
    // 2022-05-15T23:04:00+08:00
    const slotTime = `${slot.date}T${slot[key]}:00+08:00`;
    return new Date(Date.parse(slotTime)) - this.state.nowTime;
  }

  getTargetSlot(room) {
    for (let i = 0; i < room.slots.length; i++) {
      const slot = room.slots[i];
      const startDiff = this.getSlotTimeDiff(slot, "startTime");
      const endDiff = this.getSlotTimeDiff(slot, "endTime");
      if (startDiff > 0) {
        return [slot, "NEXT"];
      } else {
        if (endDiff > 0) {
          return [slot, "LIVE"];
        }
      }
    }
    return [null, ""];
  }

  renderContent() {
    const index = this.props.index;
    const room = this.props.room;

    const arr = this.getTargetSlot(room);
    const slot = arr[0];
    const slotState = arr[1];

    let desc = this.props.desc;
    let time = this.props.time;
    if (slot !== null) {
      desc = slot.title;
      time = slot.speaker;
    }

    if (Setting.isMobile()) {
      return this.renderCardMobile(this.props.logo, this.props.link, this.props.title, desc, time, slotState, this.props.isSingle, index, room);
    } else {
      return this.renderCard(this.props.logo, this.props.link, this.props.title, desc, time, slotState, this.props.isSingle, index, room);
    }
  }

  render() {
    return (
      <Spin spinning={this.getJoinUrl() === "" && this.props.room.meetingNumber !== "123456789" && this.props.room.startUrl !== ""} size="large" tip={i18next.t("room:Joining...")} style={{paddingTop: "10%"}} >
        {
          this.renderContent()
        }
      </Spin>
    );
  }
}

export default withRouter(RoomCard);
