import React, { memo } from 'react';
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

const Container = styled.div`
  min-height: 300px;
  width: 100%;
`;

function Dag({ id = 'dag-viewer' } = {}) {
  useMount(async () => {
    await loadDagJs();
    const Player = window.ConfluxDagPlayer;
    const container = document.getElementById(id);
    const initialSubChains = await fetchDagData();
    const player = await new Player({
      backgroundColor: '0x222222',
      doc: container,
      playByDefault: true,
      pointSize: 20,
      globalRadius: 100,
      defaultInterval: 500,
      colors: [0x00e7f7, 0xce9ffc, 0xe9e4f0, 0xfe2f57, 0xff9415, 0xc0a4fa, 0xdeddf0, 0xff9966, 0xff0083, 0x2dbde8],
      chain: initialSubChains.pop().reverse(),
      onBlockClick: ({ hash }) => {
        window.open(`https://confluxscan.io/blocksdetail/${hash}`);
      },
      onBlockMouseOver: (_, p) => {
        p.pause();
      },
      onBlockMouseOut: (_, p) => {
        p.play();
      },
      // debug: true,
    });
    appendAllSubChain(player, initialSubChains);
    startFechingDagData.call(player);
  });

  return <Container id={id} />;
}

Dag.defaultProps = { id: 'dag-viewer' };
Dag.propTypes = { id: PropTypes.string };

export default memo(Dag);
