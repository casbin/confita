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
import {withRouter} from "react-router-dom";
import {Button, Card, Col} from "antd";
import * as Setting from "./Setting";
import i18next from "i18next";

const {Meta} = Card;

class CompetitionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  renderButtons() {
    return (
      <div>
        <Button style={{marginRight: "10px", marginBottom: "10px"}} type="primary">
          {i18next.t("competition:Ongoing")}
        </Button>
      </div>
    );
  }

  renderCardMobile(competition) {
    const gridStyle = {
      width: "100vw",
      textAlign: "center",
      cursor: "pointer",
    };

    return (
      <Card.Grid style={gridStyle}>
        <img src={competition.carousels[0]} alt="logo" height={60} style={{marginBottom: "20px", padding: "10px"}} />
        <Meta
          title={competition.displayName}
          description={competition.introduction}
        />
        <br />
        {
          this.renderButtons()
        }
      </Card.Grid>
    );
  }

  renderCard(competition) {
    return (
      <Col style={{paddingLeft: "20px", paddingRight: "20px", paddingBottom: "20px", marginBottom: "20px"}} span={6}>
        <Card
          hoverable
          cover={
            <img alt="logo" src={competition.carousels[0]} style={{width: "100%", height: "210px", objectFit: "scale-down", padding: "10px"}} />
          }
          style={{width: "25vw", cursor: "default"}}
        >
          <Meta title={competition.displayName} description={competition.introduction} />
          <br />
          <Meta title={""} description={competition.organizer} />
          <br />
          <br />
          {
            this.renderButtons()
          }
        </Card>
      </Col>
    );
  }

  renderContent() {
    const competition = this.props.competition;

    if (Setting.isMobile()) {
      return this.renderCardMobile(competition);
    } else {
      return this.renderCard(competition);
    }
  }

  render() {
    return this.renderContent();
  }
}

export default withRouter(CompetitionCard);
