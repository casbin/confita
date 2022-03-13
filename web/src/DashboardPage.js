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
import {Button, Col, Descriptions, List, Row, Tooltip} from 'antd';
import * as SubmissionBackend from "./backend/SubmissionBackend";
import * as PaymentBackend from "./backend/PaymentBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import {Link} from "react-router-dom";
import {FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      submissions: null,
      payments: null,
    };
  }

  componentWillMount() {
    this.getSubmissions();
    this.getPayments();
  }

  getSubmissions() {
    SubmissionBackend.getSubmissions(this.props.account.name)
      .then((res) => {
        this.setState({
          submissions: res,
        });
      });
  }

  getPayments() {
    PaymentBackend.getPayments(this.props.account.name)
      .then((res) => {
        this.setState({
          payments: res,
        });
      });
  }

  renderSubmissionList() {
    if (this.state.submissions === null) {
      return null;
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={this.state.submissions}
        renderItem={submission => (
          <List.Item
            actions={[
              <Link to={`/submissions`}>
                {i18next.t("dashboard:View")}
              </Link>,
              <Link to={`/submissions/${submission.owner}/${submission.name}`}>
                {i18next.t("dashboard:Edit")}
              </Link>
            ]}
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.picture.large} />}
              title={
                <Link to={`/submissions`}>
                  {submission.title}
                </Link>
              }
              description={submission.authors.map(author => `${author.name} | ${author.affiliation} | ${author.email}`).join(", ")}
            />
            <Row style={{width: '40%'}} >
              <Col span={12} >
                <div>{`${submission.conference} | ${submission.type} | ${submission.subType}`}</div>
              </Col>
              <Col span={12} >
                <div>{`${submission.status}`}</div>
              </Col>
            </Row>
            {
              submission.wordFileUrl === "" ? (
                <Tooltip title={Setting.getFilenameFromUrl(submission.wordFileUrl)}>
                  <Button style={{width: 160, height: 78, margin: '10px', cursor: 'auto'}} type="dashed" >
                    <div>
                      <FileWordOutlined style={{fontSize: 48, color: "rgb(164,164,164)"}} />
                    </div>
                    <div>
                      {i18next.t("general:(empty)")}
                    </div>
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={Setting.getFilenameFromUrl(submission.wordFileUrl)}>
                  <Button style={{width: 160, height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.goToLink(submission.wordFileUrl)}>
                    <div>
                      <FileWordOutlined style={{fontSize: 48, color: "rgb(19,77,178)"}} />
                    </div>
                    <div>
                      {Setting.getShortText(Setting.getFilenameFromUrl(submission.wordFileUrl), 10)}
                    </div>
                  </Button>
                </Tooltip>
              )
            }
            {
              submission.wordFileUrl === "" ? (
                <Tooltip title={Setting.getFilenameFromUrl(submission.wordFileUrl)}>
                  <Button style={{width: 160, height: 78, margin: '10px', cursor: 'auto'}} type="dashed" >
                    <div>
                      <FilePdfOutlined style={{fontSize: 48, color: "rgb(164,164,164)"}} />
                    </div>
                    <div>
                      {i18next.t("general:(empty)")}
                    </div>
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={Setting.getFilenameFromUrl(submission.pdfFileUrl)}>
                  <Button style={{width: 160, height: 78, margin: '10px'}} type="dashed" onClick={() => Setting.goToLink(submission.pdfFileUrl)}>
                    <div>
                      <FilePdfOutlined style={{fontSize: 48, color: "rgb(194,10,10)"}} />
                    </div>
                    <div>
                      {Setting.getShortText(Setting.getFilenameFromUrl(submission.pdfFileUrl), 10)}
                    </div>
                  </Button>
                </Tooltip>
              )
            }
          </List.Item>
        )}
      />
    )
  }

  renderPaymentList() {
    if (this.state.payments === null) {
      return null;
    }

    if (this.state.payments.length === 0) {
      return (
        <div>
          <span style={{fontSize: 16}}>
            {`${i18next.t("dashboard:You haven't completed the payment, please click the button to pay")}: `}
          </span>
          <a href={Setting.getProductBuyUrl(this.props.account)}>
            <Button type="primary" size={"large"} >{i18next.t("dashboard:Pay Registration Fee")}</Button>
          </a>
        </div>
      )
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={this.state.payments}
        renderItem={payment => (
          <List.Item
            actions={[
              <Link to={`/submissions`}>
                {i18next.t("dashboard:View")}
              </Link>,
              <Link to={`/submissions/${payment.owner}/${payment.name}`}>
                {i18next.t("dashboard:Edit")}
              </Link>
            ]}
          >
            <List.Item.Meta
              // avatar={<Avatar src={item.picture.large} />}
              title={<a href="https://ant.design">{payment.title}</a>}
              // description={payment.authors.map(author => `${author.name} | ${author.affiliation} | ${author.email}`).join(", ")}
            />
            <div>{`${payment.conference} | ${payment.type} | ${payment.subType}`}</div>
          </List.Item>
        )}
      />
    )
  }

  render() {
    const account = this.props.account;

    return (
      <div style={{padding: "20px"}}>
        <Descriptions title={`${i18next.t("dashboard:Welcome")}, ${account?.displayName}`} bordered>
          <Descriptions.Item label={i18next.t("general:Name")} span={3}>
            <img src={account?.avatar} alt={account?.avatar} height={90} />
            <span style={{fontSize: 28, marginLeft: "20px"}}>
              {account?.displayName}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label={i18next.t("dashboard:Affiliation")}><span style={{fontSize: 16}}>{account?.affiliation}</span></Descriptions.Item>
          <Descriptions.Item label={i18next.t("dashboard:Title")}><span style={{fontSize: 16}}>{account?.title}</span></Descriptions.Item>
          <Descriptions.Item label={i18next.t("dashboard:Tag")}><span style={{fontSize: 16}}>{account?.tag}</span></Descriptions.Item>
          <Descriptions.Item label={i18next.t("general:Submissions")} span={3}>
            {
              this.renderSubmissionList()
            }
          </Descriptions.Item>
          <Descriptions.Item label={i18next.t("general:Registrations")} span={3}>
            {
              this.renderPaymentList()
            }
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

export default DashboardPage;
