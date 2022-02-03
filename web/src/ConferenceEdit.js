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
import {Button, Col, Empty, Input, Row, Tooltip, Tree} from "antd";
import {DeleteOutlined, PlusOutlined,} from "@ant-design/icons";
import * as Setting from "./Setting";
import HtmlEditorBraft from "./HtmlEditorBraft";

class ConferenceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      treePath: '0-0',
      expandedKeys: ['0-0', '0-0-0', '0-0-0-0'],
    };
  }

  componentWillMount() {
  }

  onDragEnter = info => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  onDrop = info => {
    // console.log(info);

    const dragIndex = parseInt(info.dragNode.pos.slice(2));
    let dropIndex = parseInt(info.node.pos.slice(2));

    const dragIndexArray = info.dragNode.pos.slice(2).split("-").map(i => parseInt(i));
    const isSecondLevel = info.dropPosition === dropIndex;
    const isSecondLevelOld = dragIndexArray.length === 2;

    // Setting.showMessage("error", `isSecondLevelOld = ${isSecondLevelOld}, isSecondLevel = ${isSecondLevel}, dragIndex = ${dragIndex}, dropIndex = ${dropIndex}`);

    dropIndex = info.dropPosition;
    if (dropIndex === -1) {
      dropIndex = 0;
    } else if (!isSecondLevelOld && dropIndex > dragIndex) {
      dropIndex -= 1;
    }

    // console.log(dragIndex);
    // console.log(dropIndex);

    let treeItems = this.props.conference.treeItems;

    let treeItem = {children: treeItems};
    dragIndexArray.forEach(i => {
      treeItem = treeItem.children[i];
    });

    if (dragIndexArray.length === 1) {
      treeItems = Setting.deleteRow(treeItems, dragIndex);
    } else if (dragIndexArray.length === 2) {
      const parentItem = treeItems[dragIndexArray[0]];
      parentItem.children = Setting.deleteRow(parentItem.children, dragIndexArray[1]);
    }

    if (!isSecondLevel) {
      treeItems = Setting.insertRow(treeItems, treeItem, dropIndex);
    } else {
      treeItems[dropIndex].children.push(treeItem);
    }

    this.props.onUpdateTreeItems(treeItems);
  };

  updateTree(tree) {
    this.props.onUpdateTree(tree);
  }

  updateField(table, index, key, value) {
    table[index][key] = value;
    this.updateTable(table);
  }

  getTreeItem(treeItems) {
    if (this.state.treePath === null) {
      return null;
    }

    let res = {children: treeItems};
    const tokens = this.state.treePath.split("-");
    for (let i = 1; i < tokens.length; i ++) {
      res = res.children[tokens[i]];
    }
    return res;
  }

  addTreeItemRow(i) {
    let treeItems = this.props.conference.treeItems;

    const treeItem = {key: `Title - ${treeItems.length + 1}`, title: `Title - ${treeItems.length + 1}`, titleEn: `Title - ${treeItems.length + 1}`, content: `Content - ${treeItems.length + 1}`, contentEn: `Content - ${treeItems.length + 1}`, children: []};
    treeItems = Setting.insertRow(treeItems, treeItem, i);
    this.props.onUpdateTreeItems(treeItems);
  }

  // deleteTreeItemRow(i) {
  //   let treeItems = this.props.conference.treeItems;
  //
  //   treeItems = Setting.deleteRow(treeItems, i);
  //   this.props.onUpdateTreeItems(treeItems);
  // }

  deleteTreeItemRowEx(indexArray) {
    let treeItems = this.props.conference.treeItems;

    if (indexArray.length === 1) {
      treeItems = Setting.deleteRow(treeItems, indexArray[0]);
    } else if (indexArray.length === 2) {
      const parentItem = treeItems[indexArray[0]];
      parentItem.children = Setting.deleteRow(parentItem.children, indexArray[1]);
    }

    this.props.onUpdateTreeItems(treeItems);
  }

  renderTree(treeItems) {
    // const treeData = this.getTree(treeItems);

    const onSelect = (selectedKeys, info) => {
      // const i = selectedKeys[0];
      const selected = info.selected;
      if (!selected) {
        this.setState({
          treePath: null,
        });
        return;
      }

      const treeItem = info.node;
      this.setState({
        treePath: treeItem.pos, // "0-0"
      });
      // alert(JSON.stringify(treeItem));
    };

    const copiedTreeItems = treeItems.map((treeItem, i) => {
      let copiedTreeItem = Setting.deepCopy(treeItem);
      copiedTreeItem.title = (
          <div>
            <Button style={{marginRight: "5px"}} icon={<DeleteOutlined />} size="small" onClick={() => this.deleteTreeItemRowEx([i])} />
            {
              treeItem.title
            }
          </div>
      );

      copiedTreeItem.children = copiedTreeItem.children.map((treeItem2, j) => {
        let copiedTreeItem2 = Setting.deepCopy(treeItem2);
        copiedTreeItem2.title = (
          <div>
            <Button style={{marginRight: "5px"}} icon={<DeleteOutlined />} size="small" onClick={() => this.deleteTreeItemRowEx([i, j])} />
            {
              treeItem2.title
            }
          </div>
        );

        return copiedTreeItem2;
      })

      return copiedTreeItem;
    })

    return (
      <div>
        <Row style={{marginTop: '10px', marginBottom: '10px'}} >
          <Tooltip placement="topLeft" title="Add">
            <Button style={{marginRight: "5px"}} icon={<PlusOutlined />} size="small" onClick={() => this.addTreeItemRow(this.props.conference.treeItems.length)} />
          </Tooltip>
        </Row>
        <Tree
          className="draggable-tree"
          defaultExpandAll={true}
          // defaultExpandedKeys={this.state.expandedKeys}
          draggable
          blockNode
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          // switcherIcon={<DownOutlined  />}
          icon={null}
          showIcon={true}
          defaultSelectedKeys={treeItems.length > 0 ? [treeItems[0].key] : []}
          onSelect={onSelect}
          treeData={copiedTreeItems}
        />
      </div>
    )
  }

  updateTreeItemField(key, value) {
    let treeItems = this.props.conference.treeItems;
    let treeItem = {children: treeItems};
    const tokens = this.state.treePath.split("-");
    for (let i = 1; i < tokens.length; i ++) {
      treeItem = treeItem.children[tokens[i]];
    }
    treeItem[key] = value;

    this.props.onUpdateTreeItems(treeItems);
  }

  renderPage(treeItem) {
    if (treeItem === undefined || treeItem === null) {
      return (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )
    }

    return (
      <div>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Title:
          </Col>
          <Col span={22} >
            <Input value={this.props.language !== "en" ? treeItem.title : treeItem.titleEn} onChange={e => {
              this.updateTreeItemField('key', e.target.value);
              this.updateTreeItemField(this.props.language !== "en" ? 'title' : 'titleEn', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Content:
          </Col>
          <Col span={22} >
            <div style={{height: '600px', border: '1px solid rgb(217,217,217)'}} >
              <HtmlEditorBraft key={`${treeItem.key}-${this.props.language}`} text={this.props.language !== "en" ? treeItem.content : treeItem.contentEn} onUpdateText={(text) => {
                this.updateTreeItemField(this.props.language !== "en" ? 'content' : 'contentEn', text);
              }} />
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  render() {
    const conference = this.props.conference;

    return (
      <Row style={{marginTop: '10px'}} >
        <Col span={4} >
          {
            this.renderTree(conference.treeItems)
          }
        </Col>
        <Col span={1} >
        </Col>
        <Col span={19} >
          {
            this.renderPage(this.getTreeItem(conference.treeItems))
          }
        </Col>
      </Row>
    )
  }
}

export default ConferenceEdit;
