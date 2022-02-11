import { ref, computed } from "vue";

const isValid = computed(() => {
  return !emptyInputs.value.length && !errorInputs.value.length;
});
const emptyInputs = ref([]);
const errorInputs = ref([]);

const errorMessage = {
  require: "*入力が必須の項目です",
  url: "*リンクURLが無効です",
  email: "*メールアドレスが無効です",
  password: "*6文字以上必要です",
};

const validate = (inputs) => {
  validateRequired(inputs);
  validateRegex(inputs);
};

const validateRequired = (inputs) => {
  emptyInputs.value = inputs.reduce((acc, cur) => {
    if (cur.required && !cur.value) {
      acc = [...acc, cur];
    }
    return acc;
  }, []);
};

const validateRegex = (inputs) => {
  const notEmptyInputs = inputs.filter(
    // 入力済のinput = emptyInputsに存在しないinput(-1を返す) を抽出
    (input) => emptyInputs.value.indexOf(input) == -1
  );

  errorInputs.value = notEmptyInputs.reduce((acc, cur) => {
    const urlRegex = /^http(|s):\/\/.+/;
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (
      (cur.type === "url" && !urlRegex.test(cur.value)) ||
      (cur.type === "email" && !emailRegex.test(cur.value)) ||
      (cur.type === "password" && cur.value.length < 6)
    ) {
      acc = [...acc, cur];
    }

    return acc;
  }, []);
};

const isEmpty = (input) => {
  return emptyInputs.value.includes(input);
};
const isError = (input) => {
  return errorInputs.value.includes(input);
};

export default function useValidateInputs() {
  return {
    validate,
    isValid,
    isEmpty,
    isError,
    errorMessage,
  };
}
