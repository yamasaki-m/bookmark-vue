<template>
  <base-modal-form @submit:form="submitForm" @click:closeForm="hideForm">
    <template v-slot:title>
      タグ作成
    </template>

    <template v-slot:body>
      <div>
        <base-label :input="tagRef">タグ名</base-label>
        <input ref="tagRef" name="tagTitle" type="text" required />
      </div>
    </template>
  </base-modal-form>
</template>

<script>
import { inject, ref, onMounted } from "vue";

export default {
  props: {
    cardIndex: { type: Number, required: true },
    // cardId: { type: String, required: true },
    tags: { type: Array, required: true },
  },

  setup(props) {
    const { addTag } = inject("useTag");
    const { validate, isValid } = inject("useValidate");
    const { hideForm } = inject("useDynamicForm");

    onMounted(() => {
      tagRef.value.focus();
    });

    const tagRef = ref(null);

    const submitForm = async () => {
      validate([tagRef.value]);
      if (!isValid.value) return;

      await addTag({
        newTag: tagRef.value.value,
        currentTags: props.tags,
        cardIndex: props.cardIndex,
      });

      hideForm();
    };

    return {
      tagRef,

      submitForm,
      hideForm,
    };
  },
};
</script>
