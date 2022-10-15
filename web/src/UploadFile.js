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
import {Modal, Upload} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import * as Setting from "./Setting";

class UploadFile extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
    previewTitle: "",
    fileList: this.getInitFileList(),
  };

  handleCancel = () => this.setState({previewVisible: false});

  isFileAccepted(filename, accept) {
    const tokens = accept.split(",");
    for (let i = 0; i < tokens.length; i++) {
      if (filename.endsWith(tokens[i])) {
        return true;
      }
    }
    return false;
  }

  updateSubmission(key, value) {
    this.props.onUpdateSubmission(key, value);
  }

  getInitFileList() {
    const fileList = [];
    if (this.props.fileUrl !== "") {
      const fileUrl = this.props.fileUrl;
      const fileName = Setting.getShortName(fileUrl);
      const file = {
        name: fileName,
        status: "success",
        url: fileUrl,
      };
      fileList.push(file);
    }
    return fileList;
  }

  render() {
    const {previewVisible, previewImage, previewTitle, fileList} = this.state;

    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{marginTop: 8}}>
          {
            this.props.label
          }
        </div>
      </div>
    );

    const accept = this.props.accept;
    return (
      <React.Fragment>
        <Upload
          disabled={this.props.disabled}
          name="file"
          accept={accept}
          method="post"
          action={`${Setting.ServerUrl}/api/upload-submission-file`}
          withCredentials={true}
          listType="picture-card"
          fileList={fileList}
          showUploadList={{
            // showPreviewIcon: false,
            // showRemoveIcon: false,
            showDownloadIcon: true,
            downloadIcon: "Download ",
            // downloadIcon: <PlusOutlined onClick={e => console.log(e, 'custom event')} />,
            // removeIcon: "remove "
          }}
          // onDownload={file => {alert("111")}}
          beforeUpload={file => {
            if (!this.isFileAccepted(file.name, accept)) {
              file.flag = true;
              Setting.showMessage("error", `Uploaded file format must be: ${accept}`);
              return false;
            }
            return true;
          }}
          onPreview={file => {
            Setting.openLink(file.url);
          }}
          // onPreview={this.handlePreview}
          onChange={info => {
            const fileList = info.fileList.filter(file => file.flag !== true);
            this.setState({
              fileList: fileList,
            });

            // delete
            if (info.fileList.length === 0) {
              this.updateSubmission(this.props.urlKey, "");
              return;
            }

            // console.log(JSON.stringify(info));
            const {status, response: res} = info.file;
            if (status !== "uploading") {
              // console.log(info.file, info.fileList);
            }
            if (status === "done") {
              if (res.status === "ok") {
                // Setting.showMessage("success", `File uploaded successfully`);

                let url = res.msg;
                url = url.substring(0, url.lastIndexOf("?"));

                // const fileSize = res.data;
                // const objectKey = res.data2;
                this.updateSubmission(this.props.urlKey, url);
              } else {
                Setting.showMessage("error", `File failed to import: ${res.msg}`);
              }
            } else if (status === "error") {
              Setting.showMessage("error", "File failed to upload");
            }
          }}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{width: "100%"}} src={previewImage} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default UploadFile;
