const state = {
  loginMode: null,

  userId: null,
  token: null,
  refreshToken: null,

  didFetchSample: false,
};

const getters = {
  loginMode(state) {
    return state.loginMode;
  },

  userId(state) {
    return state.userId;
  },

  token(state) {
    return state.token;
  },

  refreshToken(state) {
    return state.refreshToken;
  },

  isAuthenticated(state) {
    return !!state.token;
  },

  didFetchSample(state) {
    return state.didFetchSample;
  },
};

const mutations = {
  setUser(state, payload) {
    state.loginMode = "user";

    state.userId = payload.userId;
    state.token = payload.token;
    state.refreshToken = payload.refreshToken;
  },

  setGuest(state) {
    state.loginMode = "guest";

    state.token = "guest";
    state.userId = "guest";
  },

  setFetchSample(state) {
    state.didFetchSample = true;
  },
};

let refreshTokenTimer;

const actions = {
  async signup({ dispatch }, payload) {
    return dispatch("auth", {
      ...payload,
      mode: "signup",
    });
  },

  async login({ dispatch }, payload) {
    return dispatch("auth", {
      ...payload,
      mode: "signInWithPassword",
    });
  },

  async auth({ dispatch }, payload) {
    const mode = payload.mode; // signup or signInWithPassword
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=AIzaSyD7Z6iAl0ly6mwd4IKih0DRfHSsw7It1Xs`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        returnSecureToken: true,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(responseData.message || "認証に失敗しました。");
      throw error;
    }

    dispatch("setUser", responseData);

    dispatch("setTimerAutoRefreshToken", +responseData.expiresIn * 1000); // 1時間
  },

  setUser({ commit }, responseData) {
    localStorage.setItem("userId", responseData.localId);
    localStorage.setItem("token", responseData.idToken);
    const expirationDate = new Date().getTime() + responseData.expiresIn * 1000;
    localStorage.setItem("tokenExpiration", expirationDate);
    localStorage.setItem("refreshToken", responseData.refreshToken);

    commit("setUser", {
      userId: responseData.localId,
      token: responseData.idToken,
      refreshToken: responseData.refreshToken,
    });
  },

  setTimerAutoRefreshToken({ dispatch }, expiresIn) {
    refreshTokenTimer = setTimeout(() => {
      try {
        dispatch("refreshToken");
      } catch (error) {
        console.log(error.message);
      }
    }, expiresIn);
  },

  async refreshToken({ getters, dispatch }) {
    clearTimeout(refreshTokenTimer);

    const response = await fetch(
      "https://securetoken.googleapis.com/v1/token?key=AIzaSyD7Z6iAl0ly6mwd4IKih0DRfHSsw7It1Xs",
      {
        method: "POST",
        body: JSON.stringify({
          grant_type: "refresh_token",
          refresh_token: getters.refreshToken,
        }),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      const error = new Error(
        responseData.message || "トークンの更新に失敗しました。"
      );
      throw error;
    }

    await dispatch("setUser", {
      localId: responseData.user_id,
      idToken: responseData.id_token,
      expiresIn: responseData.expires_in,
      refreshToken: responseData.refresh_token,
    });

    dispatch("setTimerAutoRefreshToken", +responseData.expires_in * 1000); // デフォルト = 1時間
  },

  async tryAutoLogin({ dispatch, commit }) {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");
    const expiresIn = +tokenExpiration - new Date().getTime();
    const refreshToken = localStorage.getItem("refreshToken");

    if (tokenExpiration & (expiresIn < 0)) {
      dispatch("refreshToken");
    } else if (token && token !== "guest") {
      commit("setUser", {
        token,
        userId,
        refreshToken,
      });

      dispatch("setTimerAutoRefreshToken", expiresIn);
    }
  },

  logout({ commit }) {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("theme");

    commit("setUser", {
      token: null,
      userId: null,
      refreshToken: null,
    });

    clearTimeout(refreshTokenTimer);
  },

  guestLogin(context) {
    context.commit("setGuest");
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
