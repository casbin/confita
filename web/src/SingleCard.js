// Copyright 2022 The Casbin Authors. All Rights Reserved.
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
import {Alert, Button, Card, Col, Space} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";
import {withRouter} from "react-router-dom";
import i18next from "i18next";
import * as Conf from "./Conf";

const { Meta } = Card;

class SingleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  renderPayment(product, payment) {
    if (product.name !== payment.productName) {
      return null;
    }

    return (
      <Alert
        message={`${Setting.getState(payment)} | ${Setting.getPrice(payment)}`}
        showIcon
        description={
        <div>
          {`${i18next.t("general:Name")}: ${payment.name}`}
          <br/>
          {`${i18next.t("general:Created time")}: ${Setting.getFormattedDate(payment.createdTime)}`}
          <br/>
          <Button style={{marginTop: '5px'}} type="primary" shape="round" icon={<DownloadOutlined />} onClick={(e) => {
            e.stopPropagation();

            if (payment.invoiceUrl === "") {
              Setting.goToLink(Setting.getPaymentInvoiceUrl(this.props.account, payment));
            } else {
              Setting.openLinkSafe(payment.invoiceUrl);
            }
          }}>
            {payment.invoiceUrl === "" ? i18next.t("payment:Issue Invoice") :
              i18next.t("payment:Download Invoice")}
          </Button>
        </div>
      }
        type="success"
        style={{cursor: "pointer"}}
        onClick={() => {
          Setting.goToLink(Setting.getPaymentUrl(this.props.account, payment));
        }}
        action={
          <Space direction="vertical">
            {
              `${payment.type}`
            }
          </Space>
        }
      />
    )
  }

  updateProduct(type) {
    this.props.onUpdateProduct(type, this.props.product);
  }

  onClickCard(link, clickable) {
    if (!clickable) {
      return;
    }

    if (Conf.TestAffiliation !== "") {
      if ((!Setting.isEditorUser(this.props.account) && !Setting.isAdminUser(this.props.account))) {
        if (!this.props.account.affiliation.includes(Conf.TestAffiliation)) {
          this.updateProduct("test");
          return;
        }
      }
    }

    if (!this.isRightProduct()) {
      this.updateProduct("product");
      return;
    }

    Setting.goToLink(link);
  }

  renderCardMobile(logo, link, title, desc, time, isSingle, clickable) {
    const cursor = clickable ? "pointer" : "auto";
    const opacity = this.isRightProduct() ? 1.0 : 0.8;
    const backgroundColor = this.isRightProduct() ? null : "rgb(255,242,240)";
    const gridStyle = {
      width: '100vw',
      textAlign: 'center',
      cursor: cursor,
      opacity: opacity,
      backgroundColor: backgroundColor,
    };

    return (
      <Card.Grid style={gridStyle} onClick={() => {
        this.onClickCard(link, clickable);
      }}>
        <img src={logo} alt="logo" height={60} style={{marginBottom: '20px'}}/>
        <Meta title={title} description={desc} />
      </Card.Grid>
    )
  }

  isRightProduct() {
    if (Setting.isEditorUser(this.props.account) || Setting.isAdminUser(this.props.account)) {
      return true;
    }

    return this.props.account.tag === this.props.product.tag;
  }

  renderCard(logo, link, title, desc, time, isSingle, clickable) {
    const cursor = clickable ? "pointer" : "auto";
    const opacity = this.isRightProduct() ? 1.0 : 0.8;
    const backgroundColor = this.isRightProduct() ? null : "rgb(255,242,240)";
    const bodyStyle = this.isRightProduct() ? {} : {backgroundSize: "100% 100%", backgroundImage: "url(https://cdn.casbin.com/static/img/mark2.png)"};

    return (
      <Col style={{opacity: opacity, paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px", marginBottom: "20px"}} span={6}>
        <Card
          hoverable
          cover={
            <img alt="logo" src={logo} width={"100%"} height={"100%"} />
          }
          onClick={() => {
            this.onClickCard(link, clickable);
          }}
          bodyStyle={bodyStyle}
          style={isSingle ? {width: "320px", cursor: cursor, backgroundColor: backgroundColor} : {cursor: cursor, backgroundColor: backgroundColor}}
        >
          <Meta title={title} description={desc} />
          <br/>
          <br/>
          {
            this.props.payments.map(payment => {
              return this.renderPayment(this.props.product, payment);
            })
          }
          {/*<Meta title={""} description={Setting.getFormattedDateShort(time)} />*/}
        </Card>
      </Col>
    )
  }

  render() {
    if (Setting.isMobile()) {
      return this.renderCardMobile(this.props.logo, this.props.link, this.props.title, this.props.desc, this.props.time, this.props.isSingle, this.props.clickable);
    } else {
      return this.renderCard(this.props.logo, this.props.link, this.props.title, this.props.desc, this.props.time, this.props.isSingle, this.props.clickable);
    }
  }
}

export default withRouter(SingleCard);
