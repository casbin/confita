import React from "react";
import {Button, Col, List, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as SubmissionBackend from "./backend/SubmissionBackend";
import {Link} from "react-router-dom";
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
    this.getSubmissions();
  }

  getSubmissions() {
    SubmissionBackend.getSubmissions(this.props.account.name)
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
      conference: "conference_0",
      title: `Submission ${this.state.submissions.length}`,
      authors: [{name: this.props.account.name, affiliation: this.props.account.affiliation, email: this.props.account.email, isNotified: true, isCorresponding: true}],
      type: "Symposium",
      subType: "Default",
      status: "Draft",
      wordFileUrl: "",
      pdfFileUrl: "",
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
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/submissions/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: i18next.t("general:Created time"),
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '100px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: i18next.t("submission:Conference"),
        dataIndex: 'conference',
        key: 'conference',
        width: '120px',
        sorter: (a, b) => a.conference.localeCompare(b.conference),
        render: (text, record, index) => {
          return (
            <Link to={`/conferences/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: i18next.t("submission:Title"),
        dataIndex: 'title',
        key: 'title',
        width: '120px',
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: i18next.t("submission:Authors"),
        dataIndex: 'authors',
        key: 'authors',
        width: '300px',
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
        title: i18next.t("submission:Word file"),
        dataIndex: 'wordFileUrl',
        key: 'wordFileUrl',
        width: '120px',
        sorter: (a, b) => a.wordFileUrl.localeCompare(b.wordFileUrl),
      },
      {
        title: i18next.t("submission:PDF file"),
        dataIndex: 'pdfFileUrl',
        key: 'pdfFileUrl',
        width: '120px',
        sorter: (a, b) => a.pdfFileUrl.localeCompare(b.pdfFileUrl),
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
        width: '140px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/submissions/${record.name}`)}>{i18next.t("general:Edit")}</Button>
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
