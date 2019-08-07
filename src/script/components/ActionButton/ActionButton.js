import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './ActionButton.pcss';

export default class ActionButton extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    mode: PropTypes.shape({
      disabled: PropTypes.bool,
      hidden: PropTypes.bool
    }),
    onClick: PropTypes.func.isRequired,
  };

  static defaultProps = {
    disabled: false,
    hidden: false
  };

  render() {
    const { title, mode: {disabled, hidden}, onClick }  = this.props;
    return (
      <button
        disabled={disabled}
        styleName={classnames('button', {'hidden': hidden})}
        onClick={onClick}
      >
        {title}
      </button>
    );
  }
}