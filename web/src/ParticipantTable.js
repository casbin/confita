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
import {DownOutlined, DeleteOutlined, UpOutlined} from '@ant-design/icons';
import {Button, Col, Input, Row, Table, Tooltip} from 'antd';
import * as Setting from "./Setting";
import i18next from "i18next";

class ParticipantTable extends React.Component {
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
    let row = {name: `New Participant - ${table.length}`, type: "Attendee"};
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
        title: i18next.t("room:No."),
        dataIndex: 'no',
        key: 'no',
        width: '80px',
        render: (text, record, index) => {
          return (index + 1);
        }
      },
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '250px',
        render: (text, record, index) => {
          return `${record.displayName} (${record.name})`;
        }
      },
      {
        title: i18next.t("payment:Affiliation"),
        dataIndex: 'affiliation',
        key: 'affiliation',
        width: '250px',
      },
      {
        title: i18next.t("payment:Tag"),
        dataIndex: 'tag',
        key: 'tag',
        width: '250px',
      },
      // {
      //   title: i18next.t("conference:Type"),
      //   dataIndex: 'type',
      //   key: 'type',
      //   width: '250px',
      //   render: (text, record, index) => {
      //     return (
      //       <Select virtual={false} style={{width: '100%'}} value={text} onChange={(value => {
      //         this.updateField(table, index, 'type', value);
      //       })}>
      //         {
      //           [
      //             {id: 'Attendee', name: 'Attendee'},
      //             {id: 'Admin', name: 'Admin'},
      //           ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
      //         }
      //       </Select>
      //     )
      //   }
      // },
      {
        title: i18next.t("general:Status"),
        dataIndex: 'status',
        key: 'status',
        width: '250px',
      },
      {
        title: i18next.t("room:Token"),
        dataIndex: 'token',
        key: 'token',
        // width: '400px',
        render: (text, record, index) => {
          return (
            <Input value={text} onChange={e => {
              this.updateField(table, index, 'token', e.target.value);
            }} />
          )
        }
      },
      {
        title: i18next.t("general:Action"),
        key: 'action',
        width: '100px',
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
        }
      },
    ];

    return (
      <Table rowKey="index" columns={columns} dataSource={table} size="middle" bordered pagination={false}
             title={() => (
               <div>
                 {this.props.title}&nbsp;&nbsp;&nbsp;&nbsp;
                 {/*<Button style={{marginRight: "5px"}} type="primary" size="small" onClick={() => this.addRow(table)}>{i18next.t("general:Add")}</Button>*/}
               </div>
             )}
      />
    );
  }

  render() {
    return (
      <div>
        <Row style={{marginTop: '20px'}} >
          <Col span={24}>
            {
              this.renderTable(this.props.table)
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default ParticipantTable;
