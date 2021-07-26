import React from 'react';
import * as Auth from "./auth/Auth";

class SigninPage extends React.Component {
  componentDidMount(){
    window.location.replace(Auth.getSigninUrl());
  }

  render() {
    return "";
  }
}

export default SigninPage;
