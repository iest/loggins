import React, { Component, PropTypes, findDOMNode } from 'react';
import { uniqueId } from 'lodash';

import css from './TableInput.css';

export default class TableInput extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    this.state = {
      focus: false,
      id: uniqueId('TableInput'),
    };
  }

  focus() {
    return findDOMNode(this.refs.focusable).focus();
  }
  blur() {
    return findDOMNode(this.refs.focusable).blur();
  }


  handleFocus() {
    const { onFocus } = this.props;
    this.setState({
      focus: true,
    }, () => onFocus && onFocus());
  }

  handleBlur() {
    const { onBlur } = this.props;
    this.setState({
      focus: false,
    }, () => onBlur && onBlur());
  }

  handleChange(e) {
    const { onChange, transform } = this.props;
    let { value } = e.target;
    if (transform) {
      value = transform(value);
    }
    onChange(value);
  }

  render() {
    const {
      placeholder,
      required,
      pattern,
      error,
      value,
      label,
      labelOutside,
      className,
      ...remainingProps,
    } = this.props;

    const { focus, id } = this.state;

    const hasValue = value && value.length > 0;
    const isOutsideVariant = labelOutside || !placeholder;
    const labelIsOutside = labelOutside || (hasValue && !placeholder);

    const outerCSS = [
      css.root,
      required
        ? css.required
        : null,
      error
        ? css.error
        : null,
      focus
        ? css.focus
        : null,
    ].join(' ');

    const messageCSS = [
      css.message,
      error ? css.messageError : null,
    ].join(' ');

    return (
      <div className={outerCSS}>
        <label htmlFor={id} className={css.label}>
          {label}{required ? '*' : null}
        </label>
        <input
          {...remainingProps}
          placeholder={placeholder}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          className={css.input}
          onChange={this.handleChange}
          value={value}
          id={id}
          ref="focusable"
        />
        <span className={messageCSS}>
          {this.props.error}
        </span>
      </div>
    );
  }
}

TableInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,

  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
  placeholder: PropTypes.string,

  transform: PropTypes.func,
  required: PropTypes.bool,

  // If set, will display underneath the input
  error: PropTypes.string,
};
