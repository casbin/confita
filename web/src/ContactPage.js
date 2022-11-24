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
import {Col, Row} from "antd";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import * as Conf from "./Conf";
import i18next from "i18next";

class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conference: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(Conf.DefaultOwner, Conf.DefaultConferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  renderComments() {
    if (this.props.account === undefined) {
      return null;
    }

    const nodeId = "verification";
    // const title = encodeURIComponent(document.title);
    const title = encodeURIComponent(`Change Tag Request - ${this.props.account.name}`);
    const author = this.props.account.name;
    const urlPath = encodeURIComponent(`|change-tag-request|${this.props.account.name}`);

    let accessToken;
    if (this.props.account === null) {
      // Confita is signed out, also sign out Casnode.
      accessToken = "signout";
    } else {
      accessToken = this.props.account.accessToken;
    }

    return (
      <iframe
        key={accessToken}
        title={title}
        style={{border: "1px solid rgb(232,232,232)", width: "100%", height: "70vh"}}
        src={`${Conf.CasnodeEndpoint}/embedded-replies?nodeId=${nodeId}&title=${title}&author=${author}&urlPath=${urlPath}&accessToken=${accessToken}`}
      />
    );
  }

  renderAdmin() {
    let accessToken;
    if (this.props.account === null) {
      // Confita is signed out, also sign out Casnode.
      accessToken = "signout";
    } else {
      accessToken = this.props.account.accessToken;
    }

    return (
      <iframe
        key={accessToken}
        title={"Casnode"}
        style={{border: "1px solid rgb(232,232,232)", width: "100%", height: "70vh"}}
        src={`${Conf.CasnodeEndpoint}?accessToken=${accessToken}`}
      />
    );
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
          <Col span={!Setting.isMobile() ? 18 : 24}>
            <br />
            {
              Setting.getAlert("info", i18next.t("contact:If you want to change your tag to 'Student' or 'Accompanying Person', please contact the service desk in the below chat box. Provide the tag you want to change to and also the proof image like your student ID card photo. You can use the keystroke 'Ctrl' + 'V' to paste an image into the reply box."))
            }
            <br />
            {
              (Setting.isEditorUser(this.props.account) || Setting.isAdminUser(this.props.account)) ? (
                this.renderAdmin()
              ) : (
                this.renderComments()
              )
            }
          </Col>
          <Col span={!Setting.isMobile() ? 3 : 0}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ContactPage;
