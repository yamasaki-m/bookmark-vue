<template>
  <base-modal-form @submit:form="submitForm" @click:closeForm="hideForm">
    <template v-slot:title>
      リンク編集
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

      <div>
        <base-label :input="countRef">カウント</base-label>
        <input
          ref="countRef"
          name="clickCount"
          type="number"
          min="0"
          required
        />
      </div>
    </template>
  </base-modal-form>
</template>

<script>
import { inject, ref, onMounted } from "vue";

export default {
  props: {
    cardIndex: { type: Number, required: true },
    link: { type: Object, required: true },
  },

  setup(props) {
    const { editLink } = inject("useLink");
    const { validate, isValid } = inject("useValidate");
    const { hideForm } = inject("useDynamicForm");

    const titleRef = ref(null);
    const urlRef = ref(null);
    const countRef = ref(null);

    onMounted(() => {
      titleRef.value.value = props.link.title;
      urlRef.value.value = props.link.URL;
      countRef.value.value = props.link.clickCount;

      titleRef.value.focus();
    });

    const submitForm = async () => {
      validate([titleRef.value, urlRef.value, countRef.value]);
      if (!isValid.value) return;

      const newLink = {
        id: props.link.id,
        index: props.link.index,
        title: titleRef.value.value,
        URL: urlRef.value.value,
        clickCount: countRef.value.value,
      };

      await editLink({
        newLink,
        linkIndex: props.link.index,
        cardIndex: props.cardIndex,
      });

      hideForm();
    };

    return {
      titleRef,
      urlRef,
      countRef,

      submitForm,
      hideForm,
    };
  },
};
</script>
