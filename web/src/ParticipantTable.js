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
import {Button, Col, Row, Select, Table, Tooltip} from 'antd';
import * as Setting from "./Setting";
import i18next from "i18next";
import * as UserBackend from "./backend/UserBackend";
import copy from "copy-to-clipboard";

const { Option } = Select;

class ParticipantTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      users: [],
    };
  }

  componentWillMount() {
    this.getUsers();
  }

  getUsers() {
    UserBackend.getUsers()
      .then((res) => {
        this.setState({
          users: res,
        });
      });
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
    let row = {name: `Please select a user - ${table.length}`, displayName: "", affiliation: "", email: "", tag: "", role: "Participant", joinUrl: ""};
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
        width: '70px',
        render: (text, record, index) => {
          return (index + 1);
        }
      },
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '300px',
        render: (text, record, index) => {
          return (
            <Select virtual={false} showSearch optionFilterProp="label" style={{width: '100%'}} value={text} placeholder="Please select user" onChange={name => {
              const user = this.state.users.filter(user => user.name === name)[0];
              if (user !== undefined) {
                this.updateField(table, index, 'name', user.name);
                this.updateField(table, index, 'displayName', user.displayName);
                this.updateField(table, index, 'email', user.email);
                this.updateField(table, index, 'affiliation', user.affiliation);
                this.updateField(table, index, 'tag', user.tag);
              }
            }}
                    filterOption={(input, option) =>
                      option.key.indexOf(input) >= 0 || option.displayName.indexOf(input) >= 0
                    }
            >
              {
                this.state.users.filter(user => true).map((user, index) => <Option key={user.name} displayName={user.displayName}>{`${user.displayName} (${user.name})`}</Option>)
              }
            </Select>
          )
          // return `${record.displayName} (${record.name})`;
        }
      },
      {
        title: i18next.t("payment:Affiliation"),
        dataIndex: 'affiliation',
        key: 'affiliation',
        // width: '250px',
      },
      {
        title: i18next.t("general:Email"),
        dataIndex: 'email',
        key: 'email',
        width: '250px',
      },
      {
        title: i18next.t("payment:Tag"),
        dataIndex: 'tag',
        key: 'tag',
        width: '150px',
      },
      {
        title: i18next.t("room:Role"),
        dataIndex: 'role',
        key: 'role',
        width: '150px',
        render: (text, record, index) => {
          // https://support.zoom.us/hc/en-us/articles/360040324512-Roles-in-a-meeting
          return (
            <Select virtual={false} style={{width: '100%'}} value={text} onChange={(value => {
              this.updateField(table, index, 'role', value);
            })}>
              {
                [
                  {id: 'Host', name: 'Host'},
                  {id: 'Co-host', name: 'Co-host'},
                  {id: 'Participant', name: 'Participant'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          )
        }
      },
      {
        title: i18next.t("room:Join In"),
        dataIndex: 'joinUrl',
        key: 'joinUrl',
        width: '250px',
        render: (text, record, index) => {
          return (
            <div>
              <a target="_blank" rel="noreferrer" href={text}>
                <Button disabled={record.joinUrl === ""} style={{marginRight: "5px"}} type="primary" size="small">{i18next.t("room:Join In")}</Button>
              </a>
              <Button disabled={record.joinUrl === ""} style={{marginRight: "5px"}} size="small" onClick={() => {
                copy(text);
                Setting.showMessage("success", `Meeting link copied to clipboard successfully`);
              }}>{i18next.t("room:Copy Meeting Link")}</Button>
            </div>
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
                 <Button style={{marginRight: "5px"}} type="primary" size="small" onClick={() => this.addRow(table)}>{i18next.t("general:Add")}</Button>
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
