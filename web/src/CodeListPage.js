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
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as CodeBackend from "./backend/CodeBackend";
import i18next from "i18next";

class CodeListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      codes: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getCodes();
  }

  getCodes() {
    CodeBackend.getCodes(this.props.account.name)
      .then((res) => {
        this.setState({
          codes: res,
        });
      });
  }

  newCode() {
    return {
      owner: this.props.account.name,
      name: `code_${this.state.codes.length}`,
      createdTime: moment().format(),
      displayName: `New Code - ${this.state.codes.length}`,
      notebook: "code",
    }
  }

  addCode() {
    const newCode = this.newCode();
    CodeBackend.addCode(newCode)
      .then((res) => {
          Setting.showMessage("success", `Code added successfully`);
          this.setState({
            codes: Setting.prependRow(this.state.codes, newCode),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Code failed to add: ${error}`);
      });
  }

  deleteCode(i) {
    CodeBackend.deleteCode(this.state.codes[i])
      .then((res) => {
          Setting.showMessage("success", `Code deleted successfully`);
          this.setState({
            codes: Setting.deleteRow(this.state.codes, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Code failed to delete: ${error}`);
      });
  }

  renderTable(codes) {
    const columns = [
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/codes/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: i18next.t("general:Display name"),
        dataIndex: 'displayName',
        key: 'displayName',
        width: '300px',
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      {
        title: i18next.t("code:Notebook"),
        dataIndex: 'notebook',
        key: 'notebook',
        // width: '120px',
        sorter: (a, b) => a.notebook.localeCompare(b.notebook),
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: 'action',
        key: 'action',
        width: '170px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/code/${record.name}`)}>{i18next.t("general:Edit")}</Button>
              <Popconfirm
                title={`Sure to delete code: ${record.name} ?`}
                onConfirm={() => this.deleteCode(index)}
                okText="OK"
                cancelText="Cancel"
              >
                <Button style={{marginBottom: '10px'}} type="danger">{i18next.t("general:Delete")}</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={codes} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   {i18next.t("general:Code")}&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addCode.bind(this)}>{i18next.t("general:Add")}</Button>
                 </div>
               )}
               loading={codes === null}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.renderTable(this.state.codes)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CodeListPage;
