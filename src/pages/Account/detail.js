import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Pagination, Dropdown } from 'semantic-ui-react';
import DatePicker from 'antd/lib/date-picker';
import 'antd/lib/date-picker/style/css';
import DataList from '../../components/DataList';
import Countdown from '../../components/Countdown';
import EllipsisLine from '../../components/EllipsisLine';
import '../../assets/semantic-ui/semantic.css';
import CopyButton from '../../components/CopyButton';
import QrcodeButton from '../../components/QrcodeButton';

const { RangePicker } = DatePicker;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeadBar = styled.div`
  width: 100%;
  font-size: 16px;
  margin-bottom: 24px;
  * {
    display: inline-block;
    margin: 0;
  }
  h1 {
    color: #000;
    font-size: 20px;
    margin-right: 24px;
  }
`;

const IconFace = styled.div`
  margin-left: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
  &:hover {
    cursor: pointer;
    background: rgba(0, 0, 0, 0.54);
    svg {
      color: #fff;
    }
  }
`;

const Statistic = styled.div`
  background: #fff;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 34px;
  .transaction {
    width: 28%;
  }
  .miner,
  .balance {
    width: 20%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }
  .seen {
    width: 36%;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }
  .wrap {
    height: 68px;
    width: 100%;
    display: flex;
    align-items: center;
    * {
      font-size: 16px;
    }
    svg {
      width: 32px;
      height: 32px;
      opacity: 0.38;
      margin: 0 16px;
    }
  }
  .sectionWrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    section {
      width: 180px;
    }
  }
`;

const TabZone = styled.div`
  position: relative;
  width: 100%;
`;

const PCell = styled.div`
  margin: 0 !important;
`;

const TabWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CtrlPanel = styled.div`
  position: absolute;
  right: 0;
  width: 43%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const columns = [
  {
    key: 1,
    dataIndex: 'ein',
    title: 'Blocks',
    // className: 'two wide',
    render: (text, row) => (
      <IconFace>
        <svg className="icon" aria-hidden="true">
          <use xlinkHref="#iconjinrijiaoyiliang" />
        </svg>
      </IconFace>
    ),
  },
  {
    key: 2,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>
          <EllipsisLine isPivot text={row.zwei} />
        </PCell>
      </div>
    ),
  },
  {
    key: 3,
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text, row) => (
      <div>
        <PCell>{row.drei}</PCell>
      </div>
    ),
  },
  {
    key: 4,
    className: 'two wide aligned',
    dataIndex: 'drei',
    title: 'Blocks',
    render: (text) => <div className="ui label">{text}</div>,
  },
];
const dataSource = [
  { key: 1, ein: '80580', zwei: '0xe969a6fc05897123123', drei: 'Alichs' },
  { key: 2, ein: '80581', zwei: '0xe969a6fc05897124124', drei: 'Schwarz' },
];

function Detail({ match }) {
  const { accountid } = match.params;
  return (
    <div className="page-address-detail">
      <Wrapper>
        <HeadBar>
          <h1>Conflux Account</h1>
          <p>{accountid || '0x413957876f8239dd9246fefabc4e7d6d86d4f9b6'}</p>
          {/* <IconFace onClick={() => { }}>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconfuzhi" />
            </svg>
          </IconFace> */}
          <CopyButton txtToCopy={accountid} toolTipId="app.pages.account.detail.tooltip" />
          <QrcodeButton titleTxt={accountid} qrTxt={accountid} tooltipId="app.pages.account.detail.qr" />
          {/* <IconFace>
            <svg className="icon" aria-hidden="true">
              <use xlinkHref="#iconcaidan" />
            </svg>
          </IconFace> */}
        </HeadBar>
        <Statistic>
          <div className="transaction">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconshiliangzhinengduixiang" />
              </svg>
              <div>
                <h2>Transactions</h2>
                <p>Sent 5385176 & Received 1</p>
              </div>
            </div>
          </div>
          <div className="miner">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconwakuang" />
              </svg>
              <div>
                <h2>Miner Blocks</h2>
                <p>0 block</p>
              </div>
            </div>
          </div>
          <div className="balance">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconEquilibrium-type" />
              </svg>
              <div>
                <h2>Belance</h2>
                <p>1 CFX</p>
              </div>
            </div>
          </div>
          <div className="seen">
            <div className="wrap">
              <svg className="icon" aria-hidden="true">
                <use xlinkHref="#iconliulan" />
              </svg>
              <div className="sectionWrap">
                <section>
                  <h2>First Seen</h2>
                  <p>2019-05-17 10:15:12</p>
                </section>
                <section>
                  <h2>Last Seen</h2>
                  <p>2019-05-17 10:15:12</p>
                </section>
              </div>
            </div>
          </div>
        </Statistic>
        <TabZone>
          <div className="ui attached tabular menu">
            <a className="active item">Transactions</a>
            <a className="item">Miner Block</a>
            <CtrlPanel>
              <span>Screening Time</span>
              <RangePicker
                showTime={{ format: 'HH:00' }}
                format="YYYY-MM-DD HH:00"
                placeholder={['Start Time', 'End Time']}
                onChange={() => {}}
                onOk={() => {}}
              />
              <Dropdown
                direction="left"
                icon={
                  <IconFace style={{ borderRadius: '4px' }}>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#iconmore1" />
                    </svg>
                  </IconFace>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item text="View All" />
                  <Dropdown.Item text="View Outgoing Txns" />
                  <Dropdown.Item text="View Incoming Txns" />
                </Dropdown.Menu>
              </Dropdown>
            </CtrlPanel>
          </div>
          <div className="ui bottom attached segment active tab">
            <div className="ui fluid card">
              <div className="content">
                <DataList showHeader columns={columns} dataSource={dataSource} />
              </div>
            </div>
            <TabWrapper>
              <Pagination
                prevItem={{
                  'aria-label': 'Previous item',
                  content: 'Previous',
                }}
                nextItem={{
                  'aria-label': 'Next item',
                  content: 'Next',
                }}
                defaultActivePage={5}
                totalPages={10}
              />
            </TabWrapper>
          </div>
          <div className="ui bottom attached segment tab">Tab 2 Content</div>
          <div className="ui bottom attached segment tab">Tab 3 Content</div>
        </TabZone>
      </Wrapper>
    </div>
  );
}
Detail.propTypes = {
  match: PropTypes.objectOf(PropTypes.string),
};
Detail.defaultProps = {
  match: {},
};
export default Detail;
