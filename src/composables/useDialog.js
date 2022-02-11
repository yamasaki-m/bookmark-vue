import { ref, readonly } from "vue";

const isShow = ref(false);
const dialogTitle = ref(null);
const dialogText = ref(null);
const callbackFunction = ref(null);

const showDialog = ({ title, text, callback }) => {
  isShow.value = true;
  dialogTitle.value = title;
  dialogText.value = text;
  callbackFunction.value = callback;
};

const hideDialog = () => {
  isShow.value = false;
  dialogTitle.value = null;
  dialogText.value = null;
  callbackFunction.value = null;
};

export default function useCard() {
  return {
    isShow: readonly(isShow),
    dialogTitle: readonly(dialogTitle),
    dialogText: readonly(dialogText),
    callbackFunction: readonly(callbackFunction),

    showDialog,
    hideDialog,
  };
}
