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
import {Button, Col, Row} from "antd";
import { SendOutlined } from '@ant-design/icons';
import * as RoomBackend from "./backend/RoomBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';

const client = ZoomMtgEmbedded.createClient();

let hasShown = false;

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      userName: props.match?.params.userName,
      roomName: props.match?.params.roomName,
      room: null,
      isConnected: false,
    };

    this.meetingSdkElement = React.createRef();
  }

  componentWillMount() {
    this.getRoom();
  }

  componentDidMount() {
    client.init({
      debug: true,
      zoomAppRoot: this.meetingSdkElement.current,
      // leaveUrl: "",
      // isSupportAV: true,
      language: Setting.getLanguage() !== "zh" ? "en-US" : "zh-CN",
      customize: {
        video: {
          isResizable: true,
          viewSizes: {
            default: {
              width: 1280,
              height: 720
            },
            ribbon: {
              width: 300,
              height: 700
            }
          }
        },
        chat: {
          popper: {
            disableDraggable: true,
            // anchorElement: meetingSDKChatElement,
            placement: 'top'
          }
        },
        meetingInfo: [
          'topic',
          'host',
          'mn',
          'pwd',
          'telPwd',
          'invite',
          'participant',
          'dc',
          'enctype',
        ],
        // toolbar: {
        //   buttons: [
        //     {
        //       text: 'Custom Button',
        //       className: 'CustomButton',
        //       onClick: () => {
        //         console.log('custom button')
        //       }
        //     }
        //   ]
        // }
      }
    }).then((res) => {
      if (res !== "") {
        Setting.showMessage("error", res);
      } else {
        // this.join();
      }
    });
  }

  getParticipateName() {
    return `${this.props.account.displayName} (${this.props.account.name})`;
  }

  getParticipateEmail() {
    return this.props.account.email;
  }

  join(room) {
    client.join({
      sdkKey: room.sdkKey,
      signature: room.signature,
      meetingNumber: room.meetingNumber,
      password: room.passcode,
      userName: this.getParticipateName(),
      userEmail: this.getParticipateEmail(),
      success: (success) => {
        alert(success)
        Setting.showMessage("success", success);

        this.setState({
          isConnected: true,
        });
        // this.onGetRoom();
      },
      error: (error) => {
        alert(error)
        Setting.showMessage("error", error);
      }
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

  onGetRoom() {
    this.props.onGetRoom();
  }

  getPropsOrStateRoom() {
    return this.props.room !== undefined ? this.props.room : this.state.room;
  }

  render() {
    const room = this.getPropsOrStateRoom();
    if (room === null) {
      return null;
    }

    if (this.meetingSdkElement.current) {
      const observer = new MutationObserver((mutationList, observer) => {
        // console.log(mutationList);
        const elements = document.getElementsByClassName("zmwebsdk-MuiPaper-root");
        // console.log(`elements.length = ${elements.length}, hasShown = ${hasShown}`);
        if (elements.length !== 0) {
          hasShown = true;
        }
        if (elements.length === 0 && hasShown === true) {
          window.location.reload();
        }
      });
      observer.observe(this.meetingSdkElement.current, {attributes: true, childList: true, subtree: true});
    }

    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={!Setting.isMobile() ? 1 : 0}>
          </Col>
          <Col span={!Setting.isMobile() ? 22 : 24}>
            <div style={{width: "1284px", height: "800px", backgroundColor: "rgb(26,26,26)", borderRadius: "10px", color: "white", fontSize: 40, textAlign: "center"}} id="meetingSDKElement" ref={this.meetingSdkElement}>
              <div style={{width: "100%", textAlign: "center"}}>
                <div style={{paddingLeft: "auto", paddingTop: "300px", textAlign: "center"}}>
                  {
                    room.status === "Started" ? i18next.t("room:The current meeting has started, please join in") :
                      i18next.t("room:The current meeting has ended")
                  }
                  <div style={{fontSize: 20, marginTop: "50px"}}>
                    {/*{i18next.t("room:There are already N participants in the meeting room.").replace("N", room.participants.length)}*/}
                  </div>
                  <Button disabled={room.sdkKey === "" || room.signature === "" || room.meetingNumber === ""} style={{fontSize: 20, marginTop: "20px", paddingTop: "3px"}} loading={this.state.isConnected} type="primary" shape="round" icon={<SendOutlined />} size="large" onClick={() => {
                    this.join(room);
                  }}>{i18next.t("room:Join In")}</Button>
                </div>
              </div>
            </div>
          </Col>
          <Col span={!Setting.isMobile() ? 1 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Room;
