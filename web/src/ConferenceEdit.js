import React from "react";
import {Button, Col, Empty, Input, Row, Tooltip, Tree} from "antd";
import {DeleteOutlined, PlusOutlined,} from "@ant-design/icons";
import * as Setting from "./Setting";
import HtmlEditorBraft from "./HtmlEditorBraft";

const x = 3;
const y = 2;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

class ConferenceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      treePath: null,
      gData,
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
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    const data = [...this.state.gData];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    this.setState({
      gData: data,
    });
  };

  updateTree(tree) {
    this.props.onUpdateTree(tree);
  }

  updateField(table, index, key, value) {
    table[index][key] = value;
    this.updateTable(table);
  }

  addTreeNode(tree, i) {
    let row = {name: "Please select a provider", canSignUp: false, canSignIn: true, canUnlink: true, alertType: "None"};
    if (tree === undefined) {
      tree = [];
    }
    tree = Setting.addRow(tree, row);
    this.updateTree(tree);
  }

  deleteTreeNode(tree, i) {
    tree = Setting.deleteRow(tree, i);
    this.updateTree(tree);
  }

  getTree(nodeData) {
    const tree = [{key: "111", title: "111", children: []}];
    const node = (
      ({
        title: (
          <div>
            {
              nodeData.name
            }
            <Tooltip placement="topLeft" title={"Add"}>
              <Button style={{marginRight: "5px"}} icon={<PlusOutlined />} size="small" onClick={() => this.addTreeNode(nodeData, 0)} />
            </Tooltip>
            <Tooltip placement="topLeft" title={"Delete"}>
              <Button icon={<DeleteOutlined />} size="small" onClick={() => this.deleteTreeNode(nodeData, 0)} />
            </Tooltip>
          </div>
        ),
        key: nodeData.key,
        children: nodeData.children?.map((child, i) => this.renderTreeNode(child)),
      })
    );
    return tree;
  }

  getTreeItem(treeItems) {
    if (this.state.treePath === null) {
      return null;
    }

    let res = treeItems;
    const tokens = this.state.treePath.split("-");
    for (let i = 1; i < tokens.length; i ++) {
      res = res[tokens[i]];
    }
    return res;
  }

  addTreeItemRow() {
    let treeItems = this.props.conference.treeItems;

    const treeItem = {key: `Title - ${treeItems.length + 1}`, title: `Title - ${treeItems.length + 1}`, content: `Content - ${treeItems.length + 1}`, children: []};
    treeItems = Setting.addRow(treeItems, treeItem);
    this.props.onUpdateTreeItems(treeItems);
  }

  deleteTreeItemRow() {
    let treeItems = this.props.conference.treeItems;

    treeItems = Setting.deleteRow(treeItems, treeItems.length - 1);
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

    // let data = `[{"title":"0-0","key":"0-0","children":[{"title":"0-0-0","key":"0-0-0","children":[{"title":"0-0-0-0","key":"0-0-0-0"},{"title":"0-0-0-1","key":"0-0-0-1"},{"title":"0-0-0-2","key":"0-0-0-2"}]},{"title":"0-0-1","key":"0-0-1","children":[{"title":"0-0-1-0","key":"0-0-1-0"},{"title":"0-0-1-1","key":"0-0-1-1"},{"title":"0-0-1-2","key":"0-0-1-2"}]},{"title":"0-0-2","key":"0-0-2"}]},{"title":"0-1","key":"0-1","children":[{"title":"0-1-0","key":"0-1-0","children":[{"title":"0-1-0-0","key":"0-1-0-0"},{"title":"0-1-0-1","key":"0-1-0-1"},{"title":"0-1-0-2","key":"0-1-0-2"}]},{"title":"0-1-1","key":"0-1-1","children":[{"title":"0-1-1-0","key":"0-1-1-0"},{"title":"0-1-1-1","key":"0-1-1-1"},{"title":"0-1-1-2","key":"0-1-1-2"}]},{"title":"0-1-2","key":"0-1-2"}]},{"title":"0-2","key":"0-2"}]`
    // alert(JSON.stringify(this.state.gData))
    return (
      <div>
        <Row style={{marginTop: '10px', marginBottom: '10px'}} >
          <Tooltip placement="topLeft" title="Add">
            <Button style={{marginRight: "5px"}} icon={<PlusOutlined />} size="small" onClick={() => this.addTreeItemRow()} />
          </Tooltip>
          <Tooltip placement="topLeft" title="Delete">
            <Button icon={<DeleteOutlined />} size="small" onClick={() => this.deleteTreeItemRow()} />
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
          defaultSelectedKeys={[]}
          onSelect={onSelect}
          // treeData={this.state.gData}
          treeData={treeItems}
        />
      </div>
    )
  }

  updateTreeItemField(key, value) {
    let treeItems = this.props.conference.treeItems;
    let treeItem = treeItems;
    const tokens = this.state.treePath.split("-");
    for (let i = 1; i < tokens.length; i ++) {
      treeItem = treeItem[tokens[i]];
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
            <Input value={treeItem.title} onChange={e => {
              this.updateTreeItemField('key', e.target.value);
              this.updateTreeItemField('title', e.target.value);
            }} />
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}} >
          <Col style={{marginTop: '5px'}} span={2}>
            Content:
          </Col>
          <Col span={22} >
            <div style={{height: '600px', border: '1px solid rgb(217,217,217)'}} >
              <HtmlEditorBraft key={treeItem.key} text={treeItem.content} onUpdateText={(text) => {
                this.updateTreeItemField('content', text);
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
