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

  getPropsOrStateRoom() {
    return this.props.room !== undefined ? this.props.room : this.state.room;
  }

  renderVideo(room) {
    return (
      <div style={{marginTop: "10px", textAlign: "center"}}>
        <div style={{fontSize: 30, marginBottom: "20px"}}>
          {
            this.state.room.displayName
          }
        </div>
        <Video room={room} />
      </div>
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
          </Col>
          <Col span={!Setting.isMobile() ? 1 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RoomPage;
