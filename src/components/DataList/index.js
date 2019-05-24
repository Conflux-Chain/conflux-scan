import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../assets/semantic-ui/semantic.css';

function DataList({
  showHeader = false,
  columns = [
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
  ],
  dataSource = [{ key: 1, ein: '80580', zwei: '0x123' }, { key: 2, ein: '80581', zwei: '0x124' }],
}) {
  return (
    <div>
      <table className="ui very basic table">
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
          {dataSource.map((item) => (
            <tr key={item.key}>
              {columns.map((unit) => (
                <th className={unit.className ? unit.className : ''} key={unit.key}>
                  {!unit.render ? item[unit.dataIndex] : unit.render(item[unit.dataIndex], item)}
                </th>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
DataList.propTypes = {
  showHeader: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.object),
  dataSource: PropTypes.arrayOf(PropTypes.object),
};
DataList.defaultProps = {
  showHeader: false,
  columns: [],
  dataSource: [],
};

export default DataList;
