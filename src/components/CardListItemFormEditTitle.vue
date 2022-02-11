<template>
  <base-modal-form @submit:form="submitForm" @click:closeForm="hideForm">
    <template v-slot:title>
      カードタイトル編集
    </template>

    <template v-slot:body>
      <div>
        <base-label :input="cardTitleRef"> カードタイトル</base-label>
        <input ref="cardTitleRef" name="cardTitle" type="text" required />
      </div>
    </template>
  </base-modal-form>
</template>

<script>
import { inject, ref, onMounted } from "vue";

export default {
  props: {
    cardId: { type: String, required: true },
    cardTitle: { type: String, required: true },
  },

  setup(props) {
    const { editCardTitle } = inject("useCard");
    const { validate, isValid } = inject("useValidate");
    const { hideForm } = inject("useDynamicForm");

    onMounted(() => {
      cardTitleRef.value.value = props.cardTitle;
      cardTitleRef.value.focus();
    });

    const cardTitleRef = ref(null);

    const submitForm = async () => {
      validate([cardTitleRef.value]);
      if (!isValid.value) return;

      const newTitle = cardTitleRef.value.value;
      const cardId = props.cardId;
      await editCardTitle(newTitle, cardId);

      hideForm();
    };

    return {
      cardTitleRef,

      submitForm,
      hideForm,
    };
  },
};
</script>
