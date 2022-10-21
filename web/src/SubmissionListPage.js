
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
import {Button, Col, List, Popconfirm, Row, Table, Tooltip} from "antd";
import {FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";
import moment from "moment";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import * as SubmissionBackend from "./backend/SubmissionBackend";
import * as UserBackend from "./backend/UserBackend";
import * as PaymentBackend from "./backend/PaymentBackend";
import i18next from "i18next";
import copy from "copy-to-clipboard";
import XLSX from "xlsx";
import FileSaver from "file-saver";

class SubmissionListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      submissions: null,
      submissionMap: null,
      paymentMap: null,
      users: null,
    };
  }

  UNSAFE_componentWillMount() {
    if (Setting.isAdminUser(this.props.account) || Setting.isEditorUser(this.props.account)) {
      this.getGlobalSubmissions();
      this.getUsers();
      this.getGlobalPayments();
    } else {
      this.getSubmissions();
    }
  }

  getSubmissions() {
    SubmissionBackend.getSubmissions(this.props.account.name)
      .then((submissions) => {
        const submissionMap = {};
        submissions.forEach((submission, i) => {
          if (submission.finalWordFileUrl !== "" || submission.finalPdfFileUrl !== "") {
            submissionMap[submission.owner] = submission;
          }
        });

        this.setState({
          submissions: submissions,
          submissionMap: submissionMap,
        });
      });
  }

  getGlobalSubmissions() {
    SubmissionBackend.getGlobalSubmissions()
      .then((submissions) => {
        const submissionMap = {};
        submissions.forEach((submission, i) => {
          if (submission.finalWordFileUrl !== "" || submission.finalPdfFileUrl !== "") {
            submissionMap[submission.owner] = submission;
          }
        });

        this.setState({
          submissions: submissions,
          submissionMap: submissionMap,
        });
      });
  }

  getUsers() {
    UserBackend.getUsers()
      .then((res) => {
        this.setState({
          users: res,
        });
      });
  }

  getGlobalPayments() {
    PaymentBackend.getGlobalPayments()
      .then((payments) => {
        const paymentMap = {};
        payments.forEach((payment, i) => {
          paymentMap[payment.user] = payment;
        });

        this.setState({
          paymentMap: paymentMap,
        });
      });
  }

  downloadXlsx() {
    const data = [];
    this.state.users.forEach((user, i) => {
      const row = {};

      row["Username"] = user.name;
      row["Name"] = user.displayName;
      row["Email"] = user.email;
      row["Country/Region"] = user.region;
      row["Tag"] = user.tag;

      const payment = this.state.paymentMap[user.name];
      if (payment !== undefined) {
        row["Registration SKU"] = Setting.getLanguageText(payment.productDisplayName);
        row["Registration Tag"] = payment.tag;
        row["Registration Fee"] = payment.price;
      }

      const submission = this.state.submissionMap[user.name];
      if (submission !== undefined) {
        row["Submission"] = Setting.getShortName((submission.finalWordFileUrl !== "") ? submission.finalWordFileUrl : submission.finalPdfFileUrl);
        row["Authors"] = JSON.stringify(submission.authors);
      }

      data.push(row);
    });

    const sheet = XLSX.utils.json_to_sheet(data);
    sheet["!cols"] = [
      {wch: 20},
      {wch: 20},
      {wch: 30},
      {wch: 15},
      {wch: 15},
      {wch: 25},
      {wch: 15},
      {wch: 15},
      {wch: 25},
      {wch: 25},
    ];

    const blob = Setting.sheet2blob(sheet, "Default");
    const fileName = `users-${Setting.getFormattedDate(moment().format())}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  newSubmission() {
    return {
      owner: this.props.account.name,
      name: `submission_${this.props.account.name}_${this.state.submissions.length}`,
      createdTime: moment().format(),
      conference: Conf.DefaultConferenceName,
      title: `New Submission - ${this.props.account.name} - ${this.state.submissions.length}`,
      type: "Symposium",
      subType: "Default",
      authors: [{name: this.props.account.displayName, affiliation: this.props.account.affiliation, email: this.props.account.email, isNotified: true, isCorresponding: true}],
      absWordFileUrl: "",
      absPdfFileUrl: "",
      fullWordFileUrl: "",
      fullPdfFileUrl: "",
      status: "Draft",
    };
  }

  addSubmission() {
    const newSubmission = this.newSubmission();
    SubmissionBackend.addSubmission(newSubmission)
      .then((res) => {
        Setting.showMessage("success", "Submission added successfully");
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
        Setting.showMessage("success", "Submission deleted successfully");
        this.setState({
          submissions: Setting.deleteRow(this.state.submissions, i),
        });
      }
      )
      .catch(error => {
        Setting.showMessage("error", `Submission failed to delete: ${error}`);
      });
  }

  isSubmissionCompleted(submission) {
    if (submission.fullWordFileUrl === "" && submission.fullPdfFileUrl === "") {
      return false;
    }
    return true;
  }

  getSubmissionEmails(submission) {
    return submission.authors.map(author => author.email);
  }

  copyEmails() {
    let emails = this.state.submissions.filter(submission => this.isSubmissionCompleted(submission)).map(submission => this.getSubmissionEmails(submission)).flat().filter(email => email !== "");
    emails = emails.filter((item, pos) => {
      return emails.indexOf(item) === pos;
    });
    emails = emails.join("\n");

    copy(emails);

    Setting.showMessage("success", "All author emails are copied to clipboard successfully");
  }

  renderTable(submissions) {
    const columns = [
      {
        title: i18next.t("general:Owner"),
        dataIndex: "owner",
        key: "owner",
        width: "100px",
        sorter: (a, b) => a.owner.localeCompare(b.owner),
        render: (text, record, index) => {
          return (
            <a target="_blank" rel="noreferrer" href={Setting.getUserProfileUrl(text)}>
              {Setting.getShortText(text, 15)}
            </a>
          );
        },
      },
      // {
      //   title: i18next.t("general:Name"),
      //   dataIndex: 'name',
      //   key: 'name',
      //   width: '120px',
      //   sorter: (a, b) => a.name.localeCompare(b.name),
      //   render: (text, record, index) => {
      //     return (
      //       <Link to={`/submissions/${record.owner}/${text}`}>
      //         {text}
      //       </Link>
      //     )
      //   }
      // },
      {
        title: i18next.t("general:Created time"),
        dataIndex: "createdTime",
        key: "createdTime",
        width: "110px",
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        },
      },
      // {
      //   title: i18next.t("submission:Conference"),
      //   dataIndex: 'conference',
      //   key: 'conference',
      //   width: '80px',
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
      {
        title: i18next.t("submission:Type"),
        dataIndex: "type",
        key: "type",
        width: "100px",
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: i18next.t("submission:Sub type"),
        dataIndex: "subType",
        key: "subType",
        width: "120px",
        sorter: (a, b) => a.subType.localeCompare(b.subType),
      },
      {
        title: i18next.t("submission:Title"),
        dataIndex: "title",
        key: "title",
        // width: '170px',
        sorter: (a, b) => a.title.localeCompare(b.title),
        render: (text, record, index) => {
          return (
            <Link to={`/submissions/${record.owner}/${record.name}`}>
              {text}
            </Link>
          );
        },
      },
      {
        title: i18next.t("submission:Authors"),
        dataIndex: "authors",
        key: "authors",
        width: "100px",
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
                      {/* <Tooltip placement="topLeft" title="Edit">*/}
                      {/*  <Button style={{marginRight: "5px"}} icon={<EditOutlined />} size="small" onClick={() => Setting.goToLinkSoft(this, `/providers/${providerItem.name}`)} />*/}
                      {/* </Tooltip>*/}
                      {/* <Link to={`/providers/${providerItem.name}`}>*/}
                      {/*  {providerItem.name}*/}
                      {/* </Link>*/}
                      {`${JSON.stringify(authorItem.name)}, ${JSON.stringify(authorItem.email)}, ${JSON.stringify(authorItem.affiliation)}`}
                    </div>
                  </List.Item>
                );
              }}
            />
          );
        },
      },
      {
        title: i18next.t("submission:Abstract files"),
        dataIndex: "absWordFileUrl",
        key: "absWordFileUrl",
        width: "135px",
        sorter: (a, b) => a.absWordFileUrl.localeCompare(b.absWordFileUrl),
        render: (text, record, index) => {
          if (record.absWordFileUrl === "" && record.absPdfFileUrl === "") {
            return i18next.t("general:(empty)");
          }

          return (
            <div style={{width: "135px"}}>
              {
                record.absWordFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.absWordFileUrl)}>
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.goToLink(record.absWordFileUrl)}>
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
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.openLink(record.absPdfFileUrl)}>
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
          );
        },
      },
      {
        title: i18next.t("submission:Full paper files"),
        dataIndex: "fullWordFileUrl",
        key: "fullWordFileUrl",
        width: "135px",
        sorter: (a, b) => a.fullWordFileUrl.localeCompare(b.fullWordFileUrl),
        render: (text, record, index) => {
          if (record.fullWordFileUrl === "" && record.fullPdfFileUrl === "") {
            return i18next.t("general:(empty)");
          }

          return (
            <div style={{width: "135px"}}>
              {
                record.fullWordFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.fullWordFileUrl)}>
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.goToLink(record.fullWordFileUrl)}>
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
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.openLink(record.fullPdfFileUrl)}>
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
          );
        },
      },
      {
        title: i18next.t("submission:Final paper files"),
        dataIndex: "finalWordFileUrl",
        key: "finalWordFileUrl",
        width: "135px",
        sorter: (a, b) => a.finalWordFileUrl.localeCompare(b.finalWordFileUrl),
        render: (text, record, index) => {
          if (record.finalWordFileUrl === "" && record.finalPdfFileUrl === "") {
            return i18next.t("general:(empty)");
          }

          return (
            <div style={{width: "135px"}}>
              {
                record.finalWordFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.finalWordFileUrl)}>
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.goToLink(record.finalWordFileUrl)}>
                      <div>
                        <FileWordOutlined style={{fontSize: 48, color: "rgb(19,77,178)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.finalWordFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
              {
                record.finalPdfFileUrl === "" ? null : (
                  <Tooltip title={Setting.getFilenameFromUrl(record.finalPdfFileUrl)}>
                    <Button style={{height: 78, margin: "10px"}} type="dashed" onClick={() => Setting.openLink(record.finalPdfFileUrl)}>
                      <div>
                        <FilePdfOutlined style={{fontSize: 48, color: "rgb(194,10,10)"}} />
                      </div>
                      <div>
                        {Setting.getShortText(Setting.getFilenameFromUrl(record.finalPdfFileUrl), 10)}
                      </div>
                    </Button>
                  </Tooltip>
                )
              }
            </div>
          );
        },
      },
      {
        title: i18next.t("general:Status"),
        dataIndex: "status",
        key: "status",
        width: "80px",
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: i18next.t("submission:Completed"),
        dataIndex: "completed",
        key: "completed",
        width: "120px",
        sorter: (a, b) => this.isSubmissionCompleted(a).toString().localeCompare(this.isSubmissionCompleted(b).toString()),
        render: (text, record, index) => {
          if (!this.isSubmissionCompleted(record)) {
            return "Incomplete";
          }

          return "Completed";
        },
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: "action",
        key: "action",
        width: "120px",
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}} type="primary" onClick={() => this.props.history.push(`/submissions/${record.owner}/${record.name}`)}>{i18next.t("general:Edit")}</Button>
              <Popconfirm
                title={`Sure to delete submission: ${record.name} ?`}
                onConfirm={() => this.deleteSubmission(index)}
                okText="OK"
                cancelText="Cancel"
              >
                <Button style={{marginBottom: "10px"}} type="danger">{i18next.t("general:Delete")}</Button>
              </Popconfirm>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={submissions} rowKey="name" size="middle" bordered pagination={{pageSize: 1000}}
          title={() => (
            <div>
              {i18next.t("general:Submissions")}&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" size="small" onClick={this.addSubmission.bind(this)}>{i18next.t("general:Add")}</Button>
                   &nbsp;&nbsp;&nbsp;&nbsp;
              <Button size="small" onClick={() => this.copyEmails()}>{i18next.t("submission:Copy All Emails")}</Button>
                   &nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" disabled={this.state.users === null || this.state.paymentMap === null || this.state.submissionMap === null} size="small" onClick={() => this.downloadXlsx()}>{i18next.t("submission:Download Users")} (.xlsx)</Button>
            </div>
          )}
          loading={submissions === null}
          rowClassName={(record, index) => {
            return !this.isSubmissionCompleted(record) ? "alert-row" : null;
          }}
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={24}>
            {
              this.renderTable(this.state.submissions)
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default SubmissionListPage;
