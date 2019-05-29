import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'semantic-ui-react';
import QRCode from 'qrcode';
import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { IconFace } from '../CopyButton';

const Canvas = styled.canvas`
  display: block;
  margin: 0 auto;
  margin-top: -10px;
`;
const canvasW = 200;
const canvasH = 200;

class QrcodeButton extends PureComponent {
  constructor(...args) {
    super(...args);
    this.setRef = (c) => {
      this.canvasRef = c;
    };
    this.onMount = () => {
      const { qrTxt } = this.props;
      QRCode.toCanvas(
        this.canvasRef,
        qrTxt,
        {
          width: canvasW,
          height: canvasH,
        },
        (error) => {
          if (error) console.error(error);
        }
      );
    };
  }

  render() {
    const { style, titleTxt, intl, tooltipId } = this.props;
    const tooltip = intl.formatMessage({
      id: tooltipId,
    });
    const triggerBtn = (
      <IconFace style={style} data-inverted="" data-tooltip={tooltip} data-position="bottom left" className="iconface">
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconcaidan" />
        </svg>
      </IconFace>
    );
    return (
      <Modal dimmer={false} trigger={triggerBtn} size="mini" closeIcon onMount={this.onMount}>
        <Modal.Header>{titleTxt}</Modal.Header>
        <Modal.Content>
          <Canvas ref={this.setRef} />
        </Modal.Content>
      </Modal>
    );
  }
}

QrcodeButton.propTypes = {
  titleTxt: PropTypes.string,
  qrTxt: PropTypes.string,
  style: PropTypes.shape({
    marginLeft: PropTypes.string,
  }),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
  tooltipId: PropTypes.string,
};
QrcodeButton.defaultProps = {
  titleTxt: '',
  qrTxt: '',
  style: {
    marginLeft: '10px',
  },
  intl: {
    formatMessage: () => {},
  },
  tooltipId: '',
};

export default injectIntl(QrcodeButton);
