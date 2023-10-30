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
    try {
      window.sessionStorage.removeItem("authenticated");
      window.sessionStorage.removeItem("token");
    } catch (err) {
      console.error(err);
    }

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
      const user = {
        id: "5e86809283e28b96d2d38537",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "Anika Visser",
        email: "anika.visser@devias.io",
      };

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

    // Simulate an authenticated request to a protected function
    const authenticatedResponse = protectedFunction(user);
    console.log("Authenticated request response:", authenticatedResponse);
  };

  const signIn = async (email, password) => {
    try {
      // Simulate a login request (replace with actual API call)
      const user = {
        id: "5e86809283e28b96d2d38537",
        name: "John Doe", // Modify with the user's name
        email: email, // Use the provided email
      };

      // Save user data and authentication in session storage
      try {
        window.sessionStorage.setItem("authenticated", "true");
        // You can save the user's name and email in session storage if needed
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });

      // Simulate an authenticated request to a protected function
      const authenticatedResponse = protectedFunction(user);
      console.log("Authenticated request response:", authenticatedResponse);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signUp = async (firstname, lastname, email, mobile, password) => {
    try {
      // Simulate a registration request (replace with actual API call)
      const user = {
        id: "5e86809283e28b96d2d38537",
        name: `${firstname} ${lastname}`,
        email: email,
      };

      // Save user data and authentication in session storage
      try {
        window.sessionStorage.setItem("authenticated", "true");
        // You can save the user's name and email in session storage if needed
      } catch (err) {
        console.error(err);
      }

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });

      // Simulate an authenticated request to a protected function
      const authenticatedResponse = protectedFunction(user);
      console.log("Authenticated request response:", authenticatedResponse);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT,
    });
  };

  const protectedFunction = (user) => {
    // Simulate a protected function that returns the user's name and email
    return {
      data: {
        name: user.name,
        email: user.email,
      },
    };
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
