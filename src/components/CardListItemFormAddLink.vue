<template>
  <base-modal-form @submit:form="submitForm" @click:closeForm="hideForm">
    <template v-slot:title>
      リンク追加
    </template>

    <template v-slot:body>
      <div>
        <base-label :input="titleRef">リンクタイトル</base-label>
        <input ref="titleRef" name="linkTitle" type="text" required />
      </div>

      <div>
        <base-label :input="urlRef">リンクURL</base-label>
        <input ref="urlRef" name="linkURL" type="url" required />
      </div>
    </template>
  </base-modal-form>
</template>

<script>
import { inject, ref, onMounted } from "vue";

export default {
  props: {
    cardIndex: { type: Number, required: true },
    links: { type: Array, required: true },
  },

  setup(props) {
    const { addLink } = inject("useLink");
    const { validate, isValid } = inject("useValidate");
    const { hideForm } = inject("useDynamicForm");

    onMounted(() => {
      titleRef.value.focus();
    });

    const titleRef = ref(null);
    const urlRef = ref(null);

    const submitForm = async () => {
      validate([titleRef.value, urlRef.value]);
      if (!isValid.value) return;

      const newLink = {
        index: props.links.length,
        id: Math.random()
          .toString(32)
          .substring(2),
        title: titleRef.value.value,
        URL: urlRef.value.value,
        clickCount: 0,
      };
      await addLink({
        newLink,
        currentLinks: props.links,
        cardIndex: props.cardIndex,
      });

      hideForm();
    };

    return {
      titleRef,
      urlRef,

      submitForm,
      hideForm,
    };
  },
};
</script>
