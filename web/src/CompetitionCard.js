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
import {Card} from "antd";
import * as Setting from "./Setting";
import i18next from "i18next";
import "./CompetitionCard.less";

const {Meta} = Card;

class CompetitionCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
    };
  }

  renderCardMobile(competition) {

    return (
      <Card className="competition-card-mobile" bodyStyle={{padding: 0}} hoverable>
        <img src={competition.carousels[0]} alt="logo" height={60} style={{marginBottom: "20px", padding: "10px"}} />
        <Meta
          title={competition.displayName}
          description={competition.introduction}
        />
        <br />
        <div className="card-button-mobile">
          {i18next.t("competition:Ongoing")}
        </div>
      </Card>
    );
  }

  renderCard(competition) {
    return (
      <div className="competition-card-container">
        <Card className="competition-card"
          cover={<img alt="logo" src={competition.carousels[0]} style={{width: "100%", height: "auto", objectFit: "scale-down", padding: "10px"}} />}
          bodyStyle={{margin: 0, padding: 0}}
          hoverable
        >
          <div className="card-body">
            <Meta title={competition.displayName} description={competition.introduction} />
          </div>
          <div className="card-bottom">
            <div>
              <p>{i18next.t("competition:Organizer")}</p>
              <p>{competition.organizer}</p>
            </div>
            <div>
              {i18next.t("competition:Ongoing")}
            </div>
          </div>
        </Card>
      </div>
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
