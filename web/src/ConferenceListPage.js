import React from "react";
import {Link} from "react-router-dom";
import {Button, Col, Popconfirm, Row, Table} from 'antd';
import moment from "moment";
import * as Setting from "./Setting";
import * as ConferenceBackend from "./backend/ConferenceBackend";

class ConferenceListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      conferences: null,
    };
  }

  componentWillMount() {
    this.getConferences();
  }

  getConferences() {
    ConferenceBackend.getConferences(this.props.account.name)
      .then((res) => {
        this.setState({
          conferences: res,
        });
      });
  }

  newConference() {
    return {
      owner: this.props.account.name,
      name: `conference_${this.state.conferences.length}`,
      createdTime: moment().format(),
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      fullName: `Conference ${this.state.conferences.length}`,
      organizer: "Casbin",
      logo: `${Setting.CdnBaseUrl}/logo/logo_752x368.png`,
      location: "Shanghai, China",
      address: "3663 Zhongshan Road North",
      status: "Public",
      introText: "Introduction..",
      treeItems: [{key: "Home", title: "Home", content: "Content", children: []}],
    }
  }

  addConference() {
    const newConference = this.newConference();
    ConferenceBackend.addConference(newConference)
      .then((res) => {
          Setting.showMessage("success", `Conference added successfully`);
          this.setState({
            conferences: Setting.prependRow(this.state.conferences, newConference),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Conference failed to add: ${error}`);
      });
  }

  deleteConference(i) {
    ConferenceBackend.deleteConference(this.state.conferences[i])
      .then((res) => {
          Setting.showMessage("success", `Conference deleted successfully`);
          this.setState({
            conferences: Setting.deleteRow(this.state.conferences, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Conference failed to delete: ${error}`);
      });
  }

  renderTable(conferences) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '120px',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/conferences/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: 'Start date',
        dataIndex: 'startDate',
        key: 'startDate',
        width: '160px',
        sorter: (a, b) => a.startDate.localeCompare(b.startDate),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'End date',
        dataIndex: 'endDate',
        key: 'endDate',
        width: '160px',
        sorter: (a, b) => a.endDate.localeCompare(b.endDate),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'Full name',
        dataIndex: 'fullName',
        key: 'fullName',
        width: '120px',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      {
        title: 'Organizer',
        dataIndex: 'organizer',
        key: 'organizer',
        width: '120px',
        sorter: (a, b) => a.organizer.localeCompare(b.organizer),
      },
      {
        title: 'Logo',
        dataIndex: 'logo',
        key: 'logo',
        width: '100px',
        render: (text, record, index) => {
          return (
            <div>
              <a target="_blank" href={text}>
                <img src={text} alt={text} width={150} />
              </a>
            </div>
          )
        }
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        width: '120px',
        sorter: (a, b) => a.location.localeCompare(b.location),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        width: '120px',
        sorter: (a, b) => a.address.localeCompare(b.address),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '80px',
        sorter: (a, b) => a.status.localeCompare(b.status),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '120px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/conferences/${record.name}`)}>Edit</Button>
              <Popconfirm
                title={`Sure to delete conference: ${record.name} ?`}
                onConfirm={() => this.deleteConference(index)}
                okText="OK"
                cancelText="Cancel"
              >
                <Button style={{marginBottom: '10px'}} type="danger">Delete</Button>
              </Popconfirm>
            </div>
          )
        }
      },
    ];

    return (
      <div>
        <Table columns={columns} dataSource={conferences} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Conferences&nbsp;&nbsp;&nbsp;&nbsp;
                   <Button type="primary" size="small" onClick={this.addConference.bind(this)}>Add</Button>
                 </div>
               )}
               loading={conferences === null}
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
              this.renderTable(this.state.conferences)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ConferenceListPage;
