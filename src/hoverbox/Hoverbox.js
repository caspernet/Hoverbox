import { Component, useState, useCallback, useRef, useEffect } from 'react';
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

  const onDragMove = useCallback((e) => update(e.screenY), []);

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
    max: 1000,
  });
  console.log('Gripple() currentBoxHeight', currentBoxHeight);
  let dragHeight = limitDragRange(dragState.delta);
  useEffect(() => boxHeightCallback(dragHeight), [dragHeight]);

  // render-props method: get currently viewed section while scrolling:
  return (
    <div
      className="gripple"
      onMouseDown={onDragMouseDown.bind(this, currentBoxHeight)}
      // limitDragRange(dragState.delta)
    >
      {/* <p>{limitDragRange(dragState.delta)}</p> */}
      <div></div>
      <div></div>
    </div>
  );
}

// class Gripple2 extends Component {
//   const { onDragMouseDown, dragState, limitDragRange } = useDragExpander({
//     min: 50,
//     max: 200,
//   });

//   // render-props method: get currently viewed section while scrolling:
//   this.props.getBoxHeight = dragState.delta;
//   render() {
//   return (
//     <div
//       className="gripple"
//       onMouseDown={onDragMouseDown}
//       // limitDragRange(dragState.delta)
//     >
//       <p>{limitDragRange(dragState.delta)}</p>
//       <div></div>
//       <div></div>
//     </div>
//   );
//   }
// }

export default class Hoverbox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      boxHeight: 500,
      onAdjustHeight: true,
    };
  }

  // adjustHeight = (e) => {
  //   const { onAdjustHeight } = this.state;
  //   if (onAdjustHeight) {
  //     // const { boxHeight } = this.state;
  //     const { innerWidth: width, innerHeight: height } = window;
  //     this.setState({
  //       boxHeight: height - e.clientY,
  //     });
  //     console.log(e);
  //     console.log('innerHeight = ', height);
  //     console.log('e.clientY = ', e.clientY);
  //     console.log('boxHeight = ', this.state.boxHeight);
  //   }
  // };
  getBoxHeight = (newBoxHeight) => {
    this.setState({ boxHeight: newBoxHeight });
    console.log('getBoxHeight() this.state.boxHeight', this.state.boxHeight);
  };

  render() {
    const { text } = this.state;

    return (
      // <ResizePanel direction="s" style={{ height: '200px' }}>
      <section
        className="hoverbox"
        style={{ minHeight: `${this.state.boxHeight}px` }}
      >
        {/* <div
          className="gripple"
          // onMouseDown={this.setState({ onAdjustHeight: true })}
          onMouseMove={(e) => this.adjustHeight(e)}
          // onMouseUp={this.setState({ onAdjustHeight: false })}
        >
          <div></div>
          <div></div>
        </div> */}

        <Gripple
          boxHeightCallback={this.getBoxHeight}
          currentBoxHeight={this.state.boxHeight}
        />
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
                {/* <FontAwesomeIcon icon="check-square" /> */}
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
