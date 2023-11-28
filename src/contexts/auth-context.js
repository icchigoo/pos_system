import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { base_url } from "src/utils/baseUrl";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user = getUserFromLocalStorage(); // Assuming you have a function to get user details from local storage
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const getUserFromLocalStorage = () => {
    const userString = window.localStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const setUserInLocalStorage = (user) => {
    window.localStorage.setItem("user", JSON.stringify(user));
  };

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    });

    setUserInLocalStorage(user);
  };

  const signIn = async (email, password) => {
    try {
      const response = await axios.post(`${base_url}user/login`, {
        email: email,
        password: password,
      });

      const user = response.data.user;
      const token = response.data.token;

      try {
        window.sessionStorage.setItem("token", token);
        window.sessionStorage.setItem("authenticated", "true");
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });

      setUserInLocalStorage(user);

      const authenticatedResponse = await authenticatedAxios.get(`${base_url}some/protected/endpoint`);
      console.log("Authenticated request response:", authenticatedResponse);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signUp = async (firstname, lastname, email, mobile, password) => {
    try {
      const response = await axios.post(`${base_url}user/register`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        mobile: mobile,
        password: password,
      });

      if (response.data.message === "User created successfully") {
        try {
          window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
          console.error(err);
        }

        const user = {
          id: response.data.userId,
          // Other user data from the API response
        };

        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });

        setUserInLocalStorage(user);
      } else {
        console.error("Registration failed:", response.data.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const signOut = () => {
    try {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("authenticated");
      window.localStorage.removeItem("user");
    } catch (err) {
      console.error(err);
    }

    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
