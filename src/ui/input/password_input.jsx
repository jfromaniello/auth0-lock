import PropTypes from 'prop-types';
import React from 'react';
import InputWrap from './input_wrap';
import PasswordStrength from './password/password_strength';
import * as l from '../../core/index';

export const icon =
  '<svg aria-hidden="true" focusable="false" width="11px" height="14px" viewBox="0 0 13 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="auth0-lock-icon auth0-lock-icon-box"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-288.000000, -1508.000000)" fill="#888888"><path d="M299,1523.998 L290,1523.998 C288.896,1523.998 288,1523.102 288,1521.999 L288,1515.999 C288,1514.895 288.896,1513.998 290,1513.998 L290,1513.998 L290,1512.499 C290,1510.015 292.015,1507.999 294.5,1507.999 C296.985,1507.999 299,1510.015 299,1512.499 L299,1513.999 C300.104,1513.999 301,1514.895 301,1515.999 L301,1521.999 C301,1523.103 300.104,1523.998 299,1523.998 L299,1523.998 Z M298,1512.499 C298,1510.566 296.433,1508.999 294.5,1508.999 C292.567,1508.999 291,1510.566 291,1512.499 L291,1513.998 L298,1513.998 L298,1512.499 L298,1512.499 Z M300,1515.999 C300,1515.446 299.552,1514.998 299,1514.998 L290,1514.998 C289.447,1514.998 289,1515.446 289,1515.999 L289,1521.999 C289,1522.551 289.447,1522.998 290,1522.998 L299,1522.998 C299.552,1522.998 300,1522.551 300,1521.999 L300,1515.999 L300,1515.999 Z M294.5,1520.998 C294.224,1520.998 294,1520.774 294,1520.498 L294,1517.498 C294,1517.223 294.224,1516.999 294.5,1516.999 C294.776,1516.999 295,1517.223 295,1517.498 L295,1520.498 C295,1520.774 294.776,1520.998 294.5,1520.998 L294.5,1520.998 Z"></path></g></g></svg>';
const inputIconSVG =
  '<svg aria-hidden="true" focusable="false" width="11px" height="14px" viewBox="0 0 13 16" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="icon/key"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M16.3884 11.0145C14.4508 12.9522 11.3948 13.0447 9.32094 11.3401L7.20872 13.2642L9.60904 15.6697L8.83354 16.4466L6.39631 14.0048L4.88251 15.3832L7.39496 17.89L6.61586 18.6666L3.5 15.5587L3.53914 15.5198C3.47446 15.3363 3.51554 15.1287 3.67514 14.983L8.54211 10.5496C6.89425 8.47691 7.005 5.46384 8.92209 3.54636C10.9841 1.48455 14.3267 1.48455 16.3884 3.54636C18.4501 5.60846 18.4501 8.95239 16.3884 11.0145ZM15.6048 4.33856C13.98 2.71309 11.3454 2.71309 9.72062 4.33856C8.0958 5.9632 8.0958 8.59793 9.72062 10.2226C11.3454 11.8478 13.98 11.8478 15.6048 10.2226C17.2297 8.59793 17.2297 5.96292 15.6048 4.33856Z" fill="#888888"/></g></svg>';

export default class PasswordInput extends React.Component {
  static propTypes = {
    invalidHint: PropTypes.string.isRequired,
    showPasswordStrengthMessage: PropTypes.bool.isRequired,
    isValid: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    policy: PropTypes.object,
    strengthMessages: PropTypes.object,
    value: PropTypes.string.isRequired,
    showPassword: PropTypes.bool.isRequired,
    lock: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  focus() {
    this.refs.input && this.refs.input.focus();
  }

  hasFocus() {
    return this.state.focused;
  }

  render() {
    const {
      invalidHint,
      showPasswordStrengthMessage,
      isValid,
      onChange,
      policy,
      strengthMessages,
      value,
      showPassword,
      lock,
      ...props
    } = this.props;

    const { focused, changing } = this.state;

    const allowPasswordAutocomplete = l.ui.allowPasswordAutocomplete(lock);

    const passwordStrength =
      policy && focused && changing && showPasswordStrengthMessage ? (
        <PasswordStrength messages={strengthMessages} password={value} policy={policy} />
      ) : null;

    return (
      <InputWrap
        after={passwordStrength}
        focused={focused}
        invalidHint={invalidHint}
        isValid={isValid}
        name="password"
        icon={icon}
      >
        <input
          ref="input"
          type={showPassword ? 'text' : 'password'}
          name="password"
          className="auth0-lock-input"
          style={{ borderTopRightRadius: '0px', borderTopLeftRadius: '0px' }}
          autoComplete={allowPasswordAutocomplete ? 'on' : 'off'}
          autoCapitalize="off"
          onChange={::this.handleOnChange}
          onFocus={::this.handleFocus}
          onBlur={::this.handleBlur}
          value={value}
          aria-label="Password"
          aria-invalid={!isValid}
          aria-describedby={
            !isValid && !policy && invalidHint ? `auth0-lock-error-msg-password` : undefined
          }
          {...props}
        />
      </InputWrap>
    );
  }

  handleOnChange(e) {
    var state = this.state;
    state.changing = true;
    this.setState(state);
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  handleFocus() {
    this.setState({ focused: true });
  }

  handleBlur() {
    this.setState({ focused: false });
  }
}
