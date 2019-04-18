import React from 'react';
import { Collapse } from 'antd';

const Panel = Collapse.Panel;

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households
    across the world.
  </p>
);

function JoinUs() {
  return (
    <div className="join-box">
      <div className="jo-img" />
      <section className="jo-con">
        <div className="jo-con1">
          <p className="con1-title">我是标题</p>
          <p className="con1-con">我是内容</p>
          <p className="con1-con">我是内容</p>
          <p className="con1-con">我是内容</p>
        </div>
        <div className="jo-con2">
          <img className="con2-img" src={require('../../assets/images/joinImg/teams.png')} />
        </div>
        <div className="jo-con3">
          <p className="con3-title">我是标题</p>
          <ul className="con3-ul">
            <li className="con3-li">
              <img className="con3-img" src={require('../../assets/images/joinImg/shijian.png')} />
              <p className="con3-con">我是时间</p>
            </li>
          </ul>
        </div>
        <div className="jo-con4">
          <p className="con4-title">我是标题</p>
          <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="This is panel header 1" key="1" showArrow={false}>
              {text}
            </Panel>
            <Panel header="This is panel header 2" key="2">
              {text}
            </Panel>
            <Panel header="This is panel header 3" key="3">
              {text}
            </Panel>
          </Collapse>
          <p className="con4-em">
            <span>
              Resume sent to:
              <a> yongling@conflux-chain.org</a>
            </span>
          </p>
        </div>
      </section>
    </div>
  );
}
export default JoinUs;
