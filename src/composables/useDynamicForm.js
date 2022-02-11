import { ref, readonly } from "vue";

const openedForm = ref(null);
const id = ref(null);

const showForm = ({ form, cardId }) => {
  openedForm.value = "CardListItemForm" + form;
  id.value = cardId;
};

const hideForm = () => {
  openedForm.value = null;
  id.value = null;
};

export default function useDynamicForm() {
  return {
    openedForm: readonly(openedForm),
    id: readonly(id),

    showForm,
    hideForm,
  };
}
