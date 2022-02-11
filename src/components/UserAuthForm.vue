<template>
  <base-spinner v-if="isLoading" />

  <base-card v-else class="card" padding="lg">
    <h2 class="card__title">{{ formTitle }}</h2>

    <base-form @submit.prevent="submitForm">
      <div>
        <base-label :input="emailRef">
          メールアドレス
        </base-label>
        <input ref="emailRef" name="email" type="email" required />
      </div>

      <div>
        <base-label :input="passwordRef">
          パスワード(6文字以上)
        </base-label>
        <input ref="passwordRef" name="password" type="password" required />
      </div>

      <p v-if="authError" class="auth-message">
        認証に失敗しました。メールアドレスとパスワードをご確認ください。
      </p>

      <div class="actions">
        <base-button classes="primary rounded-sm" type="submit">
          {{ submitButtonText }}
        </base-button>

        <base-button
          v-if="authMode === 'signup'"
          classes="tertiary rounded-sm"
          type="button"
          @click="handleGuestLogin"
        >
          ゲストログイン
        </base-button>
      </div>
    </base-form>

    <p class="instead">
      <span v-if="authMode === 'signup'" class="instead__text">
        アカウントをお持ちの方は
      </span>
      <span v-else class="instead__text">
        アカウントをお持ちでない方は
      </span>

      <a class="instead__link" @click="switchAuthMode">
        {{ switchButtonText }}
      </a>
    </p>
  </base-card>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

import useValidateInputs from "../composables/useValidateInputs";
import useAuth from "@/composables/useAuth.js";

export default {
  setup() {
    // prettier-ignore
    const { authMode,switchAuthMode,tryAuth,authError,isLoading,guestLogin } = useAuth();
    const { validate, isValid } = useValidateInputs();
    const router = useRouter();

    const emailRef = ref(null);
    const passwordRef = ref(null);

    const formTitle = computed(() => {
      return authMode.value === "signup" ? "Sign Up" : "Log In";
    });
    const submitButtonText = computed(() => {
      return authMode.value === "signup" ? "アカウント登録" : "ログイン";
    });
    const switchButtonText = computed(() => {
      return authMode.value === "signup" ? "ログイン" : "アカウント登録";
    });

    const submitForm = async () => {
      validate([emailRef.value, passwordRef.value]);
      if (!isValid.value) return;

      await tryAuth(
        authMode.value,
        emailRef.value.value,
        passwordRef.value.value
      );
      router.replace("/storedCard");
    };

    const handleGuestLogin = () => {
      guestLogin();
      router.replace("/storedCard");
    };

    return {
      emailRef,
      passwordRef,
      formTitle,
      submitButtonText,
      switchButtonText,

      switchAuthMode,
      authMode,

      submitForm,
      isLoading,
      authError,

      handleGuestLogin,
    };
  },
};
</script>

<style scoped lang="scss">
.card {
  &.base-card {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 38rem;
    margin: 0 auto;

    @include respond(phone) {
      top: 35%;
      left: 50%;
      width: 35rem;
    }
  }

  &__title {
    margin-bottom: var(--space-28);
    font-family: "Segoe UI", "Arial", sans-serif;
    font-size: var(--text-xl);
    font-weight: 400;
    letter-spacing: 1px;
    text-align: center;
  }
}

.auth-message {
  margin-bottom: var(--space-6);
  font-size: var(--text-sm);
  color: var(--color-red);
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: var(--space-10);
  margin-bottom: var(--space-10);
}

.instead {
  text-align: center;

  &__text {
    font-size: var(--text-sm);
    letter-spacing: -1.1px;
  }

  &__link {
    color: #148578;
    font-size: var(--text-sm);
    font-weight: bold;
    letter-spacing: -1.1px;
    cursor: pointer;
  }
}
</style>
