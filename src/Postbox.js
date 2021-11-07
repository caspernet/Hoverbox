import React from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import quillEmoji from 'quill-emoji';
import * as Emoji from 'quill-emoji';
import 'quill-emoji/dist/quill-emoji.css'; //这个不引入的话会出现emoji框一直在输入框下面的情况
import { ImageDrop } from 'quill-image-drop-module'; //讲图片拖进文本框，可以直接安装quill-image-drop-module；但由于我的webpack版本过低，无法兼容es6，所以把插件拿出来了
//注册ToolbarEmoji，将在工具栏出现emoji；注册TextAreaEmoji，将在文本输入框处出现emoji。VideoBlot是我自定义的视频组件，后面会讲，
import ImageResize from 'quill-image-resize-module-react';
const { EmojiBlot, VideoBlot, ShortNameEmoji, ToolbarEmoji, TextAreaEmoji } =
  quillEmoji;
Quill.register(
  {
    // 'formats/emoji': EmojiBlot,
    // // 'formats/video': VideoBlot,
    // 'modules/emoji-shortname': ShortNameEmoji,
    // 'modules/emoji-toolbar': ToolbarEmoji,
    // 'modules/emoji-textarea': TextAreaEmoji,
    'modules/emoji': Emoji,
    // 'modules/ImageExtend': ImageExtend, //拖拽图片扩展组件
    'modules/ImageDrop': ImageDrop, //复制粘贴组件
    'modules/imageResize': ImageResize,
  },
  true
);

class Postbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: '' }; // You can also pass a Quill Delta here
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ text: value });
  }

  postScript2 = () => {
    return this.state.text;
  };
  // quillbox = () => {
  //   const toolbarOptions = {
  //     container: [['bold', 'italic', 'underline', 'strike'], ['emoji']],
  //     handlers: { emoji: function () {} },
  //   };
  //   const quill = new Quill(editor,
  //       value:{this.state.text},
  //       onChange:{this.handleChange},
  //     modules: {
  //       toolbar: toolbarOptions,
  //       'emoji-toolbar': true,
  //       'emoji-textarea': true,
  //       'emoji-shortname': true,
  //       imageDrop: true,
  //     },
  //   );
  //   return quill;
  // };
  modules = {
    imageResize: {
      // parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize'],
    },
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['clean'],
        ['emoji'],
        ['link', 'image', 'video'],
      ],
      handlers: {
        // image() {
        //   imageHandler.call(this, props.action);
        // },
        emoji: function () {},
      },
    },
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
    // imageDrop: true,
  };

  formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
  ];

  render() {
    let postScript = this.state.text;
    function postScript2() {
      return this.state.text;
    }
    console.log(postScript);
    return (
      <>
        {/* <postScript2 /> */}
        {postScript}
        {/* <quillbox /> */}
        {/* <ReactQuill value={this.state.text} onChange={this.handleChange} /> */}
        <ReactQuill
          theme="snow"
          value={this.state.text || ''}
          onChange={this.handleChange}
          modules={this.modules}
          formats={this.formats}
        />
      </>
    );
  }
}

export default Postbox;
