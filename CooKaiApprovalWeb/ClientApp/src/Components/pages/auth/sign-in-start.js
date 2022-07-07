import React from 'react';
import AuthHelper from '../../../helpers/AuthHelper';

export default function SignInStart() {    
    AuthHelper.startSignIn();
    return <h1>Starting sign in...</h1>;
}