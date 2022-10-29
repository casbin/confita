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
import {Link} from "react-router-dom";
import {Button, Card, Col, Modal, Popconfirm, Row, Switch, Table, Tooltip} from "antd";
import {CloseCircleTwoTone, PlayCircleOutlined, VideoCameraOutlined} from "@ant-design/icons";
import moment from "moment";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import * as RoomBackend from "./backend/RoomBackend";
import i18next from "i18next";
import QrCode from "./QrCode";
import RoomCard from "./RoomCard";
import * as PaymentBackend from "./backend/PaymentBackend";

class RoomListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      rooms: null,
      payments: null,
      isRoomCalendar: !Setting.isAdminUser(this.props.account) ? true : Setting.getIsRoomCalendar(),
    };
  }

  UNSAFE_componentWillMount() {
    this.getGlobalRooms();
    if (!this.props.isPublic) {
      this.getPayments();
    }
  }

  getGlobalRooms() {
    RoomBackend.getGlobalRooms(this.props.isPublic)
      .then((res) => {
        this.setState({
          rooms: res,
        });
      });
  }

  getPayments() {
    PaymentBackend.getPayments(this.props.account.name)
      .then((payments) => {
        this.setState({
          payments: payments.filter(payment => payment.state === "Paid"),
        });
      });
  }

  newRoom() {
    return {
      owner: this.props.account.name,
      name: `room_${this.state.rooms.length}`,
      createdTime: moment().format(),
      displayName: `New Room - ${this.state.rooms.length}`,
      conference: Conf.DefaultConferenceName,
      speaker: "Alice",
      Date: "2022-03-21",
      startTime: "09:30",
      endTime: "11:30",
      location: "City Town",
      imageUrl: "https://cdn.casbin.com/casdoor/resource/built-in/admin/picture.jpg",
      meetingNumber: "123456789",
      passcode: "123456",
      inviteLink: "https://zoom.us/j/123456789?pwd=123456",
      participants: [],
      slots: [],
      status: "Ended",
      isPublic: false,
      ingestDomain: "",
      ingestAuthKey: "",
      streamingDomain: "",
      streamingAuthKey: "",
      videoWidth: 1280,
      videoHeight: 720,
      isLive: false,
      liveUserCount: 0,
      viewerCount: 0,
    };
  }

  addRoom() {
    const newRoom = this.newRoom();
    RoomBackend.addRoom(newRoom)
      .then((res) => {
        Setting.showMessage("success", "Room added successfully");
        this.setState({
          rooms: Setting.prependRow(this.state.rooms, newRoom),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Room failed to add: ${error}`);
      });
  }

  deleteRoom(i) {
    RoomBackend.deleteRoom(this.state.rooms[i])
      .then((res) => {
        Setting.showMessage("success", "Room deleted successfully");
        this.setState({
          rooms: Setting.deleteRow(this.state.rooms, i),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Room failed to delete: ${error}`);
      });
  }

  registerRoom(i) {
    const room = this.state.rooms[i];
    RoomBackend.registerRoom("admin", room.name)
      .then((room) => {
        this.getGlobalRooms();
      });
  }

  renderTable(rooms) {
    const columns = [
      // {
      //   title: i18next.t("general:Owner"),
      //   dataIndex: 'owner',
      //   key: 'owner',
      //   width: '70px',
      //   sorter: (a, b) => a.owner.localeCompare(b.owner),
      //   render: (text, record, index) => {
      //     return (
      //       <a target="_blank" rel="noreferrer" href={Setting.getUserProfileUrl(text)}>
      //         {text}
      //       </a>
      //     )
      //   }
      // },
      {
        title: i18next.t("general:Name"),
        dataIndex: "name",
        key: "name",
        width: "90px",
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/rooms/${record.owner}/${text}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: i18next.t("general:Display name"),
        dataIndex: "displayName",
        key: "displayName",
        width: "120px",
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      // {
      //   title: i18next.t("submission:Conference"),
      //   dataIndex: 'conference',
      //   key: 'conference',
      //   width: '110px',
      //   sorter: (a, b) => a.conference.localeCompare(b.conference),
      //   render: (text, record, index) => {
      //     if (Setting.isAdminUser(this.props.account)) {
      //       return (
      //         <Link to={`/conferences/${text}`}>
      //           {text}
      //         </Link>
      //       )
      //     } else {
      //       return text;
      //     }
      //   }
      // },
      // {
      //   title: i18next.t("general:Created time"),
      //   dataIndex: 'createdTime',
      //   key: 'createdTime',
      //   width: '110px',
      //   sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
      //   render: (text, record, index) => {
      //     return Setting.getFormattedDate(text);
      //   }
      // },
      {
        title: i18next.t("room:Speaker"),
        dataIndex: "speaker",
        key: "speaker",
        width: "250px",
        sorter: (a, b) => a.speaker.localeCompare(b.speaker),
      },
      {
        title: i18next.t("room:Date"),
        dataIndex: "date",
        key: "date",
        width: "80px",
        sorter: (a, b) => a.date.localeCompare(b.date),
      },
      {
        title: i18next.t("room:Time"),
        dataIndex: "time",
        key: "time",
        width: "90px",
        sorter: (a, b) => a.time.localeCompare(b.time),
        render: (text, record, index) => {
          return `${record.startTime} - ${record.endTime}`;
        },
      },
      {
        title: i18next.t("room:Location"),
        dataIndex: "location",
        key: "location",
        width: "120px",
        sorter: (a, b) => a.location.localeCompare(b.location),
      },
      {
        title: i18next.t("room:Meeting No."),
        dataIndex: "meetingNumber",
        key: "meetingNumber",
        width: "120px",
        sorter: (a, b) => a.meetingNumber.localeCompare(b.meetingNumber),
      },
      {
        title: i18next.t("room:Passcode"),
        dataIndex: "passcode",
        key: "passcode",
        width: "80px",
        sorter: (a, b) => a.passcode.localeCompare(b.passcode),
      },
      {
        title: i18next.t("general:Status"),
        dataIndex: "status",
        key: "status",
        width: "90px",
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (text, record, index) => {
          if (text === "Started") {
            return i18next.t("room:Started");
          } else if (text === "Ended") {
            return i18next.t("room:Ended");
          } else if (text === "Hidden") {
            return i18next.t("room:Hidden");
          } else {
            return text;
          }
        },
      },
      {
        title: i18next.t("room:Is public"),
        dataIndex: "isPublic",
        key: "isPublic",
        width: "90px",
        sorter: (a, b) => a.isPublic - b.isPublic,
        render: (text, record, index) => {
          return (
            <Switch checked={text} disabled={true} />
          );
        },
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: "action",
        key: "action",
        width: "270px",
        render: (text, room, index) => {
          const startUrl = room.startUrl;
          const participant = room.participants.filter(participant => participant.name === this.props.account.name)[0];
          const joinUrl = participant === undefined ? "" : participant.joinUrl;

          if (Setting.isAdminUser(this.props.account)) {
            return (
              <div>
                <a target="_blank" rel="noreferrer" href={startUrl}>
                  <Button disabled={startUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} danger>{i18next.t("room:Join In")}</Button>
                </a>
                {
                  (startUrl === "") ? (
                    <Button disabled={startUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} danger>{i18next.t("room:Scan QR Code")}</Button>
                  ) : (
                    <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={startUrl} />}>
                      <Button disabled={startUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} danger>{i18next.t("room:Scan QR Code")}</Button>
                    </Tooltip>
                  )
                }
                <Button disabled={!room.isLive} icon={<VideoCameraOutlined />} style={{marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>
                  {i18next.t("room:Watch Live")}
                  {Setting.getRoomLiveUserCount(room)}
                </Button>
                <Button disabled={room.isLive || room.videoUrl === ""} icon={<PlayCircleOutlined />} style={{marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>{i18next.t("room:Watch Playback")}</Button>
                <Button style={{marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}`)}>{i18next.t("general:Edit")}</Button>
                <Popconfirm
                  title={`Sure to delete room: ${room.name} ?`}
                  onConfirm={() => this.deleteRoom(index)}
                  okText="OK"
                  cancelText="Cancel"
                >
                  <Button style={{marginBottom: "10px"}} type="danger">{i18next.t("general:Delete")}</Button>
                </Popconfirm>
              </div>
            );
          } else {
            return (
              <div>
                {
                  joinUrl !== "" ? null : (
                    <Button disabled={room.meetingNumber === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.registerRoom(index)}>
                      {i18next.t("room:Register")}
                    </Button>
                  )
                }
                <a target="_blank" rel="noreferrer" href={joinUrl}>
                  <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} type="primary">{i18next.t("room:Join In")}</Button>
                </a>
                {
                  (room.meetingNumber === "" || joinUrl === "") ? (
                    <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}}>{i18next.t("room:Scan QR Code")}</Button>
                  ) : (
                    <Tooltip placement="topLeft" color={"rgb(0,0,0,0)"} title={<QrCode url={joinUrl} />}>
                      <Button disabled={room.meetingNumber === "" || joinUrl === ""} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}}>{i18next.t("room:Scan QR Code")}</Button>
                    </Tooltip>
                  )
                }
                <Button disabled={!room.isLive} icon={<VideoCameraOutlined />} style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/rooms/${room.owner}/${room.name}/view`)}>
                  {i18next.t("room:Watch Live")}
                  {Setting.getRoomLiveUserCount(room)}
                </Button>
              </div>
            );
          }
        },
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={rooms} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
          title={() => (
            <div>
              {
                this.props.isPublic ? i18next.t("general:Public Rooms") :
                  i18next.t("general:Rooms")
              }&nbsp;&nbsp;&nbsp;&nbsp;
              {
                !Setting.isAdminUser(this.props.account) ? null : (
                  <React.Fragment>
                    <Button type="primary" size="small" onClick={this.addRoom.bind(this)}>{i18next.t("general:Add")}</Button>
                         &nbsp;&nbsp;&nbsp;&nbsp;
                    {
                      this.renderCalendarModeSwitch()
                    }
                  </React.Fragment>
                )
              }
            </div>
          )}
          loading={rooms === null}
        />
      </div>
    );
  }

  renderCalendarModeSwitch() {
    return (
      <React.Fragment>
        {i18next.t("room:Calendar mode")}:
        &nbsp;
        <Switch checked={this.state.isRoomCalendar} onChange={(checked, e) => {
          this.setState({
            isRoomCalendar: checked,
          });
          Setting.setIsRoomCalendar(checked);
        }} />
      </React.Fragment>
    );
  }

  renderCard(index, room, isSingle) {
    return (
      <RoomCard logo={room.imageUrl} link={room.startUrl} title={room.displayName} desc={room.speaker} time={`${room.startTime} - ${room.endTime}, ${room.location}`} isSingle={isSingle} key={room.name} index={index} room={room} account={this.props.account} onRegisterRoom={(i) => {this.registerRoom(i);}} />
    );
  }

  renderCards() {
    const rooms = this.state.rooms;
    if (rooms === null) {
      return null;
    }

    const isSingle = rooms.length === 1;

    if (Setting.isMobile()) {
      return (
        <Card bodyStyle={{padding: 0}}>
          {
            rooms.map((room, i) => {
              return this.renderCard(i, room, isSingle);
            })
          }
        </Card>
      );
    } else {
      return (
        <div style={{marginRight: "15px", marginLeft: "15px"}}>
          <Row style={{marginLeft: "-20px", marginRight: "-20px", marginTop: "20px"}} gutter={24}>
            {
              rooms.map((room, i) => {
                return this.renderCard(i, room, isSingle);
              })
            }
          </Row>
        </div>
      );
    }
  }

  renderCalendar() {
    return (
      <React.Fragment>
        {
          !Setting.isAdminUser(this.props.account) ? null : (
            <React.Fragment>
              {
                this.renderCalendarModeSwitch()
              }
              <br />
            </React.Fragment>
          )
        }
        <Row style={{width: "100%"}}>
          <Col span={24} style={{display: "flex", justifyContent: "center"}} >
            {
              this.renderCards()
            }
          </Col>
        </Row>
      </React.Fragment>
    );
  }

  renderPaymentModal() {
    if (!Conf.isPaymentRequired) {
      return null;
    }

    if (this.state.payments === null) {
      return null;
    }

    if (Setting.isEditorUser(this.props.account) || Setting.isCommitteeUser(this.props.account) || Setting.isAdminUser(this.props.account)) {
      return null;
    }

    if (this.state.payments.filter(payment => payment.productName.includes("_online_") || payment.productName.includes("_early_")).length > 0) {
      return null;
    }

    const handleOk = () => {
      this.props.history.push("/payments");
    };

    return (
      <Modal
        title={
          <div>
            <CloseCircleTwoTone twoToneColor="rgb(255,77,79)" />
            {" " + i18next.t("room:You need to pay first to enter meeting rooms")}
          </div>
        }
        visible={true}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        onOk={handleOk}
        onCancel={() => {}}
        okText={i18next.t("room:Go to Pay")}
        closable={false}
      >
        <div>
          {i18next.t("room:In the 'Payments' page, please select the 'Online Participation Rate` tier (2nd row) to be able to access the online meeting rooms.")}
        </div>
      </Modal>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={24}>
            {
              this.state.isRoomCalendar ? this.renderCalendar() : this.renderTable(this.state.rooms)
            }
          </Col>
          {
            this.renderPaymentModal()
          }
        </Row>
      </div>
    );
  }
}

export default RoomListPage;
