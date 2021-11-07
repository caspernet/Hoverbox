import { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import * as Emoji from 'quill-emoji';
import ImageResize from 'quill-image-resize-module-react';
import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';

Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/emoji', Emoji);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['bold', 'italic', 'underline'],
  [{ color: [] }, { background: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ align: [] }],
  ['image', 'link', 'blockquote', 'code-block', 'emoji'],
  ['clean'],
];

export default class Postbox2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    const { text } = this.state;

    return (
      <>
        {/* <div>{text}</div> */}
        {parse(text)}
        <div className="App">
          <ReactQuill
            value={text}
            onChange={(val) => this.setState({ text: val })}
            modules={{
              imageResize: {
                // parchment: Quill.import('parchment'),
                modules: ['Resize', 'DisplaySize'],
              },
              toolbar: {
                container: TOOLBAR_OPTIONS,
              },
              'emoji-toolbar': true,
              'emoji-textarea': false,
              'emoji-shortname': true,
            }}
          />
        </div>
      </>
    );
  }
}
