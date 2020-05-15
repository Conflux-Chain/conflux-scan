import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { i18n, isContract } from '../../utils';
import EllipsisLine from '../EllipsisLine';
import { defaultContractIcon, defaultTokenIcon } from '../../constants';

const ContractName = styled.div`
  display: inline-block;
  img {
    width: 20px;
    height: 20px;
    margin-right: 2px;
  }
  > div {
    display: inline-block;
  }
`;
const ContractCell = styled.div`
  color: rgba(0, 0, 0, 0.87);
  /* font-size: 15px; */
  font-weight: bold;
  display: inline-block;
`;
const ContractCellNormal = styled.div`
  color: rgba(0, 0, 0, 0.87);
  font-weight: normal;
`;

class AddressEllipseLine extends PureComponent {
  render() {
    const { contractManagerCache, contractCreated, address, type, textInout, noLink } = this.props;
    if (type === 'to' && !address) {
      // no to address
      return <ContractName>{i18n('Contract Creation')}</ContractName>;
    }

    let linkTo = `/address/${address}`;
    if (noLink) {
      linkTo = '';
    }

    let line2;
    if (contractCreated) {
      line2 = (
        <ContractName>
          <Popup
            trigger={
              <ContractCell>
                <Link to={`/address/${contractCreated}`}>{i18n('Contract Creation')}</Link>
              </ContractCell>
            }
            content={contractCreated}
            position="top center"
            hoverable
          />
        </ContractName>
      );
    } else if (address && isContract(address)) {
      if (contractManagerCache[address] && contractManagerCache[address].name) {
        let trigger;
        if (noLink) {
          trigger = <ContractCellNormal>{contractManagerCache[address].name}</ContractCellNormal>;
        } else {
          trigger = <Link to={`/address/${address}`}>{contractManagerCache[address].name}</Link>;
        }

        line2 = (
          <ContractName>
            {/* <Popup trigger={<img src={defaultTokenIcon} />} content={i18n('Contract')} position="top center" hoverable /> */}
            <Popup trigger={trigger} content={address} position="top center" hoverable />
          </ContractName>
        );
      } else {
        line2 = <EllipsisLine textInout={textInout} linkTo={linkTo} text={address} />;
      }
    } else {
      line2 = <EllipsisLine textInout={textInout} linkTo={linkTo} text={address} />;
    }

    return line2;
  }
}

function mapStateToProps(state) {
  return {
    contractManagerCache: state.common.contractManagerCache,
  };
}

AddressEllipseLine.propTypes = {
  contractManagerCache: PropTypes.objectOf(
    PropTypes.shape({
      name: PropTypes.string,
    })
  ).isRequired,
  address: PropTypes.string.isRequired,
  type: PropTypes.string,
  contractCreated: PropTypes.string.isRequired,
  textInout: PropTypes.string,
  noLink: PropTypes.bool,
};

AddressEllipseLine.defaultProps = {
  type: '',
  textInout: '',
  noLink: false,
};

export default connect(mapStateToProps)(AddressEllipseLine);
