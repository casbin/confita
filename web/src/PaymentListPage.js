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
import {Button, Col, Row, Table} from 'antd';
import * as Setting from "./Setting";
import * as PaymentBackend from "./backend/PaymentBackend";
import i18next from "i18next";

class PaymentListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      payments: null,
    };
  }

  componentWillMount() {
    this.getGlobalPayments();
  }

  getGlobalPayments() {
    PaymentBackend.getGlobalPayments()
      .then((res) => {
        this.setState({
          payments: res,
        });
      });
  }

  renderTable(payments) {
    const columns = [
      // {
      //   title: i18next.t("general:Organization"),
      //   dataIndex: 'organization',
      //   key: 'organization',
      //   width: '120px',
      //   sorter: (a, b) => a.organization.localeCompare(b.organization),
      //   render: (text, record, index) => {
      //     return (
      //       <Link to={`/organizations/${text}`}>
      //         {text}
      //       </Link>
      //     )
      //   }
      // },
      {
        title: i18next.t("general:User"),
        dataIndex: 'user',
        key: 'user',
        width: '120px',
        sorter: (a, b) => a.user.localeCompare(b.user),
        render: (text, record, index) => {
          return (
            <a target="_blank" rel="noreferrer" href={Setting.getUserProfileUrl(text)}>
              {text}
            </a>
          )
        }
      },
      {
        title: i18next.t("general:Name"),
        dataIndex: 'name',
        key: 'name',
        width: '180px',
        fixed: 'left',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/payments/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: i18next.t("general:Created time"),
        dataIndex: 'createdTime',
        key: 'createdTime',
        width: '160px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: i18next.t("payment:Product"),
        dataIndex: 'productDisplayName',
        key: 'productDisplayName',
        // width: '160px',
        sorter: (a, b) => a.productDisplayName.localeCompare(b.productDisplayName),
        render: (text, record, index) => {
          return Setting.getLanguageText(text);
        }
      },
      {
        title: i18next.t("payment:Detail"),
        dataIndex: 'detail',
        key: 'detail',
        // width: '160px',
        sorter: (a, b) => a.detail.localeCompare(b.detail),
      },
      {
        title: i18next.t("payment:Tag"),
        dataIndex: 'tag',
        key: 'tag',
        width: '100px',
        sorter: (a, b) => a.tag.localeCompare(b.tag),
        render: (text, record, index) => {
          return Setting.getLanguageText(text);
        }
      },
      {
        title: i18next.t("payment:Price"),
        dataIndex: 'price',
        key: 'price',
        width: '120px',
        sorter: (a, b) => a.price.localeCompare(b.price),
      },
      {
        title: i18next.t("payment:Currency"),
        dataIndex: 'currency',
        key: 'currency',
        width: '120px',
        sorter: (a, b) => a.currency.localeCompare(b.currency),
        render: (text, record, index) => {
          return Setting.getCurrencyText(record);
        }
      },
      {
        title: i18next.t("payment:State"),
        dataIndex: 'state',
        key: 'state',
        width: '120px',
        sorter: (a, b) => a.state.localeCompare(b.state),
        render: (text, record, index) => {
          return Setting.getState(record);
        }
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: '',
        key: 'op',
        width: '260px',
        fixed: (Setting.isMobile()) ? "false" : "right",
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} onClick={() => Setting.openLinkSafe(Setting.getPaymentUrl(this.props.account, record))}>{i18next.t("payment:View Result")}</Button>
              <Button disabled={record.state !== "Paid"} style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => Setting.openLinkSafe(Setting.getPaymentInvoiceUrl(this.props.account, record))}>{i18next.t("payment:View Invoice")}</Button>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={payments} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   {i18next.t("general:All Payments")}&nbsp;&nbsp;&nbsp;&nbsp;
                 </div>
               )}
               loading={payments === null}
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
              this.renderTable(this.state.payments)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PaymentListPage;
