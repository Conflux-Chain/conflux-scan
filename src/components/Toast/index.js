import React, { Component } from 'react';
import styled from 'styled-components';
import ToastMessage from './ToastMessage';
import media from '../../globalStyles/media';

const Wrap = styled.div`
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 1001;

  ${media.pad`
    top: 66px;
  `}
`;

let toastRef;

const show = ({ content, title = '', conf = {}, level }) => {
  if (!toastRef) {
    return;
  }
  toastRef.addToast({
    content,
    title,
    conf,
    level,
  });
};

class ToastComp extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      toastArr: [],
    };
    this.onClose = this.onClose.bind(this);
  }

  componentDidMount() {
    this.hasRendered = true;
    toastRef = this;
  }

  componentWillUnmount() {
    if (this.hasRendered) {
      toastRef = null;
    }
  }

  onClose(index) {
    let { toastArr } = this.state;
    toastArr = toastArr.slice();
    toastArr.splice(index, 1);
    this.setState({
      toastArr,
    });
  }

  addToast({ content, title, conf, level }) {
    let { toastArr } = this.state;
    toastArr = toastArr.slice();
    const toast = {
      content,
      title,
      level,
    };
    toastArr.push(toast);
    this.setState({
      toastArr,
    });
    if (conf.timeout) {
      setTimeout(() => {
        let { toastArr: toastArrCur } = this.state;
        const curIndex = toastArrCur.indexOf(toast);
        if (curIndex !== -1) {
          toastArrCur.splice(curIndex, 1);
          toastArrCur = toastArrCur.slice();
          this.setState({
            toastArr: toastArrCur,
          });
        }
      }, conf.timeout);
    }
  }

  render() {
    const { toastArr } = this.state;
    return (
      <Wrap>
        {toastArr.map((toast) => {
          return (
            <ToastMessage
              {...{
                level: toast.level,
                content: toast.content,
                title: toast.title,
                onClose: this.onClose,
              }}
            />
          );
        })}
      </Wrap>
    );
  }
}

const toast = {
  container: toastRef,
  success: (a) => show({ ...a, level: 'success' }),
  error: (a) => show({ ...a, level: 'error' }),
  info: (a) => show({ ...a, level: 'info' }),
};

/*
  toast.error({
    content: 'adads',
    title: 'titletitle',
    conf: {
      timeout: 2000,
    },
  });
  toast.success({
    content: 'adads',
    title: 'titletitle',
  });
*/

export { ToastComp, toast };
