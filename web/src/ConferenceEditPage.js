import React from "react";
import {Button, Card, Col, DatePicker, Input, Row, Select} from 'antd';
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";
import moment from "moment";
import Conference from "./Conference";
import ConferenceEdit from "./ConferenceEdit";

const { Option } = Select;

class ConferenceEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conferenceName: props.match.params.conferenceName,
      conference: null,
    };
  }

  componentWillMount() {
    this.getConference();
  }

  getConference() {
    ConferenceBackend.getConference(this.props.account.name, this.state.conferenceName)
      .then((conference) => {
        this.setState({
          conference: conference,
        });
      });
  }

  parseConferenceField(key, value) {
    if (["score"].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateConferenceField(key, value) {
    value = this.parseConferenceField(key, value);

    let conference = this.state.conference;
    conference[key] = value;
    this.setState({
      conference: conference,
    });
  }

  renderConference() {
    return (
      <Card size="small" title={
        <div>
          Edit Conference&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitConferenceEdit.bind(this)}>Save</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Name:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.name} onChange={e => {
              this.updateConferenceField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Start date:
          </Col>
          <Col span={5} >
            <DatePicker defaultValue={moment(this.state.conference.startDate, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateConferenceField('startDate', timeString);
            }} />
          </Col>
          <Col style={{marginTop: '5px'}} span={2}>
            End date:
          </Col>
          <Col span={10} >
            <DatePicker defaultValue={moment(this.state.conference.endDate, "YYYY-MM-DD")} onChange={(time, timeString) => {
              this.updateConferenceField('endDate', timeString);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Full name:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.fullName} onChange={e => {
              this.updateConferenceField('fullName', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Organizer:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.organizer} onChange={e => {
              this.updateConferenceField('organizer', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Location:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.location} onChange={e => {
              this.updateConferenceField('location', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Address:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.address} onChange={e => {
              this.updateConferenceField('address', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Status:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.status} onChange={(value => {this.updateConferenceField('status', value);})}>
              {
                [
                  {id: 'Public', name: 'Public (Everyone can see it)'},
                  {id: 'Hidden', name: 'Hidden (Only yourself can see it)'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Carousels:
          </Col>
          <Col span={22} >
            <Select virtual={false} mode="tags" style={{width: '100%'}} placeholder="Please input"
                    value={this.state.conference.carousels}
                    onChange={value => {
                      this.updateConferenceField('carousels', value);
                    }}
            >
              {
                this.state.conference.carousels.map((carousel, index) => <Option key={carousel}>{carousel}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Introduction text:
          </Col>
          <Col span={22} >
            <Input value={this.state.conference.introText} onChange={e => {
              this.updateConferenceField('introText', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Language:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.conference.language} onChange={(value => {this.updateConferenceField('language', value);})}>
              {
                [
                  {id: 'zh', name: 'zh'},
                  {id: 'en', name: 'en'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Menu:
          </Col>
          <Col span={22} >
            <ConferenceEdit conference={this.state.conference} language={this.state.conference.language} onUpdateTreeItems={(value) => { this.updateConferenceField('treeItems', value)}} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Preview:
          </Col>
          <Col span={22} >
            <Conference conference={this.state.conference} language={this.state.conference.language} />
          </Col>
        </Row>
      </Card>
    )
  }

  submitConferenceEdit() {
    let conference = Setting.deepCopy(this.state.conference);
    ConferenceBackend.updateConference(this.state.conference.owner, this.state.conferenceName, conference)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `Successfully saved`);
          this.setState({
            conferenceName: this.state.conference.name,
          });
          this.props.history.push(`/conferences/${this.state.conference.name}`);
        } else {
          Setting.showMessage("error", `failed to save: server side failure`);
          this.updateConferenceField('name', this.state.conferenceName);
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
              this.state.conference !== null ? this.renderConference() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitConferenceEdit.bind(this)}>Save</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConferenceEditPage;
