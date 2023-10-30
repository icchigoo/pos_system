import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios"; // Import axios for making HTTP requests
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
      ...// if payload (user) is provided, then is authenticated
      (user
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
    // Prevent from calling twice in development mode with React.StrictMode enabled
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

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
  
      // Use the authenticatedAxios instance to make authenticated requests
      const authenticatedResponse = await authenticatedAxios.get(`${base_url}some/protected/endpoint`);
      console.log("Authenticated request response:", authenticatedResponse);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  
  

  const signUp = async (firstname, lastname, email, mobile, password) => {
    try {
      // Make an API call to register a new user
      const response = await axios.post(`${base_url}user/register`, {
        firstname: firstname,
        lastname: lastname,
        email: email,
        mobile: mobile,
        password: password,
      });

      // Handle the response from the server
      if (response.data.message === "User created successfully") {
        // User registration was successful
        // You can add any additional logic here if needed
        // Save user authentication state in session storage
        try {
          window.sessionStorage.setItem("authenticated", "true");
        } catch (err) {
          console.error(err);
        }

        // Dispatch the user data to the state
        const user = {
          id: response.data.userId, // Modify this based on your API response
          // Other user data from the API response
        };

        dispatch({
          type: HANDLERS.SIGN_IN,
          payload: user,
        });
      } else {
        // Handle registration error, e.g., display an error message
        console.error("Registration failed:", response.data.message);
      }
    } catch (error) {
      // Handle network error or other issues with the registration API
      console.error("Registration failed:", error);
    }
  };

  const signOut = () => {

    try {
      window.sessionStorage.removeItem("token");
      window.sessionStorage.removeItem("authenticated");
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