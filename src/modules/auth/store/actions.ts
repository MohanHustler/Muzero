import { createAction } from '@reduxjs/toolkit';
import { Role } from '../../common/enums/role';
import { User } from '../../common/contracts/user';
import {permissions} from "../../common/contracts/user"
export const setAuthToken = createAction(
  'SET_AUTH_TOKEN',
  (accessToken: string) => {
    // We'll retain the access token in the local storage in case the
    // browser tab is refreshed then we'd still have the token to fetch the
    // user details of the authenticated user from it.
    localStorage.setItem('accessToken', accessToken);

    return {
      payload: accessToken,
    };
  }
);

export const setAuthUser = createAction('SET_AUTH_USER', (user: User | {}) => {
  // We'll retain the authenticated user in the local storage in case the
  // browser tab is refreshed then we'd still have the details to fetch
  // the user details of the authenticated user from it.
  localStorage.setItem('authUser', JSON.stringify(user));

  return {
    payload: user,
  };
});


export const setAuthUserPermissions = createAction('SET_AUTH_USER_PERMISSIONS', (permissions: permissions ) => {
  // We'll retain the authenticated user in the local storage in case the
  // browser tab is refreshed then we'd still have the details to fetch
  // the user details of the authenticated user from it.
  localStorage.setItem('authPermissions', JSON.stringify(permissions));
  return {
    payload: permissions,
  };
});

export const setAuthUserRole = createAction(
  'SET_AUTH_USER_ROLE',
  (role: Role | '') => {
    // We'll retain the authenticated user role in the local storage in case
    // the browser tab is refreshed then we'd still have the details to
    // fetch the user details of the authenticated user from it.
    localStorage.setItem('authUserRole', role);

    return {
      payload: role,
    };
  }
);
