import { Component, useState, useCallback, useRef, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import * as Emoji from 'quill-emoji';
import ImageResize from 'quill-image-resize-module-react';
import parse from 'html-react-parser';
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaChevronDown,
} from 'react-icons/fa';
import 'react-quill/dist/quill.snow.css';
import 'quill-emoji/dist/quill-emoji.css';
import './Hoverbox.css';
import './TextField.css';

var Block = Quill.import('blots/block');
Block.tagName = 'p';
Quill.register(Block);

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

/**
 * React Hook for listening to (horizontal) drag changes
 */
const useDragExpander = ({ min, max }) => {
  const [dragState, setDragState] = useState(0);
  const initialPos = useRef(0);
  const timer = useRef();

  const update = useCallback(
    (yPos) =>
      setDragState((state) => ({
        ...state,
        delta: initialPos.current - yPos + state.lastDelta,
      })),
    []
  );

  const onDragMouseDown = (boxHeight, e) => {
    console.log('onDragMouseDown: e', e);
    console.log('onDragMouseDown: boxHeight', boxHeight);
    if (e.button != 0) return; // only allow left-mouse clicks
    e.preventDefault();
    initialPos.current = e.screenY; // re-set initial position
    timer.current = setTimeout(dragStart(e, boxHeight), 0, e); // only allow dragging after N duration mouse down
    window.addEventListener('mouseup', unbind);
  };

  const dragStart = (e, boxHeight) => {
    setDragState((state) => ({
      ...state,
      lastDelta: boxHeight || 0, // state.delta
      isDragging: true,
    }));
    window.addEventListener('mousemove', onDragMove);
  };

  const onDragMove = useCallback(
    (e) => update(e.screenY >= 0 ? e.screenY : 0),
    []
  );

  const unbind = () => {
    clearTimeout(timer.current);
    window.removeEventListener('mousemove', onDragMove);
    setDragState((state) => ({ ...state, isDragging: false }));
  };

  const limitDragRange = useCallback(
    (delta) => Math.min(max, Math.max(min, delta || 0)),
    []
  );

  return {
    onDragMouseDown,
    onDragMove,
    dragState,
    setDragState,
    limitDragRange,
  };
};

function Gripple({ boxHeightCallback, currentBoxHeight }) {
  const { onDragMouseDown, dragState, limitDragRange } = useDragExpander({
    min: 300,
    max: window.innerHeight,
  });
  console.log('Gripple() currentBoxHeight', currentBoxHeight);
  let dragHeight = limitDragRange(dragState.delta);
  useEffect(() => {
    boxHeightCallback(dragHeight); // update grippler box height
    const root = document.documentElement; // update ql-editor height css variable
    // root?.style.setProperty('--ql-editor-height', `${dragHeight - 123}px`);
    root?.style.setProperty('--form-area-height', `${dragHeight - 3}px`);
    const h = root?.style.getPropertyValue('--form-area-height');
    console.log('Gripple() --form-area-height', h);
  }, [dragHeight]);

  // render-props method: get currently viewed section while scrolling:
  return (
    <div
      className="gripple"
      onMouseDown={onDragMouseDown.bind(this, currentBoxHeight)}
    >
      <div></div>
      <div></div>
    </div>
  );
}

export default class Hoverbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      boxHeight: 500,
      onAdjustHeight: true,
      previewOpened: false,
      boxMinimised: false,
    };
  }

  getBoxHeight = (newBoxHeight) => {
    this.setState({ boxHeight: newBoxHeight });
    console.log('getBoxHeight() this.state.boxHeight', this.state.boxHeight);
  };

  tooglePreview = (e) => {
    e.preventDefault();
    this.setState({ previewOpened: !this.state.previewOpened });
    console.log(
      'tooglePreview() this.state.previewOpened',
      this.state.previewOpened
    );
  };

  toogleBoxMinimiser = (e) => {
    e.preventDefault();
    this.setState({ boxMinimised: !this.state.boxMinimised });
    console.log(
      'toogleBoxMinimiser() this.state.boxMinimised',
      this.state.boxMinimised
    );
  };

  render() {
    const { text } = this.state;

    return (
      // <ResizePanel direction="s" style={{ height: '200px' }}>
      <section
        className={!this.state.boxMinimised ? 'hoverbox' : 'hoverbox--hidden'}
        // style={{ minHeight: `${this.state.boxHeight}px` }}
      >
        <Gripple
          boxHeightCallback={this.getBoxHeight}
          currentBoxHeight={this.state.boxHeight}
        />
        {/* Box Minimise Button */}
        <button
          onClick={this.toogleBoxMinimiser}
          className={
            this.state.boxMinimised
              ? 'btn boxResumer'
              : 'btn boxResumer--hidden'
          }
        >
          {/* btn btn-secondary */}
          {this.state.boxMinimised ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div
          className={!this.state.boxMinimised ? 'box-area' : 'box-area--hidden'}
        >
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
                bounds={'#parent'}
                theme={'snow'}
              />
            </section>
            <div className="control-area">
              {/* post-editer__controll */}
              <button className="btn btn-primary submit">
                {/* btn btn-primary */}
                <FaPlus />
                <span className="button-label">Create Topic</span>
                {/* <FontAwesomeIcon icon="check-square" /> */}
              </button>

              <button
                onClick={console.log('Cancel Event.')}
                className="btn cancel"
              >
                {/* btn btn-secondary */}
                Cancel
              </button>

              {/* Box Minimise Button */}
              <button
                onClick={this.toogleBoxMinimiser}
                className="btn boxMinimiser"
              >
                {/* btn btn-secondary */}
                {this.state.boxMinimised ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {/* Preview Toogle Button */}
              <button
                onClick={this.tooglePreview}
                className="btn tooglePreview"
              >
                {/* btn btn-secondary */}
                {this.state.previewOpened ? (
                  <FaChevronRight />
                ) : (
                  <FaChevronLeft />
                )}
              </button>
            </div>
          </div>
          <div
            className={
              !this.state.previewOpened
                ? 'preview-area--hidden'
                : 'preview-area'
            }
          >
            <div className="preview-box">{parse(text)}</div>
          </div>
        </div>
      </section>
      // </ResizePanel>
    );
  }
}
