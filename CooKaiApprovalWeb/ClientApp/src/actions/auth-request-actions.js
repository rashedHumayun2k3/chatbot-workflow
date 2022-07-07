/* eslint-disable no-undef */
import axios from 'axios';
import caxios from '../utils/axios';
import config from '../config';
import {
  LOADING_ACTION,
  FAILURE_ACTION,
  GET_ACCESS_TOKEN_SUCCESS,
  GET_ACCESS_TOKEN_BY_CODE_SUCCESS,
  GET_USER_FROM_GRAPH_SUCCESS,
  GET_GRAPH_FROM_GRAPH_SUCCESS,
  UPDATE_USER_PHOTO_FROM_GRAPH,
  GET_USER_ONE_BY_ONE_FROM_GRAPH,
  SET_LOGGED_IN_USER_DETAILS,
} from '../action-types/auth-request_types';

import { TOKEN } from '../constants/types';

export const loadingAction = (isLoading) => ({
  type: LOADING_ACTION,
  payload: {
    isLoading,
  },
});

export const failureAction = (error) => ({
  type: FAILURE_ACTION,
  payload: error,
});

export const setGetAccessTokenSuccess = (response) => ({
  type: GET_ACCESS_TOKEN_SUCCESS,
  payload: { auth: response },
});

export const setDeleteRequesetGetAccessTokenByCodeSuccess = (response) => ({
  type: GET_ACCESS_TOKEN_BY_CODE_SUCCESS,
  payload: { auth: response },
});

export const setUserFromGraphSuccess = (response) => ({
  type: GET_USER_FROM_GRAPH_SUCCESS,
  payload: { userInformation: response },
});

export const updateUserPhotoFromGraphSuccess = (response) => ({
  type: UPDATE_USER_PHOTO_FROM_GRAPH,
  payload: { userInfo: response },
});

// export const setUserOneByOneFromGraph = (response) => ({
//   type: GET_USER_ONE_BY_ONE_FROM_GRAPH,
//   payload: { userInfo: response },
// });

