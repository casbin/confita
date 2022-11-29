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
import {DeleteOutlined, DownOutlined, UpOutlined} from "@ant-design/icons";
import {Button, Col, DatePicker, Input, Row, Select, Table, TimePicker, Tooltip} from "antd";
import * as Setting from "./Setting";
import i18next from "i18next";
import moment from "moment/moment";

const {Option} = Select;

class SlotTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  updateTable(table) {
    this.props.onUpdateTable(table);
  }

  parseField(key, value) {
    if ([].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateField(table, index, key, value) {
    value = this.parseField(key, value);

    table[index][key] = value;
    this.updateTable(table);
  }

  addRow(table) {
    const row = {type: "Oral", date: "2022-11-14", startTime: "15:00", endTime: "16:00", title: "The title", speaker: "Alice", location: "CA"};
    if (table === undefined) {
      table = [];
    }
    table = Setting.addRow(table, row);
    this.updateTable(table);
  }

  deleteRow(table, i) {
    table = Setting.deleteRow(table, i);
    this.updateTable(table);
  }

  upRow(table, i) {
    table = Setting.swapRow(table, i - 1, i);
    this.updateTable(table);
  }

  downRow(table, i) {
    table = Setting.swapRow(table, i, i + 1);
    this.updateTable(table);
  }

  renderTable(table) {
    const columns = [
      {
        title: i18next.t("general:No."),
        dataIndex: "no",
        key: "no",
        width: "60px",
        render: (text, record, index) => {
          return (index + 1);
        },
      },
      {
        title: i18next.t("submission:Type"),
        dataIndex: "type",
        key: "type",
        width: "100px",
        render: (text, record, index) => {
          // https://support.zoom.us/hc/en-us/articles/360040324512-Roles-in-a-meeting
          return (
            <Select virtual={false} style={{width: "100%"}} value={text} onChange={(value => {
              this.updateField(table, index, "type", value);
            })}>
              {
                [
                  {id: "Plenary", name: "Plenary"},
                  {id: "Oral", name: "Oral"},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          );
        },
      },
      {
        title: i18next.t("room:Date"),
        dataIndex: "date",
        key: "date",
        width: "140px",
        render: (text, record, index) => {
          return (
            <DatePicker defaultValue={moment(text, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateField(table, index, "date", timeString);
            }} />
          );
        },
      },
      {
        title: i18next.t("room:Start time"),
        dataIndex: "startTime",
        key: "startTime",
        width: "100px",
        render: (text, record, index) => {
          return (
            <TimePicker value={moment(text, "HH:mm")} format={"HH:mm"} onChange={(time, timeString) => {
              this.updateField(table, index, "startTime", timeString);
            }} />
          );
        },
      },
      {
        title: i18next.t("room:End time"),
        dataIndex: "endTime",
        key: "endTime",
        width: "100px",
        render: (text, record, index) => {
          return (
            <TimePicker value={moment(text, "HH:mm")} format={"HH:mm"} onChange={(time, timeString) => {
              this.updateField(table, index, "endTime", timeString);
            }} />
          );
        },
      },
      {
        title: i18next.t("submission:Title"),
        dataIndex: "title",
        key: "title",
        // width: "150px",
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(table, index, "title", e.target.value);
            }} />
          );
        },
      },
      {
        title: i18next.t("room:Speaker"),
        dataIndex: "speaker",
        key: "speaker",
        width: "300px",
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(table, index, "speaker", e.target.value);
            }} />
          );
        },
      },
      // {
      //   title: i18next.t("room:Location"),
      //   dataIndex: "location",
      //   key: "location",
      //   width: "70px",
      //   render: (text, record, index) => {
      //     return (
      //       <Input value={text} onChange={e => {
      //         this.updateField(table, index, "location", e.target.value);
      //       }} />
      //     );
      //   },
      // },
      {
        title: i18next.t("room:Video URL"),
        dataIndex: "videoUrl",
        key: "videoUrl",
        width: "200px",
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(table, index, "videoUrl", e.target.value);
            }} />
          );
        },
      },
      {
        title: i18next.t("general:Action"),
        key: "action",
        width: "100px",
        render: (text, record, index) => {
          return (
            <div>
              <Tooltip placement="bottomLeft" title={"Up"}>
                <Button style={{marginRight: "5px"}} disabled={index === 0} icon={<UpOutlined />} size="small" onClick={() => this.upRow(table, index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title={"Down"}>
                <Button style={{marginRight: "5px"}} disabled={index === table.length - 1} icon={<DownOutlined />} size="small" onClick={() => this.downRow(table, index)} />
              </Tooltip>
              <Tooltip placement="topLeft" title={"Delete"}>
                <Button icon={<DeleteOutlined />} size="small" onClick={() => this.deleteRow(table, index)} />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <Table rowKey="index" columns={columns} dataSource={table} size="middle" bordered pagination={false}
        title={() => (
          <div>
            {this.props.title}&nbsp;&nbsp;&nbsp;&nbsp;
            <Button style={{marginRight: "5px"}} type="primary" size="small" onClick={() => this.addRow(table)}>{i18next.t("general:Add")}</Button>
          </div>
        )}
      />
    );
  }

  render() {
    return (
      <div>
        <Row style={{marginTop: "20px"}} >
          <Col span={24}>
            {
              this.renderTable(this.props.table)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default SlotTable;
