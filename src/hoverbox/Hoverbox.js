import { Component } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import * as Emoji from 'quill-emoji';
import ImageResize from 'quill-image-resize-module-react';
import parse from 'html-react-parser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './Hoverbox.css';
import './TextField.css';

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

export default class Hoverbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    const { text } = this.state;

    return (
      // <ResizePanel direction="s" style={{ height: '200px' }}>
      <section className="hoverbox">
        <div className="gripple">
          <div></div>
          <div></div>
        </div>
        <div className="box-area">
          <div className="form-area">
            {/* post-editer */}
            <div className="reply-area">
              {/* post-editer__reply */}
              <div className="reply-to"></div>
            </div>
            <div className="title-categery">
              {/* post-editer__subject */}
              {/* post-editor__title */}
              <input
                className="input"
                id="title"
                type="text"
                placeholder="Your topic"
              />
              {/* post-editer__category */}
              <input
                className="input"
                id="category"
                type="text"
                placeholder="Categrey"
              />
            </div>
            {/* post-editer__content */}
            <section className="quill__wrapper">
              <ReactQuill
                className="quill-editor"
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
                placeholder={'Compose an epic...'}
              />
            </section>
            <div className="control-area">
              {/* post-editer__controll */}
              <button className="btn btn-primary submit">
                {/* btn btn-primary */}
                <FontAwesomeIcon className="btn-icon" icon={faPlus} />
                <span className="button-label">Create Topic</span>
                <FontAwesomeIcon icon="check-square" />
              </button>
              <button
                onClick={console.log('Cancel Event.')}
                className="btn cancel"
              >
                {/* btn btn-secondary */}
                Cancel
              </button>
            </div>
          </div>
          <div
            className={text === '' ? 'preview-area--hidden' : 'preview-area'}
          >
            <div className="preview-box">{parse(text)}</div>
          </div>
        </div>
      </section>
      // </ResizePanel>
    );
  }
}
