import 'braft-editor/dist/index.css'
import React from "react";
import BraftEditor from "braft-editor";

const fontFamilies = [
  { name: '宋体', family: 'SimSun' },
  { name: '黑体', family: 'SimHei' },
  { name: '微软雅黑', family: 'Microsoft YaHei , Helvetica, sans-serif' },
  { name: '楷体', family: 'KaiTi' },
  { name: '仿宋', family: 'FangSong' },
  { name: 'Arial', family: 'Arial, Helvetica, sans-serif' },
  { name: 'Times New Roman', family: 'Times-New-Roman' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Impact', family: 'Impact, serif' },
  { name: 'Monospace', family: '"Courier New", Courier, monospace' },
  { name: 'Tahoma', family: "tahoma, arial, 'Hiragino Sans GB', 宋体, sans-serif" },
];

class HtmlEditorBraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      // font-family style lost:
      // https://github.com/margox/braft-editor/issues/775
      editorState: BraftEditor.createEditorState(this.props.text, { fontFamilies: fontFamilies }),
    };
  }

  updateText(text) {
    this.props.onUpdateText(text);
  }

  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
    });

    let text = editorState.toHTML();
    if (text.startsWith("<p>") && text.endsWith("</p>")) {
      text = text.slice(3, -4);
    }

    this.updateText(text);
  }

  render() {
    const controls = [
      'undo', 'redo', 'separator',
      'remove-styles', 'hr', 'separator',
      'bold', 'italic', 'underline', 'strike-through', 'superscript', 'subscript', 'separator',
      'headings', 'blockquote', 'code', 'list_ul', 'list_ol', 'separator',
      'link', 'text-color', 'line-height', 'letter-spacing', 'text-indent', 'separator',
      'font-size', 'font-family', 'text-align', 'separator',
      'media', 'emoji', 'clear', 'fullscreen',
    ];

    return (
      <div>
        <BraftEditor
          controls={controls}
          fontFamilies={fontFamilies}
          letterSpacings={[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 30, 40, 50]}
          value={this.state.editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default HtmlEditorBraft;
