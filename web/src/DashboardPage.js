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
import {Button, Card, Col, Descriptions, List, Row, Tooltip} from 'antd';
import * as SubmissionBackend from "./backend/SubmissionBackend";
import * as ProductBackend from "./backend/ProductBackend";
import * as PaymentBackend from "./backend/PaymentBackend";
import * as Setting from "./Setting";
import i18next from "i18next";
import {Link} from "react-router-dom";
import {FilePdfOutlined, FileWordOutlined} from "@ant-design/icons";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Conf from "./Conf";
import SingleCard from "./SingleCard";

class DashboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      submissions: null,
      products: null,
      payments: null,
      conference: null,
    };
  }

  componentWillMount() {
    this.getSubmissions();
    this.getProducts();
    this.getPayments();
    this.getConference();
  }

  getSubmissions() {
    SubmissionBackend.getSubmissions(this.props.account.name)
      .then((res) => {
        this.setState({
          submissions: res,
        });
      });
  }

  getProducts() {
    ProductBackend.getProducts()
      .then((res) => {
        this.setState({
          products: res,
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

  getConference() {
    ConferenceBackend.getConference(Conf.DefaultOwner, Conf.DefaultConferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  getUserDisplayTag() {
    let myTag = "";
    this.state.conference?.tags?.map((tag, index) => {
      const tokens = tag.split("|");
      if (tokens[0] === this.props.account.tag) {
        if (Setting.getLanguage() !== "zh") {
          myTag = tokens[0];
        } else {
          myTag = tokens[1];
        }
      }
    })

    if (this.props.account.tag === "Editor") {
      if (Setting.getLanguage() !== "zh") {
        myTag = "Editor";
      } else {
        myTag = "编辑";
      }
    }

    return myTag;
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
                <div style={{width: '180px'}}>
                  {
                    Setting.getAlert(submission.status === "ReadyForReview" ? "success" : "error", submission.status)
                  }
                </div>
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

  renderCard(product, isSingle, payments) {
    const url = Setting.getProductBuyUrl(this.props.account, product.name);
    const price = Setting.getPrice(product);
    const paid = payments.length !== 0;

    return (
      <SingleCard logo={product.image} link={url} title={price} desc={product.displayName} time={product.tag} isSingle={isSingle} key={product.name} product={product} payments={payments} clickable={!paid} />
    )
  }

  renderCards() {
    const products = this.state.products;
    if (products === null) {
      return null;
    }

    const payments = this.state.payments;
    const isSingle = products.length === 1;

    if (Setting.isMobile()) {
      return (
        <Card bodyStyle={{padding: 0}}>
          {
            products.map(product => {
              return this.renderCard(product, isSingle, payments);
            })
          }
        </Card>
      )
    } else {
      return (
        <div style={{marginRight:'15px',marginLeft:'15px'}}>
          <Row style={{marginLeft: "-20px", marginRight: "-20px", marginTop: "20px"}} gutter={24}>
            {
              products.map(product => {
                return this.renderCard(product, isSingle, payments);
              })
            }
          </Row>
        </div>
      )
    }
  }

  renderPaymentList() {
    if (this.state.payments === null) {
      return null;
    }

    const displayTag = this.getUserDisplayTag();
    const paid = this.state.payments.length !== 0;

    return (
      <div>
          <div style={{fontSize: 16}}>
            {
              Setting.getAlert(paid ? "success" : "error", <div>
                {
                  `${i18next.t("dashboard:Your current tag is")}: ${displayTag}. `
                }
                {
                  !paid ? (
                    `${i18next.t("dashboard:You haven't completed the payment, please click the button to pay")}.`
                  ) : (
                    i18next.t("dashboard:You have completed the payment.")
                  )
                }
              </div>)
            }
          </div>
        {
          this.renderCards(paid)
        }
      </div>
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
          <Descriptions.Item label={i18next.t("dashboard:Tag")}><span style={{fontSize: 16}}>{this.getUserDisplayTag()}</span></Descriptions.Item>
          <Descriptions.Item label={i18next.t("general:Conferences")} span={3}><span style={{fontSize: 16}}>{this.state.conference?.fullName}</span></Descriptions.Item>
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
