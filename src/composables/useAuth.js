import { ref, computed, readonly } from "vue";

// state
const authMode = ref("signup"); // signup or signInWithPassword
const loginMode = ref(null); // user or guest
const userId = ref(null);
const token = ref(null);
const refreshToken = ref(null);

const isAuthenticated = computed(() => !!token.value);
const authError = ref(false);
const isLoading = ref(false);

// モード切替(アカウント作成 or ログイン)
const switchAuthMode = () => {
  authError.value = false;
  authMode.value =
    authMode.value === "signup" ? "signInWithPassword" : "signup";
};

// 認証
const tryAuth = async (authMode, email, password) => {
  authError.value = false;
  isLoading.value = true;

  try {
    await auth(authMode, email, password);
    isLoading.value = false;
  } catch (err) {
    console.log(err.message);
    authError.value = true;
    isLoading.value = false;
  }
};

const auth = async (authMode, email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${authMode}?key=AIzaSyD7Z6iAl0ly6mwd4IKih0DRfHSsw7It1Xs`;

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });
  const responseData = await response.json();
  if (!response.ok) {
    const error = new Error(responseData.message || "認証に失敗しました。");
    throw error;
  }

  localStorage.setItem("userId", responseData.localId);
  localStorage.setItem("token", responseData.idToken);
  const expirationDate = new Date().getTime() + responseData.expiresIn * 1000;
  localStorage.setItem("tokenExpiration", expirationDate);
  localStorage.setItem("refreshToken", responseData.refreshToken);

  const loginMode = "user";
  const localId = responseData.localId;
  const idToken = responseData.idToken;
  const refreshToken = responseData.refreshToken;
  setUser(loginMode, localId, idToken, refreshToken);
  setTimerAutoRefreshToken(+responseData.expiresIn * 1000); // 1時間
};

const setUser = (mode, id, userToken, userRefreshToken) => {
  loginMode.value = mode;
  userId.value = id;
  token.value = userToken;
  refreshToken.value = userRefreshToken;
};

// トークン更新
// firebase生成の認証用トークンは有効期限があるため、タイマーを設定し自動的に更新
let refreshTokenTimer;
const setTimerAutoRefreshToken = (expiresIn) => {
  refreshTokenTimer = setTimeout(() => {
    try {
      handleRefreshToken();
    } catch (error) {
      console.log(error.message);
    }
  }, expiresIn);
};

const handleRefreshToken = async () => {
  clearTimeout(refreshTokenTimer);

  const response = await fetch(
    "https://securetoken.googleapis.com/v1/token?key=AIzaSyD7Z6iAl0ly6mwd4IKih0DRfHSsw7It1Xs",
    {
      method: "POST",
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken.value,
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

  const localId = responseData.user_id;
  const idToken = responseData.id_token;
  const expiresIn = responseData.expires_in;
  const refreshToken = responseData.refresh_token;
  await setUser("user", localId, idToken, refreshToken);
  setTimerAutoRefreshToken(+expiresIn * 1000); // デフォルト = 1時間
};

// オートログイン
const tryAutoLogin = async () => {
  const loginMode = "user";
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const tokenExpiration = localStorage.getItem("tokenExpiration");
  const expiresIn = +tokenExpiration - new Date().getTime();
  const refreshToken = localStorage.getItem("refreshToken");

  if (tokenExpiration & (expiresIn < 0)) {
    handleRefreshToken();
  } else if (token && token !== "guest") {
    setUser(loginMode, userId, token, refreshToken);
    setTimerAutoRefreshToken(expiresIn);
  }
};

// ログアウト
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("tokenExpiration");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("theme");

  const loginMode = null;
  const token = null;
  const userId = null;
  const refreshToken = null;
  setUser(loginMode, userId, token, refreshToken);
  clearTimeout(refreshTokenTimer);
};

// ゲストログイン
const guestLogin = () => {
  const loginMode = "guest";
  const userId = "guest";
  const token = null;
  const refreshToken = null;
  setUser(loginMode, userId, token, refreshToken);
};

// const setFetchSample = () => {
//   didFetchSample.value = true;
// };

export default function useCard() {
  return {
    authMode: readonly(authMode),
    authError: readonly(authError),
    isLoading: readonly(isLoading),
    loginMode: readonly(loginMode),
    userId: readonly(userId),
    token: readonly(token),
    refreshToken: readonly(refreshToken),
    // didFetchSample: readonly(didFetchSample),
    isAuthenticated: readonly(isAuthenticated),

    switchAuthMode,
    tryAuth,
    tryAutoLogin,
    logout,
    guestLogin,
    // setFetchSample,
  };
}
