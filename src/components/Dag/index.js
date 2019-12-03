import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useMount } from 'react-use';
import { reqRecentDagBlock } from '../../utils/api';

function loadDagJs() {
  if (window.ConfluxDagPlayer) return Promise.resolve();
  const script = document.createElement('script');
  script.src = '/conflux-dag.js';
  document.body.appendChild(script);
  return new Promise((resolve) => {
    script.onload = () => {
      resolve();
    };
  });
}
function appendAllSubChain(player, subChains) {
  while (subChains.length) {
    player.appendData(subChains.pop().reverse());
  }
}

function fetchDagData() {
  return reqRecentDagBlock().then(({ code = 0, message = '', result = { epochNumber: null, data: [] } } = {}) => {
    if (code) throw new Error(`Error while fetching dag data:\n${message}`);
    if (this && this instanceof window.ConfluxDagPlayer) return appendAllSubChain(this, result.data);
    return result.data;
  });
}

function startFechingDagData() {
  setInterval(fetchDagData.bind(this), 5000);
}

const Container = styled.div``;
const ToolTipWrapper = styled.div`
  position: relative;
  height: 0;
`;
const Tooltip = styled.div`
  position: absolute;
  padding: 14px 13px;
  border-radius: 4px;
  box-shadow: 1px 2px 8px rgba(0, 0, 0, 0.16);
  background: white;
  position: absolute;
  color: #5c5c5c;
  font-size: 12px;
  line-height: 12px;
  white-space: pre-wrap;
  pointer-event: none;
`;
const ArrowLeft = styled.div`
  position: absolute;
  left: -6px;
  width: 0;
  height: 0;
  border-top: 6.5px solid transparent;
  border-bottom: 6.5px solid transparent;
  border-right: 6.5px solid white;
`;
const ArrowRight = styled.div`
  position: absolute;
  right: -6px;
  width: 0;
  height: 0;
  border-top: 6.5px solid transparent;
  border-bottom: 6.5px solid transparent;
  border-left: 6.5px solid white;
`;

const pointSize = 24;

function Dag({ id = 'dag-viewer', children } = {}) {
  const [tooltipOpt, setTooltipOpt] = useState({
    transform: '',
    direction: '',
    text: '',
    style: { top: 0, left: 0, visibility: 'hidden' },
  });
  useMount(async () => {
    await loadDagJs();
    const Player = window.ConfluxDagPlayer;
    const container = document.getElementById(id);
    const initialSubChains = await fetchDagData();
    const player = await new Player({
      backgroundColor: '0x0B3560',
      doc: container,
      playByDefault: 500,
      pointSize,
      globalRadius: 100,
      defaultInterval: 500,
      colors: [0x76e2e0, 0xc79af5, 0xe4dcef, 0xf2a9b7, 0xf2be81, 0xc29af5, 0xdfdcef, 0xeca987, 0xe087ad, 0x85cfe8, 0xe0e0e0],
      chain: initialSubChains.pop().reverse(),
      onBlockClick: ({ hash }) => {
        window.open(`/blocksdetail/${hash}`);
      },
      onBlockMouseOver: ({ mesh, meshPosition }, p) => {
        if (mesh.refBlocksInfo.length) {
          let refHashes = '';
          refHashes = 'Ref block hashes:\n';
          // eslint-disable-next-line no-return-assign
          mesh.refBlocksInfo.forEach(({ hash: refHash }, idx) => (refHashes += `[${idx}]:${refHash}\n`));
          const useRightArrow = meshPosition.x > document.getElementById(id).clientWidth / 2;
          setTooltipOpt({
            direction: useRightArrow ? 'right' : 'left',
            text: refHashes,
            style: {
              transform: useRightArrow ? 'translateX(-100%)' : undefined,
              left: `${useRightArrow ? meshPosition.x - pointSize : meshPosition.x + pointSize}px`,
              top: `${meshPosition.y - pointSize}px`,
              visibility: 'visible',
            },
          });
        }
        p.pause();
      },
      onBlockMouseOut: (_, p) => {
        setTooltipOpt({ style: { visibility: 'hidden' } });
        p.play();
      },
      // debug: true,
    });
    appendAllSubChain(player, initialSubChains);
    startFechingDagData.call(player);
  });
  const { style, direction, text } = tooltipOpt;

  return (
    <Container id={id}>
      {[children]}
      <ToolTipWrapper>
        <Tooltip style={style}>
          {direction === 'left' && <ArrowLeft />}
          {direction === 'right' && <ArrowRight />}
          {text}
        </Tooltip>
      </ToolTipWrapper>
    </Container>
  );
}

Dag.defaultProps = { id: 'dag-viewer', children: undefined };
Dag.propTypes = { id: PropTypes.string, children: PropTypes.element };

export default memo(Dag);
