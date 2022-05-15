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
import { LiveKitRoom } from 'livekit-react';
import 'livekit-react/dist/index.css';
import "react-aspect-ratio/aspect-ratio.css";

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      userName: props.match?.params.userName,
      roomName: props.match?.params.roomName,
      room: null,
    };
  }

  componentWillMount() {
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

  getAccountToken(room) {
    const participant = room.participants.filter(participant => participant.name === this.props.account.name)[0];
    if (participant === undefined) {
      return "";
    }

    return participant.token;
  }

  renderRoom() {
    const room = this.props.room !== undefined ? this.props.room : this.state.room;
    if (room === null) {
      return null;
    }

    const onConnected = (room) => {
      room.localParticipant.setCameraEnabled(true);
      room.localParticipant.setMicrophoneEnabled(true);
    };

    const token = this.getAccountToken(room);

    return (
      <div className="roomContainer">
        <LiveKitRoom url={room.serverUrl} token={token} onConnected={room => onConnected(room)}/>
      </div>
    )
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
          <Col span={!Setting.isMobile() ? 18 : 24}>
            {
              this.renderRoom()
            }
          </Col>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Room;