export const setGroupFromGraphSuccess = (response) => ({
  type: GET_GRAPH_FROM_GRAPH_SUCCESS,
  payload: { groupInformation: response },
});
function setAccessTokenToLocalStorage(token) {
  if (token != '') {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 50); // token will expire after 50 minutes
    const expDate = new Date(now);
    const tokenObj = { token, expireAt: expDate };
    localStorage.setItem(TOKEN, JSON.stringify(tokenObj));
  }
}
export const getAccessToken = async (dispatch, currentUserUPN) => {
  dispatch(loadingAction(true));
  // check if stored token is valid then return it
  const tokenObj = JSON.parse(localStorage.getItem(TOKEN));
  if (tokenObj) {
    const now = new Date();
    const expireDate = new Date(tokenObj.expireAt);
    if (expireDate > now) {
      const output = { accessTokenResult: tokenObj.token };
      dispatch(setGetAccessTokenSuccess(output));
      return tokenObj.token;
    }
  }
  // otherwise get a new token from server
  await caxios
    .get(`/UserToken?upn=${currentUserUPN}`)
    .then((res) => {
      setAccessTokenToLocalStorage(res.data);
      const output = { accessTokenResult: res.data };
      dispatch(setGetAccessTokenSuccess(output));
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};
export const refreshAccessToken = async (currentUserUPN) => axios
  .get(`${config.api.base}/UserToken?upn=${currentUserUPN}`)
  .then((res) => {
    setAccessTokenToLocalStorage(res.data);
    return res.data;
  });

export const getAccessTokenByCode = async (dispatch, authCodeRequest) => {
  dispatch(loadingAction(true));
  await caxios
    .post('/GetTokenByCode', authCodeRequest)
    .then((res) => {
      setAccessTokenToLocalStorage(res.data);
      const output = { accessTokenResult: res.data };
      dispatch(setDeleteRequesetGetAccessTokenByCodeSuccess(output));
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};
export const getUserFromGraphBySearch = async (dispatch, searchText) => {
  dispatch(loadingAction(true));
  await caxios
    .get(
      `${config.api.graphBaseUrl}/users?$select=department,displayName,userPrincipalName,Id&$filter=startsWith(displayName,'{searchText}')`,
    )
    .then((res) => {
      const processedData = [];
      dispatch(setUserFromGraphSuccess(res.data));
      res.data.value.forEach((item) => {
        const {
          id, displayName, userPrincipalName, department,
        } = item;
        const user = {
          spid: id,
          key: null,
          text:
            department == null ? displayName : `${displayName} (${department})`,
          secondarytext: userPrincipalName,
          name: displayName,
        };
        const url = `${config.api.graphBaseUrl}/users/${id}/photos('96x96')/$value`;
        caxios
          .get(url, {
            responseType: 'blob',
          })
          .then((response) => {
            const objectURL = URL.createObjectURL(response.data);
            user.imageUrl = objectURL;
            dispatch(updateUserPhotoFromGraphSuccess(user));
          })
          .catch((error) => console.log(error));
        processedData.push(user);
      });
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};
export const getUserFromGraph = (dispatch) => {
  dispatch(loadingAction(true));
  getUsersFromGraphAPI(
    `${config.api.graphBaseUrl}/users?$select=department,displayName,userPrincipalName,Id`,
  ).then((data) => {
    dispatch(setUserFromGraphSuccess(data));
    data.forEach((user) => {
      const url = `${config.api.graphBaseUrl}/users/${user.spid}/photos('96x96')/$value`;
      caxios
        .get(url, {
          responseType: 'blob',
        })
        .then((response) => {
          const objectURL = URL.createObjectURL(response.data);
          user.imageUrl = objectURL;
          dispatch(updateUserPhotoFromGraphSuccess(user));
        })
        .catch((error) => console.log(error));
    });
  });
};

function getUsersFromGraphAPI(url, datalist = []) {
  return caxios.get(url).then((res) => {
    if (res.data.value && res.data.value.length > 0) {
      const processedData = [];
      res.data.value.forEach((item) => {
        const {
          id, displayName, userPrincipalName, department,
        } = item;
        const user = {
          spid: id,
          key: null,
          text:
            department == null ? displayName : `${displayName} (${department})`,
          secondarytext: userPrincipalName,
          name: displayName,
        };
        // const url = config.api.graphBaseUrl + `/users/${id}/photos('96x96')/$value`;
        // caxios.get(url, {
        //   responseType: 'blob'
        // }).then(response => {
        //   var objectURL = URL.createObjectURL(response.data);
        //   user.imageUrl = objectURL;
        // }).catch(error => console.log(error));
        processedData.push(user);
      });
      datalist.push(...processedData);

      if (res.data['@odata.nextLink'] && res.data['@odata.nextLink'] != '') {
        return getUsersFromGraphAPI(res.data['@odata.nextLink'], datalist);
      }
    }
    return datalist;
  });
}

export const getGroupFromGraph = async (dispatch) => {
  dispatch(loadingAction(true));
  await caxios
    .get(`${config.api.graphBaseUrl}/groups`)
    .then((res) => {
      dispatch(setGroupFromGraphSuccess(res.data));
    })
    .catch((err) => {
      dispatch(failureAction(err.response));
    });
};

//
// Get approver and reader informations
//

export const setLoggedInUserDetails = (response) => ({
  type: SET_LOGGED_IN_USER_DETAILS,
  payload: { loggedInUser: response },
});

export const setApproverAndViewerData = async (dispatch, value) => {
  dispatch(setApproverAndVeiwerList(value));
};

export const getPictureFromGraphFromUserList = (dispatch, userList) => {
  dispatch(loadingAction(true));
  const promises = [];
  userList.forEach((user) => {
    const url = `https://graph.microsoft.com/v1.0/users/${user.AadObjectId}/photos('96x96')/$value`;
    promises.push(
      caxios
        .get(url, {
          responseType: 'blob',
        })
        .then((response) => {
          const objectURL = URL.createObjectURL(response.data);
          user.imageUrl = objectURL;
        })
        .catch((error) => console.log(error)),
    );
  });
  return Promise.all(promises).then(() => {
    dispatch(setUserFromGraphSuccess(userList));
  });
};

export const getLoggedInUserFromGraphWithId = (dispatch, userId) => {
  dispatch(loadingAction(true));
  const url = `${config.api.graphBaseUrl}/users/${userId}`;
  caxios.get(url).then((response) => {
    const {
      id, displayName, userPrincipalName, department,
    } = response.data;
    const user = {
      AadObjectId: id,
      key: id,
      text: displayName,
      secondaryText: department, // this will be used to show the department
      currentLoggedInUserPrincipal: userPrincipalName, // this is used everywhere in the application, //TODO if can manage time we will refactor this to use one single field
      Name: displayName,
      isGroup: false,
    };
    dispatch(setLoggedInUserDetails(user));
  });
};

export const getImageFromGraphWithId = async (dispatch, user) => {
  const userDetails = user;
  dispatch(loadingAction(true));
  const url = `${config.api.graphBaseUrl}/users/${userDetails.AadObjectId}/photos('96x96')/$value`;
  caxios
    .get(url, {
      responseType: 'blob',
    })
    .then((response) => {
      const objectURL = URL.createObjectURL(response.data);
      userDetails.imageUrl = objectURL;
      dispatch(setLoggedInUserDetails(userDetails));
    });
};

export const getUsersFromGraphAPIReturnsPromise = (filterText) => caxios
  .get(
    `${config.api.graphBaseUrl}/users?$select=department,displayName,userPrincipalName,Id&$filter=startsWith(displayName,'${filterText}')`,
  )
  .then((res) => {
    const processedData = [];
    res.data.value.forEach((item) => {
      const {
        id, displayName, userPrincipalName, department,
      } = item;
      const user = {
        spid: id,
        key: id,
        text: displayName,
        secondaryText: department, // this will be used to show the department
        secondarytext: userPrincipalName, // this is used everywhere in the application, //TODO if can manage time we will refactor this to use one single field
        name: displayName,
        isGroup: false,
      };
      processedData.push(user);
    });
    const promises = [];
    processedData.forEach((user) => {
      const url = `${config.api.graphBaseUrl}/users/${user.spid}/photos('96x96')/$value`;
      promises.push(
        caxios
          .get(url, {
            responseType: 'blob',
          })
          .then((response) => {
            const objectURL = URL.createObjectURL(response.data);
            user.imageUrl = objectURL;
          })
          .catch((error) => console.log(error)),
      );
    });
    promises.push(
      caxios
        .get(
          `${config.api.graphBaseUrl}/groups?$select=displayName,mail,Id&$filter=startsWith(displayName,'${filterText}')`,
        )
        .then((groupResult) => {
          groupResult.data.value.forEach((item) => {
            const { id, displayName, mail } = item;
            const group = {
              spid: id,
              key: id,
              text: displayName,
              secondarytext: mail,
              name: displayName,
              isGroup: true,
            };
            processedData.push(group);
          });
        }),
    );
    return Promise.all(promises).then(() => processedData);
  });
