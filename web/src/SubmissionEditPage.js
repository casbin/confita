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
import {Button, Card, Col, Input, Row, Select} from 'antd';
import * as SubmissionBackend from "./backend/SubmissionBackend";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import UploadFile from "./UploadFile";
import i18next from "i18next";
import AuthorTable from "./AuthorTable";
import CsvTable from "./CsvTable";

import {Controlled as CodeMirror} from 'react-codemirror2';
import "codemirror/lib/codemirror.css";
require('codemirror/theme/material-darker.css');
require("codemirror/mode/python/python");

const { Option } = Select;

class SubmissionEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      userName: props.match.params.userName,
      submissionName: props.match.params.submissionName,
      submission: null,
      conferences: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.getSubmission();
    this.getGlobalConferences();
  }

  getGlobalConferences() {
    ConferenceBackend.getGlobalConferences()
      .then(res => {
        this.setState({
          conferences: res,
        });
      });
  }

  getSubmission() {
    SubmissionBackend.getSubmission(this.state.userName, this.state.submissionName)
      .then((submission) => {
        this.setState({
          submission: submission,
        });
      });
  }

  getConference() {
    const res = this.state.conferences.filter(conference => this.state.submission.conference === conference.name);
    if (res.length > 0) {
      return res[0];
    }
    return null;
  }

  isCompetition() {
    const conference = this.getConference();
    return conference?.type === "Competition";
  }

  parseSubmissionField(key, value) {
    if (["score"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateSubmissionField(key, value) {
    value = this.parseSubmissionField(key, value);

    let submission = this.state.submission;
    submission[key] = value;
    this.setState({
      submission: submission,
    });
  }

  renderSubmission() {
    const conference = this.getConference();

    let typeOptions;
    if (this.isCompetition()) {
      typeOptions = [
        {id: 'Program', name: 'Program'},
      ];
    } else {
      typeOptions = [
        {id: 'Symposium', name: 'Symposium'},
        {id: 'Workshop', name: 'Workshop'},
        {id: 'Oral', name: 'Oral'},
        {id: 'Poster', name: 'Poster'},
      ];
    }

    let subTypeOptions;
    if (this.isCompetition()) {
      subTypeOptions = [
        {id: 'Python', name: 'Python'},
        {id: 'R', name: 'R'},
        {id: 'Java', name: 'Java'},
        {id: 'Julia', name: 'Julia'},
      ];
    } else {
      if (this.state.submission.type !== "Oral") {
        subTypeOptions = [
          {id: 'Default', name: 'Default'},
        ];
      } else {
        subTypeOptions = [
          {id: 'Default', name: 'Default'},
        ];
      }
    }

    return (
      <Card size="small" title={
        <div>
          {i18next.t("submission:Edit Submission")}&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitSubmissionEdit.bind(this)}>{i18next.t("general:Save")}</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Name")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.submission.name} onChange={e => {
              this.updateSubmissionField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Conference")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.submission.conference} onChange={(value => {this.updateSubmissionField('conference', value);})}>
              {
                this.state.conferences.map((conference, index) => <Option key={index} value={conference.name}>{conference.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Title")}:
          </Col>
          <Col span={22} >
            <Input value={this.state.submission.title} onChange={e => {
              this.updateSubmissionField('title', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Type")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.submission.type} onChange={(value => {
              this.updateSubmissionField('type', value);
              if (this.state.submission.type === "Oral") {
                this.updateSubmissionField('subType', "Default");
              } else {
                this.updateSubmissionField('subType', "Default");
              }
            })}>
              {
                typeOptions.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Sub type")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.submission.subType} onChange={(value => {this.updateSubmissionField('subType', value);})}>
              {
                subTypeOptions.map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
            {i18next.t("submission:Authors")}:
          </Col>
          <Col span={22} >
            <AuthorTable
              title={i18next.t("submission:Authors")}
              table={this.state.submission.authors}
              onUpdateTable={(value) => { this.updateSubmissionField('authors', value)}}
            />
          </Col>
        </Row>
        {
          this.isCompetition() ? (
            <React.Fragment>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {i18next.t("submission:Dataset preview")}:
                </Col>
                <Col span={22} >
                  <CsvTable conference={this.getConference()} />
                </Col>
              </Row>
              <Row style={{marginTop: '20px'}} >
                <Col style={{marginTop: '5px'}} span={(Setting.isMobile()) ? 22 : 2}>
                  {i18next.t("submission:Code")}:
                </Col>
                <Col span={22} >
                  <div style={{width: "900px"}} >
                    <CodeMirror
                      value={this.state.submission.code}
                      options={{mode: 'python', theme: "material-darker"}}
                      onBeforeChange={(editor, data, value) => {
                        this.updateSubmissionField("code", value);
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </React.Fragment>
          ) : (
            <Row style={{marginTop: '40px'}} >
              <Col style={{marginTop: '5px'}} span={2}>
                {i18next.t("submission:Abstract files")}:
              </Col>
              <Col style={{marginRight: '10px'}} span={6} >
                <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.absWordFileUrl} urlKey={"absWordFileUrl"} label={"Word (.docx)"} accept={".docx"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
              </Col>
              <Col span={6} >
                <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.absPdfFileUrl} urlKey={"absPdfFileUrl"}  label={"PDF (.pdf)"} accept={".pdf"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
              </Col>
            </Row>
          )
        }
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Full paper files")}:
          </Col>
          <Col style={{marginRight: '10px'}} span={6} >
            <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.fullWordFileUrl} urlKey={"fullWordFileUrl"} label={"Word (.docx)"} accept={".docx"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
          </Col>
          <Col span={6} >
            <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.fullPdfFileUrl} urlKey={"fullPdfFileUrl"}  label={"PDF (.pdf)"} accept={".pdf"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("submission:Final paper files")}:
          </Col>
          <Col style={{marginRight: '10px'}} span={6} >
            <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.finalWordFileUrl} urlKey={"finalWordFileUrl"} label={"Word (.docx)"} accept={".docx"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
          </Col>
          <Col span={6} >
            <UploadFile disabled={!conference?.enableSubmission} fileUrl={this.state.submission.finalPdfFileUrl} urlKey={"finalPdfFileUrl"}  label={"PDF (.pdf)"} accept={".pdf"} onUpdateSubmission={(key, value) => { return this.updateSubmissionField(key, value)}} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            {i18next.t("general:Status")}:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.submission.status} onChange={(value => {this.updateSubmissionField('status', value);})}>
              {
                [
                  {id: 'Draft', name: 'Draft (Only yourself can see it, you can still update the draft later)'},
                  {id: 'ReadyForReview', name: 'Ready for review'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
      </Card>
    )
  }

  submitSubmissionEdit() {
    let submission = Setting.deepCopy(this.state.submission);
    SubmissionBackend.updateSubmission(this.state.submission.owner, this.state.submissionName, submission)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            submissionName: this.state.submission.name,
          });
          this.props.history.push(`/submissions/${this.state.submission.owner}/${this.state.submission.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateSubmissionField('name', this.state.submissionName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `failed to save: ${error}`);
      });
  }

  render() {
    return (
      <div>
        <Row style={{width: "100%"}}>
          <Col span={1}>
          </Col>
          <Col span={22}>
            {
              this.state.submission !== null ? this.renderSubmission() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitSubmissionEdit.bind(this)}>{i18next.t("general:Save")}</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SubmissionEditPage;
