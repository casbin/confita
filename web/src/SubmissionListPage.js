// Copyright 2021 The casbin Authors. All Rights Reserved.
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
import {Button, Col, List, Popconfirm, Row, Table, Tooltip} from 'antd';
import {FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";
import moment from "moment";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import * as SubmissionBackend from "./backend/SubmissionBackend";
import i18next from "i18next";

class SubmissionListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      submissions: null,
    };
  }

  componentWillMount() {
    if (Setting.isAdminUser(this.props.account) || Setting.isEditorUser(this.props.account)) {
      this.getGlobalSubmissions();
    } else {
      this.getSubmissions();
    }
  }

  getSubmissions() {
    SubmissionBackend.getSubmissions(this.props.account.name)
      .then((res) => {
        this.setState({
          submissions: res,
        });
      });
  }

  getGlobalSubmissions() {
    SubmissionBackend.getGlobalSubmissions()
      .then((res) => {
        this.setState({
          submissions: res,
        });
      });
  }

  newSubmission() {
    return {
      owner: this.props.account.name,
      name: `submission_${this.state.submissions.length}`,
      createdTime: moment().format(),
      conference: Conf.DefaultConferenceName,
      title: `New Submission - ${this.state.submissions.length}`,
      type: "Symposium",
      subType: "Default",
      authors: [{name: this.props.account.displayName, affiliation: this.props.account.affiliation, email: this.props.account.email, isNotified: true, isCorresponding: true}],
      absWordFileUrl: "",
      absPdfFileUrl: "",
      fullWordFileUrl: "",
      fullPdfFileUrl: "",
      status: "Draft",
    }
  }

  addSubmission() {
    const newSubmission = this.newSubmission();
    SubmissionBackend.addSubmission(newSubmission)
      .then((res) => {
          Setting.showMessage("success", `Submission added successfully`);
          this.setState({
            submissions: Setting.prependRow(this.state.submissions, newSubmission),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Submission failed to add: ${error}`);
      });
  }

  deleteSubmission(i) {
    SubmissionBackend.deleteSubmission(this.state.submissions[i])
      .then((res) => {
          Setting.showMessage("success", `Submission deleted successfully`);
          this.setState({
            submissions: Setting.deleteRow(this.state.submissions, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Submission failed to delete: ${error}`);
      });
  }

  renderTable(submissions) {
    const columns = [
      {
        title: i18next.t("general:Owner"),
        dataIndex: 'owner',
        key: 'owner',
        width: '70px',
        sorter: (a, b) => a.owner.localeCompare(b.owner),
        render: (text, record, index) => {
          return (
            <a target="_blank" href={Setting.getUserProfileUrl(text)}>
              {text}
            </a>
          )
        }
      },
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/submissions/${record.owner}/${text}`}>
              {text}
            </Link>
          )
        }
      },
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
        title: i18next.t("submission:Conference"),
        dataIndex: 'conference',
        key: 'conference',
        width: '80px',
        sorter: (a, b) => a.conference.localeCompare(b.conference),
        render: (text, record, index) => {
          if (Setting.isAdminUser(this.props.account)) {
            return (
              <Link to={`/conferences/${text}`}>
                {text}
              </Link>
            )
          } else {
            return text;
          }
        }
      },
      {
        title: i18next.t("submission:Type"),
        dataIndex: 'type',
        key: 'type',
        width: '100px',
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: i18next.t("submission:Sub type"),
        dataIndex: 'subType',
        key: 'subType',
        width: '120px',
        sorter: (a, b) => a.subType.localeCompare(b.subType),
      },
      {
        title: i18next.t("submission:Title"),
        dataIndex: 'title',
        key: 'title',
        width: '170px',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: i18next.t("submission:Authors"),
        dataIndex: 'authors',
        key: 'authors',
        width: '100px',
        render: (text, record, index) => {
          const authors = text;
          if (authors.length === 0) {
            return "(empty)";
          }

          return (
            <List
              size="small"
              dataSource={authors}
              renderItem={(authorItem, i) => {
                return (
                  <List.Item>
                    <div style={{display: "inline"}}>
                      {/*<Tooltip placement="topLeft" title="Edit">*/}
                      {/*  <Button style={{marginRight: "5px"}} icon={<EditOutlined />} size="small" onClick={() => Setting.goToLinkSoft(this, `/providers/${providerItem.name}`)} />*/}
                      {/*</Tooltip>*/}
                      {/*<Link to={`/providers/${providerItem.name}`}>*/}
                      {/*  {providerItem.name}*/}
                      {/*</Link>*/}
                      {`${JSON.stringify(authorItem.name)}, ${JSON.stringify(authorItem.email)}, ${JSON.stringify(authorItem.affiliation)}`}
                    </div>
                  </List.Item>
                )
              }}
            />
          )
        },
      },
      {
        title: i18next.t("submission:Abstract files"),
        dataIndex: 'absWordFileUrl',
        key: 'absWordFileUrl',
        width: '120px',
        sorter: (a, b) => a.absWordFileUrl.localeCompare(b.absWordFileUrl),
        render: (text, record, index) => {
          if (record.absWordFileUrl === "" && record.absPdfFileUrl === "") {
            return i18next.t("general:(empty)");
          }

          return (
            <div>
              {
                record.absWordFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.absWordFileUrl)}>
                    <Button style={{height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.goToLink(record.absWordFileUrl)}>
                      <div>
                        <FileWordOutlined style={{fontSize: 48, color: "rgb(19,77,178)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.absWordFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
              {
                record.absPdfFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.absPdfFileUrl)}>
                    <Button style={{height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.openLink(record.absPdfFileUrl)}>
                      <div>
                        <FilePdfOutlined style={{fontSize: 48, color: "rgb(194,10,10)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.absPdfFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
            </div>
          )
        }
      },
      {
        title: i18next.t("submission:Full paper files"),
        dataIndex: 'fullWordFileUrl',
        key: 'fullWordFileUrl',
        width: '120px',
        sorter: (a, b) => a.fullWordFileUrl.localeCompare(b.fullWordFileUrl),
        render: (text, record, index) => {
          if (record.fullWordFileUrl === "" && record.fullPdfFileUrl === "") {
            return i18next.t("general:(empty)");
          }

          return (
            <div>
              {
                record.fullWordFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.fullWordFileUrl)}>
                    <Button style={{height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.goToLink(record.fullWordFileUrl)}>
                      <div>
                        <FileWordOutlined style={{fontSize: 48, color: "rgb(19,77,178)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.fullWordFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
              {
                record.fullPdfFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.fullPdfFileUrl)}>
                    <Button style={{height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.openLink(record.fullPdfFileUrl)}>
                      <div>
                        <FilePdfOutlined style={{fontSize: 48, color: "rgb(194,10,10)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.fullPdfFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
            </div>
          )
        }
      },
      {
        title: i18next.t("general:Status"),
        dataIndex: 'status',
        key: 'status',
        width: '80px',
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: 'action',
        key: 'action',
        width: '120px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/submissions/${record.owner}/${record.name}`)}>{i18next.t("general:Edit")}</Button>
              <Popconfirm
                title={`Sure to delete submission: ${record.name} ?`}
                onConfirm={() => this.deleteSubmission(index)}
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
        <Table columns={columns} dataSource={submissions} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   {i18next.t("general:Submissions")}&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addSubmission.bind(this)}>Add</Button>
                 </div>
               )}
               loading={submissions === null}
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
              this.renderTable(this.state.submissions)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SubmissionListPage;
