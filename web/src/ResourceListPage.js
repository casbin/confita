import React from "react";
import {Link} from "react-router-dom";
import {Button, Col, Popconfirm, Row, Table, Tooltip, Upload} from 'antd';
import {EditOutlined, UploadOutlined} from "@ant-design/icons";
import moment from "moment";
import copy from 'copy-to-clipboard';
import * as Setting from "./Setting";
import * as ResourceBackend from "./backend/ResourceBackend";

const resourceTypes = [
  {id: 'image', name: 'Image'},
  {id: 'video', name: 'Video'},
];

class ResourceListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      resources: null,
      fileList: [],
    };
  }

  componentDidMount() {
    this.getResources();
  }

  getResources() {
    ResourceBackend.getResources(this.props.account.name)
      .then((res) => {
        this.setState({
          resources: res,
        });
      });
  }

  newResource() {
    return {
      owner: this.props.account.name,
      name: `resource_${this.state.resources.length}`,
      createdTime: moment().format(),
      type: "image",
      fileFormat: "",
      fileSize: 0,
      conference: "",
      url: "",
      objectKey: "",
    }
  }

  addResource(url, fileSize, objectKey) {
    const newResource = this.newResource();
    newResource.name = Setting.getShortName(url);
    newResource.fileFormat = newResource.name.split('.').pop().toLowerCase();
    if (newResource.fileFormat === "png" || newResource.fileFormat === "jpg") {
      newResource.type = "image";
    } else if (newResource.fileFormat === "mp4") {
      newResource.type = "video";
    } else {
      newResource.type = "unknown";
    }

    newResource.fileSize = fileSize;
    newResource.url = url;
    newResource.objectKey = objectKey;
    ResourceBackend.addResource(newResource)
      .then((res) => {
        Setting.showMessage("success", `Resource added successfully`);
          this.setState({
            resources: Setting.prependRow(this.state.resources, newResource),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Resource failed to add: ${error}`);
      });
  }

  deleteResource(i) {
    ResourceBackend.deleteResource(this.state.resources[i])
      .then((res) => {
        Setting.showMessage("success", `Resource deleted successfully`);
          this.setState({
            resources: Setting.deleteRow(this.state.resources, i),
          });
        }
      )
      .catch(error => {
        Setting.showMessage("error", `Resource failed to delete: ${error}`);
      });
  }

  isFileAccepted(filename, accept) {
    const tokens = accept.split(",");
    for (let i = 0; i < tokens.length; i ++) {
      if (filename.endsWith(tokens[i])) {
        return true;
      }
    }
    return false;
  }

  renderUpload() {
    const accept = '.png,.jpg,.mp4';
    const props = {
      name: 'file',
      accept: accept,
      method: 'post',
      action: `${Setting.ServerUrl}/api/upload-resource`,
      withCredentials: true,
      fileList: this.state.fileList,
      beforeUpload: file => {
        if (!this.isFileAccepted(file.name, accept)) {
          file.flag = true;
          Setting.showMessage("error", `Uploaded file format must be: ${accept}`);
          return false;
        }
        return true;
      },
      onChange: (info) => {
        const fileList = info.fileList.filter(file => file.flag !== true);
        this.setState({
          fileList: fileList,
        });

        const { status, response: res } = info.file;
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          if (res.status === 'ok') {
            const url = res.msg;
            const fileSize = res.data;
            const objectKey = res.data2;
            this.addResource(url, fileSize, objectKey);
          } else {
            Setting.showMessage("error", `Resource failed to import: ${res.msg}`);
          }
        } else if (status === 'error') {
          Setting.showMessage("error", `File failed to upload`);
        }
      },
    };

    return (
      <Upload {...props}>
        <Button type="primary" size="small">
          <UploadOutlined /> Add (.png, .jpg, .mp4)
        </Button>
      </Upload>
    )
  }

  renderTable(resources) {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (text, record, index) => {
          return (
            <Link to={`/resources/${text}`}>
              {text}
            </Link>
          )
        }
      },
      {
        title: 'Created time',
        dataIndex: 'createdTime',
        key: 'createdTime',
        // width: '120px',
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, record, index) => {
          return Setting.getFormattedDate(text);
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        // width: '80px',
        sorter: (a, b) => a.type.localeCompare(b.type),
        render: (text, record, index) => {
          const resourceType = resourceTypes.filter(resourceType => resourceType.id === text)[0];
          return resourceType !== undefined ? resourceType.name : "Unknown";
        }
      },
      {
        title: 'File format',
        dataIndex: 'fileFormat',
        key: 'fileFormat',
        // width: '80px',
        sorter: (a, b) => a.fileFormat.localeCompare(b.fileFormat),
      },
      {
        title: 'File size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        // width: '80px',
        sorter: (a, b) => a.fileSize - b.fileSize,
        render: (text, record, index) => {
          return Setting.getFriendlyFileSize(text);
        }
      },
      {
        title: 'Conference',
        dataIndex: 'conference',
        key: 'conference',
        // width: '80px',
        sorter: (a, b) => a.conference.localeCompare(b.conference),
        render: (text, record, index) => {
          if (text === "") {
            return "(Global)";
          }

          return (
            <div style={{display: "inline"}}>
              <Tooltip placement="topLeft" title="Edit">
                <Button style={{marginRight: "5px"}} icon={<EditOutlined />} size="small" onClick={() => this.props.history.push(`/conferences/${text}`)} />
              </Tooltip>
              {
                text
              }
            </div>
          )
        }
      },
      {
        title: 'Preview',
        dataIndex: 'url',
        key: 'url',
        render: (text, record, index) => {
          if (record.type === "image") {
            return (
              <div>
                <a target="_blank" href={text}>
                  <img src={text} alt={text} width={200} style={{marginBottom: '20px'}}/>
                </a>
              </div>
            )
          } else if (record.type === "video") {
            return (
              <div>
                <video width={200} controls>
                  <source src={text} type="video/mp4" />
                </video>
              </div>
            )
          }
        }
      },
      {
        title: 'URL',
        dataIndex: 'url',
        key: 'url',
        width: '120px',
        render: (text, record, index) => {
          return (
            <div>
              <Button type="normal" onClick={() => {
                copy(record.url);
                Setting.showMessage("success", `Link copied to clipboard successfully`);
              }}
              >
                Copy Link
              </Button>
            </div>
          )
        }
      },
      {
        title: 'Action',
        dataIndex: '',
        key: 'op',
        width: '220px',
        render: (text, record, index) => {
          return (
            <div>
              <Button style={{marginTop: '10px', marginBottom: '10px', marginRight: '10px'}} type="primary" onClick={() => this.props.history.push(`/resources/${record.name}`)}>Edit</Button>
              <Popconfirm
                title={`Sure to delete resource: ${record.name} ?`}
                onConfirm={() => this.deleteResource(index)}
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
        <Table columns={columns} dataSource={resources} rowKey="name" size="middle" bordered pagination={{pageSize: 100}}
               title={() => (
                 <div>
                   Resources&nbsp;&nbsp;&nbsp;&nbsp;
                   {
                     this.renderUpload()
                   }
                 </div>
               )}
               loading={resources === null}
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
              this.renderTable(this.state.resources)
            }
          </Col>
          <Col span={1}>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ResourceListPage;
