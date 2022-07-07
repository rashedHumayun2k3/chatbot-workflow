/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react';
import { Route, Redirect, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty, isEqual } from 'lodash';
import * as microsoftTeams from '@microsoft/teams-js';
import { CURRENTUSER } from '../constants/types';
import LoadingSkeleton from './LoadingSkeleton';
import {
  getAccessToken,
  getLoggedInUserFromGraphWithId,
  getImageFromGraphWithId,
} from '../actions/auth-request-actions';

const SecureRoute = ({ component: Component, security, ...otherProps }) => {
  const redirectUrl = otherProps.path + otherProps.location.search;
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.auth);
  const { stateLoggedInUser } = useSelector((state) => state.auth);
  useEffect(() => {
    microsoftTeams.initialize();
    microsoftTeams.getContext((ctx) => {
      const localStorageCurrentUserInfo = JSON.parse(
        localStorage.getItem(CURRENTUSER),
      );
      if (
        !isEmpty(localStorageCurrentUserInfo)
        && !isEqual(
          ctx.loginHint,
          localStorageCurrentUserInfo.currentLoggedInUserPrincipal,
        )
      ) {
        localStorage.clear();
        history.push('/login');
      } else {
        const currentUser = {
          currentLoggedInUserPrincipal: ctx.loginHint,
          tenantId: ctx.tid,
          userObjectId: ctx.userObjectId,
        };
        // eslint-disable-next-line no-undef
        localStorage.setItem(CURRENTUSER, JSON.stringify(currentUser));
        const currentUserEmail = ctx.loginHint;
        getAccessToken(dispatch, currentUserEmail);
      }
    });
  }, []);

  useEffect(() => {
    if (auth.accessTokenResult != null) {
      if (auth.accessTokenResult !== '') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (isLoggedIn) {
      const currentUser = localStorage.getItem('currentUser');
      getLoggedInUserFromGraphWithId(
        dispatch,
        JSON.parse(currentUser).userObjectId,
      );
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (stateLoggedInUser) {
      getImageFromGraphWithId(dispatch, stateLoggedInUser);
    }
  }, [stateLoggedInUser]);

  return (
    <Route
      {...otherProps}
      render={(props) => (isLoggedIn === null ? (
          <LoadingSkeleton />
      ) : isLoggedIn ? (
          <Component {...props} />
      ) : (
          <Redirect to={`/login?redirectUrl=${redirectUrl}`} />
      ))
      }
    />
  );
};

export default SecureRoute;
