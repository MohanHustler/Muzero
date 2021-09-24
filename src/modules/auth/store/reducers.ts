import { combineReducers, createReducer } from '@reduxjs/toolkit';
import { setAuthToken, setAuthUser, setAuthUserRole ,setAuthUserPermissions } from './actions';
import { User, permissions } from '../../common/contracts/user';

const INITIAL_AUTH_TOKEN = '';
const authToken = createReducer(INITIAL_AUTH_TOKEN, {
  [setAuthToken.type]: (_, action) => action.payload,
});

const INITIAL_AUTH_USER: User | {} = {};
const authUser = createReducer(INITIAL_AUTH_USER, {
  [setAuthUser.type]: (_, action) => action.payload,
});

const AUTH_USER_ROLE = '';
const authUserRole = createReducer(AUTH_USER_ROLE, {
  [setAuthUserRole.type]: (_, action) => action.payload,
});

const AUTH_USER_PERMISSIONS : permissions | {} = {accesspermissions:[],controlpermissions:[]} ;
const authUserPermissions = createReducer(AUTH_USER_PERMISSIONS , {
  [setAuthUserPermissions.type]: (_,action) => action.payload
})

export const authReducer = combineReducers({
  authToken,
  authUser,
  authUserRole,
  authUserPermissions
});
