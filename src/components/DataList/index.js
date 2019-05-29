import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../assets/semantic-ui/semantic.css';

function DataList({ rowStyle, showHeader, columns, dataSource }) {
  return (
    <div>
      <table className="ui very basic padded table">
        {!showHeader ? null : (
          <thead>
            <tr>
              {columns.map((item) => (
                <th colSpan={item.colSpan ? item.colSpan : 1} key={item.key}>
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {dataSource.map((item, index) => {
            return !index ? (
              <tr style={rowStyle} key={item.hash || index}>
                {columns.map((unit) => (
                  <th className={unit.className ? unit.className : ''} key={unit.key}>
                    {!unit.render ? item[unit.dataIndex] : unit.render(item[unit.dataIndex], item)}
                  </th>
                ))}
              </tr>
            ) : (
              <tr style={rowStyle} key={item.hash || index}>
                {columns.map((unit) => (
                  <th style={{ borderTop: '1px solid rgba(34,36,38,.1)' }} className={unit.className ? unit.className : ''} key={unit.key}>
                    {!unit.render ? item[unit.dataIndex] : unit.render(item[unit.dataIndex], item)}
                  </th>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
DataList.propTypes = {
  rowStyle: PropTypes.objectOf(PropTypes.string),
  showHeader: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object),
  dataSource: PropTypes.arrayOf(PropTypes.object),
};
DataList.defaultProps = {
  rowStyle: {},
  showHeader: false,
  columns: [
    {
      key: 1,
      dataIndex: 'ein',
      title: 'Blocks',
      render: (text, row) => (
        <div>
          <img href="https://place-hold.it/40x40" width="40" height="40" />
        </div>
      ),
    },
    {
      key: 2,
      dataIndex: 'zwei',
      title: 'Blocks',
    },
    {
      key: 3,
      dataIndex: 'drei',
      title: 'Blocks',
      render: (text, row) => (
        <div>
          <p>{row.zwei}</p>
          <p>{row.drei}</p>
        </div>
      ),
    },
  ],
  dataSource: [{ key: 1, ein: '80580', zwei: '0x123', drei: 'Alichs' }, { key: 2, ein: '80581', zwei: '0x124', drei: 'Schwarz' }],
};

export default DataList;
