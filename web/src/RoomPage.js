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
import {Col, Row} from "antd";
import * as RoomBackend from "./backend/RoomBackend";
import * as Setting from "./Setting";
import Video from "./Video";
import i18next from "i18next";
import * as Conf from "./Conf";

class RoomPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      userName: props.match?.params.userName,
      roomName: props.match?.params.roomName,
      room: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getRoom();
  }

  getRoom() {
    RoomBackend.getRoom(this.state.userName, this.state.roomName)
      .then((room) => {
        this.setState({
          room: room,
        });
      });
  }

  getPropsOrStateRoom() {
    return this.props.room !== undefined ? this.props.room : this.state.room;
  }

  getRoomTitle(room) {
    let type;
    if (room.isLive) {
      type = i18next.t("room:Live");
    } else if (room.videoUrl !== "") {
      type = i18next.t("room:Playback");
    } else {
      type = i18next.t("room:No Content");
    }

    return `${room.displayName} (${type})`;
  }

  renderVideo(room) {
    return (
      <div style={{marginTop: "10px", textAlign: "center"}}>
        <div style={{fontSize: 30, marginBottom: "20px"}}>
          {
            this.getRoomTitle(room)
          }
        </div>
        <Video room={room} />
      </div>
    )
  }

  renderComments() {
    if (this.state.room === null) {
      return null;
    }

    const nodeId = `comments-${Conf.DefaultConferenceName}`;
    const title = encodeURIComponent(`Comments - ${this.state.room.displayName}`);
    const author = (this.props.account === null) ? "admin" : this.props.account.name;
    const urlPath = encodeURIComponent(`|comment|${this.state.room.displayName}`);

    let accessToken;
    if (this.props.account === null) {
      // Confita is signed out, also sign out Casnode.
      accessToken = "signout";
    } else {
      accessToken = this.props.account.accessToken;
    }

    const width = !Setting.isMobile() ? `${this.state.room.videoWidth}px` : "100%";

    return (
      <iframe
        key={title}
        title={title}
        style={{border: "1px solid rgb(232,232,232)", width: width, height: "100vh"}}
        src={`${Conf.CasnodeEndpoint}/embedded-replies?nodeId=${nodeId}&title=${title}&author=${author}&urlPath=${urlPath}&accessToken=${accessToken}`}
      />
    )
  }

  render() {
    const room = this.getPropsOrStateRoom();
    if (room === null) {
      return null;
    }

    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={!Setting.isMobile() ? 1 : 0}>
          </Col>
          <Col span={!Setting.isMobile() ? 22 : 24}>
            {
              this.renderVideo(room)
            }
            <div style={{marginTop: "20px", textAlign: "center"}}>
              {
                this.renderComments()
              }
            </div>
          </Col>
          <Col span={!Setting.isMobile() ? 1 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RoomPage;
