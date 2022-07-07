import React, { useState, useEffect } from 'react';
import * as microsoftTeams from '@microsoft/teams-js';
import * as constants from '../../../constants';
import Laguage from '../../utility/Language';

export default function Login({ ...otherProps }) {
  const [selectedLang] = useState(Laguage.jap);
  async function login() {
    return new Promise((resolve, reject) => {
      microsoftTeams.authentication.authenticate({
        url: `${window.location.origin}/${constants.Auth.signInStartPage}`,
        width: 600,
        height: 535,
        successCallback: () => {
          resolve();
          if (otherProps.location.search != '') {
            if (otherProps.location.search.split('/').length > 1) {
              window.location.replace(`${window.location.origin}/${otherProps.location.search.split('/')[1]}`);
            }
          } else {
            window.location.replace(window.location.origin);
          }
        },
        failureCallback: (reason) => {
          reject(reason);
        },
      });
    });
  }
  return <div className='loginDiv'><p>{selectedLang.Please} <a onClick={() => login()}>{selectedLang.Login}</a> {selectedLang.ToContinue}</p></div>;
}
