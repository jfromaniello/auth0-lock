import Base from './index';
import AskSocialNetwork from './cred/social/ask_social_network';
import AskEmail from './passwordless/ask_email';
import AskEmailVcode from './passwordless/ask_email_vcode';
import AskSocialNetworkOrEmail from './cred/or/ask_social_network_or_email';
import AskSocialNetworkOrPhoneNumber from './cred/or/ask_social_network_or_phone_number';
import AskPhoneNumber from './passwordless/ask_phone_number';
import AskPhoneNumberVcode from './passwordless/ask_phone_number_vcode';
import MagiclinkScreen from './passwordless/magiclink';
import { renderSSOScreens } from './lock/sso/index';
import {
  initPasswordless,
  isEmail,
  isSendLink,
  passwordlessStarted
} from './passwordless/index';
import { setInitialPhoneLocation } from './cred/phone-number/actions';
import { initSocial } from './social/index';
import * as l from './lock/index';


export default class Auth0LockPasswordless extends Base {

  constructor(...args) {
    super("passwordless", dict, ...args);
  }

  didInitialize(model, options) {
    model = setInitialPhoneLocation(model, options);
    model = initSocial(model, options);
    model = initPasswordless(model, options);
    this.setModel(model);
  }

  didReceiveClientSettings(m) {
    const anySocialConnection = l.getEnabledConnections(m, "social").count() > 0;
    const anyPasswordlessConnection = l.getEnabledConnections(m, "passwordless").count() > 0;

    if (!anySocialConnection && !anyPasswordlessConnection) {
      // TODO: improve message
      throw new Error("At least one database or passwordless connection needs to be available.");
    }

    // TODO: check for the send option and emit warning if we have a sms
    // connection.
  }

  render(m) {
    const ssoScreen = renderSSOScreens(m);
    if (ssoScreen) return ssoScreen;

    const anyPasswordlessConnection =
      l.getEnabledConnections(m, "passwordless").count() > 0;
    const anySocialConnection =
      l.getEnabledConnections(m, "social").count() > 0;

    // social flow
    if (!anyPasswordlessConnection) {
      return new AskSocialNetwork();
    }

    // social or magiclink flow, or magiclink flow
    // a link can be send only in an email
    if (isSendLink(m)) {
      return anySocialConnection
        ? new AskSocialNetworkOrEmail()
        : new MagiclinkScreen();
    }

    // social or emailcode flow, or emailcode flow
    if (isEmail(m)) {
      return passwordlessStarted(m)
        ? new AskEmailVcode()
        : (anySocialConnection ? new AskSocialNetworkOrEmail() : new AskEmail());
    }

    // social or sms flow, or sms flow
    return passwordlessStarted(m)
      ? new AskPhoneNumberVcode()
      : (anySocialConnection ? new AskSocialNetworkOrPhoneNumber() : new AskPhoneNumber());

    // TODO: show a crashed screen.
    throw new Error("unknown screen");
  }

}

const dict = {
  email: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
    headerText: "Enter your email to sign in<br>or create an account"
  },
  emailCode: {
    codeInputPlaceholder: "Your code",
    footerText: "",
    headerText: "An email with the code has been sent to {email}.",
    resendLabel: "Did not get the code?"
  },
  emailSent: {
    failedLabel: "Failed!",
    retryLabel: "Retry",
    resendLabel: "Resend",
    resendingLabel: "Resending...",
    sentLabel: "Sent!",
    success: "We sent you a link to sign in<br />to {email}."
  },
  lastLogin: {
    headerText: "Last time you logged in with",
    skipLastLoginLabel: "Not your account?"
  },
  location: {
    locationFilterInputPlaceholder: "Select your country"
  },
  network: {
    footerText: "",
    headerText: "",
    smallSocialButtonsHeader: "Login with"
  },
  networkOrEmail: {
    emailInputPlaceholder: "yours@example.com",
    footerText: "",
    headerText: "",
    separatorText: "Otherwise, enter your email to sign in<br>or create an account",
    smallSocialButtonsHeader: "Login with"
  },
  networkOrPhone: {
    footerText: "",
    headerText: "",
    phoneNumberInputPlaceholder: "your phone number",
    separatorText: "Otherwise, enter your phone to sign in<br>or create an account",
    smallSocialButtonsHeader: "Login with"
  },
  phone: {
    footerText: "",
    headerText: "Enter your phone to sign in<br>or create an account",
    phoneNumberInputPlaceholder: "your phone number"
  },
  signedIn: {
    success: "Thanks for signing in."
  },
  smsCode: { // social or sms
    codeInputPlaceholder: "Your code",
    footerText: "",
    headerText: "An SMS with the code has been sent to {phoneNumber}.",
    resendLabel: "Did not get the code?"
  },
};