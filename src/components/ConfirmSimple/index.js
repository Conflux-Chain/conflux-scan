import React from 'react';
import { injectIntl } from 'react-intl';
import { Confirm } from 'semantic-ui-react';

/* eslint react/prop-types: 0 */
function ConfirmSimple({ intl, open, onConfirm }) {
  const fmt = (id) => {
    return intl.formatMessage({
      id,
    });
  };

  return (
    <Confirm
      content={fmt('app.pages.block.confirm.pageWarning')}
      open={open}
      cancelButton={null}
      onCancel={() => {}}
      onConfirm={onConfirm}
    />
  );
}

export default injectIntl(ConfirmSimple);
