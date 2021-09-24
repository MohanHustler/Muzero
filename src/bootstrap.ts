import axios, { AxiosError } from 'axios';
import { useDispatch } from 'react-redux';
import {
  setAuthToken,
  setAuthUser,
  setAuthUserPermissions,
  setAuthUserRole
} from './modules/auth/store/actions';
import { getTutor } from './modules/common/api/tutor';
import { Role } from './modules/common/enums/role';
import { permissions, User } from './modules/common/contracts/user';
import { exceptionTracker } from './modules/common/helpers';

export class Bootstrap {
  static init() {
    Bootstrap.configureAxios();
    Bootstrap.setupAuthToken();
  }

  private static configureAxios() {
    // Automatically append the authorization token for all the requests
    // if the user is authenticated.
    axios.interceptors.request.use(function (config) {
      const authToken = localStorage.getItem('accessToken');

      const serverURL = new URL(process.env.REACT_APP_API as string);
      const requestURL = new URL(config.url as string);

      if (serverURL.host === requestURL.host) {
        config.headers.Authorization =
          authToken && authToken.length > 0 ? `Bearer ${authToken}` : null;
      }
      return config;
    });

    // Dispatch must be defined here to work because it can not be
    // initialized conditionally.
    const dispatch = useDispatch();

    axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const serverURL = new URL(process.env.REACT_APP_API as string);
        const requestURL = new URL(error.config.url as string);

        // Expire the session for the user if the server responds with the
        // 401 status code, i.e. Unauthenticated user.
        if (
          serverURL.host === requestURL.host &&
          error.response?.status === 401
        ) {
          dispatch(setAuthToken(''));
          dispatch(setAuthUser({}));
          dispatch(setAuthUserRole(''));
        }

        throw error;
      }
    );
  }

  private static async setupAuthToken() {
    const accessToken = localStorage.getItem('accessToken');
    const authUser = localStorage.getItem('authUser');
    const authUserRole = localStorage.getItem('authUserRole');
    const authPermissions = localStorage.getItem('authPermissions');

    const dispatch = useDispatch();

    dispatch(setAuthToken(''));
    dispatch(setAuthUser({}));
    dispatch(setAuthUserRole(''));
    dispatch(
      setAuthUserPermissions({ accesspermissions: [], controlpermissions: [] })
    );
    if (!accessToken || !authUser || !authUserRole || !authPermissions) {
      return;
    }

    const user: User = JSON.parse(authUser);
    const permissions: permissions = JSON.parse(authPermissions);

    dispatch(setAuthToken(accessToken));
    dispatch(setAuthUser(user));
    dispatch(setAuthUserRole(authUserRole as Role));
    dispatch(setAuthUserPermissions(permissions));
    if (authUserRole === Role.TUTOR || authUserRole === Role.ORG_TUTOR) {
      try {
        const tutor = await getTutor();

        dispatch(setAuthUser(tutor));
      } catch (error) {
        exceptionTracker(error.response?.data.message);
        // Expire the session for the user if the server responds with the
        // 401 status code, i.e. Unauthenticated user.
        if (error.response?.status === 401) {
          dispatch(setAuthToken(''));
          dispatch(setAuthUser({}));
          dispatch(setAuthUserRole(''));
          dispatch(
            setAuthUserPermissions({
              controlpermissions: [],
              accesspermissions: []
            })
          );
        }

        throw error;
      }
    }
  }
}
