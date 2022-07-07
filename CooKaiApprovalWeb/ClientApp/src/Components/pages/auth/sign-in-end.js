import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import * as microsoftTeams from '@microsoft/teams-js';
import { useDispatch, useSelector } from 'react-redux';
import { getAccessTokenByCode } from '../../../actions/auth-request-actions';

export default function SignInEnd() {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  useEffect(() => {
    microsoftTeams.initialize();
    microsoftTeams.getContext((context) => {
      const currentUser = context.loginHint;
      const { code } = queryString.parse(location.search);
      if (code) {
        if (window.opener) {
          const payLoad = {
            Code: code,
            UserPrincipalName: currentUser,
          };
          getAccessTokenByCode(dispatch, payLoad);
        } else {
          //microsoftTeams.authentication.notifyFailure('UnexpectedFailure');
        }
      } else {
        //microsoftTeams.authentication.notifyFailure('UnexpectedFailure');
      }
    });
  }, []);
  useEffect(() => {
    if (auth.accessTokenResult != null) {
      if (auth.accessTokenResult !== '') {
        microsoftTeams.authentication.notifySuccess();
      } else {
        microsoftTeams.authentication.notifyFailure('UnexpectedFailure');
      }
    }
  }, [auth]);

  return <h1>Ending sign in...</h1>;
}
