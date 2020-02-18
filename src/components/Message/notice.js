import React, { Component } from 'react';
import styled from 'styled-components';
import Message from './index';
import media from '../../globalStyles/media';

const Wrap = styled.div`
  position: fixed;
  display: table;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  ${media.pad`
    top: 37px;
  `}
`;
const MessageWrap = styled.div`
  margin-bottom: 5px;
`;

let noticeRef;

const show = (...args) => {
  if (!noticeRef) {
    return;
  }
  noticeRef.addNotice(...args);
};

class NoticeComp extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      msgArr: [],
    };
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.hasRendered = true;
    noticeRef = this;
  }

  componentWillUnmount() {
    if (this.hasRendered) {
      noticeRef = null;
    }
  }

  onClose(index) {
    let { msgArr } = this.state;
    msgArr = msgArr.slice();
    msgArr.splice(index, 1);
    this.setState({
      msgArr,
    });
  }

  addNotice({ content, type, timeout }) {
    let { msgArr } = this.state;
    msgArr = msgArr.slice();
    const item = {
      content,
      type,
    };
    msgArr.push(item);
    this.setState({
      msgArr,
    });
    if (timeout) {
      setTimeout(() => {
        let { msgArr: msgArrCur } = this.state;
        const curIndex = msgArrCur.indexOf(item);
        if (curIndex !== -1) {
          msgArrCur.splice(curIndex, 1);
          msgArrCur = msgArrCur.slice();
          this.setState({
            msgArr: msgArrCur,
          });
        }
      }, timeout);
    }
  }

  render() {
    const { msgArr } = this.state;
    return (
      <Wrap>
        {msgArr.map((v) => (
          <MessageWrap>
            <Message
              {...{
                type: v.type,
                onClose: this.onClose,
              }}
            >
              {v.content}
            </Message>
          </MessageWrap>
        ))}
      </Wrap>
    );
  }
}

const notice = {
  container: noticeRef,
  show: (...a) => {
    show(...a);
  },
};

export { NoticeComp, notice };
