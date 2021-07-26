import React from "react";
import {Button, Card, Col, Input, Row, Select} from 'antd';
import {LinkOutlined} from "@ant-design/icons";
import * as ResourceBackend from "./backend/ResourceBackend";
import * as ConferenceBackend from "./backend/ConferenceBackend";
import * as Setting from "./Setting";

const { Option } = Select;

class ResourceEditPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      resourceName: props.match.params.resourceName,
      resource: null,
      conferences: [],
    };
  }

  componentDidMount() {
    this.getResource();
    this.getConferences();
  }

  getResource() {
    ResourceBackend.getResource(this.props.account.username, this.state.resourceName)
      .then((resource) => {
        this.setState({
          resource: resource,
        });
      });
  }

  getConferences() {
    ConferenceBackend.getConferences(this.props.account.username)
      .then((res) => {
        this.setState({
          conferences: res,
        });
      });
  }

  parseResourceField(key, value) {
    if ([].includes(key)) {
      value = Setting.myParseInt(value);
    }
    return value;
  }

  updateResourceField(key, value) {
    value = this.parseResourceField(key, value);

    let resource = this.state.resource;
    resource[key] = value;
    this.setState({
      resource: resource,
    });
  }

  renderResource() {
    return (
      <Card size="small" title={
        <div>
          Edit&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="primary" onClick={this.submitResourceEdit.bind(this)}>Save</Button>
        </div>
      } style={{marginLeft: '5px'}} type="inner">
        <Row style={{marginTop: '10px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Name:
          </Col>
          <Col span={22} >
            <Input value={this.state.resource.name} onChange={e => {
              this.updateResourceField('name', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Type:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} disabled={true} value={this.state.resource.type} onChange={(value => {this.updateResourceField('type', value);})}>
              {
                [
                  {id: 'image', name: 'Image'},
                  {id: 'video', name: 'Video'},
                ].map((item, index) => <Option key={index} value={item.id}>{item.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Conference:
          </Col>
          <Col span={22} >
            <Select virtual={false} style={{width: '100%'}} value={this.state.resource.conference} onChange={(value => {this.updateResourceField('conference', value);})}>
              {
                <Option key={0} value={""}>(Global)</Option>
              }
              {
                this.state.conferences.map((conference, index) => <Option key={index+1} value={conference.name}>{conference.name}</Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Resource:
          </Col>
          <Col span={22} >
            <Row style={{marginTop: '20px'}} >
              <Col style={{marginTop: '5px'}} span={1}>
                URL:
              </Col>
              <Col span={23} >
                <Input prefix={<LinkOutlined/>} value={this.state.resource.url} onChange={e => {
                  this.updateResourceField('url', e.target.value);
                }} />
              </Col>
            </Row>
            <Row style={{marginTop: '20px'}} >
              <Col style={{marginTop: '5px'}} span={1}>
                Preview:
              </Col>
              <Col span={23} >
                {
                  this.renderPreivew()
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
    )
  }

  renderPreivew() {
    if (this.state.resource.type === "image") {
      return (
        <a target="_blank" href={this.state.resource.url}>
          <img src={this.state.resource.url} alt={this.state.resource.url} style={{marginBottom: '20px'}}/>
        </a>
      )
    } else if (this.state.resource.type === "video") {
      return (
        <video width={800} controls>
          <source src={this.state.resource.url} type="video/mp4" />
        </video>
      )
    }
  }

  submitResourceEdit() {
    let resource = Setting.deepCopy(this.state.resource);
    ResourceBackend.updateResource(this.state.resource.owner, this.state.resourceName, resource)
      .then((res) => {
        if (res) {
          Setting.showMessage("success", `保存成功`);
          this.setState({
            resourceName: this.state.resource.name,
          });
          this.props.history.push(`/resources/${this.state.resource.name}`);
        } else {
          Setting.showMessage("error", `保存失败：服务器端连接成功，但保存失败`);
          this.updateResourceField('name', this.state.resourceName);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `保存失败：${error}`);
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
              this.state.resource !== null ? this.renderResource() : null
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
        <Row style={{margin: 10}}>
          <Col span={2}>
          </Col>
          <Col span={18}>
            <Button type="primary" size="large" onClick={this.submitResourceEdit.bind(this)}>Save</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResourceEditPage;
