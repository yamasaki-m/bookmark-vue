<template>
  <base-card class="card" padding="md">
    <transition-group name="list">
      <!-- ▼ カード作成フォーム ▼ -->
      <form class="create-card-form" key="addCardForm">
        <div class="create-card-form__card-title">
          <div class="input-field">
            <base-label class="input-field__label" :input="cardTitleRef">
              カードタイトル
            </base-label>
            <input
              class="input-field__input"
              v-model.trim.lazy="card.title"
              ref="cardTitleRef"
              name="cardTitle"
              type="text"
              placeholder="Vue.js"
              required
            />
          </div>
        </div>

        <div class="create-card-form__links">
          <transition-group class="added-links" name="list" tag="ul">
            <li
              v-for="(link, index) in card.links"
              class="added-links__item"
              :key="link.id"
            >
              <div class="form-group">
                <div class="form-group__body">
                  <div class="input-field">
                    <base-label
                      class="input-field__label"
                      :input="addedLinkTitleRefs[index]"
                    >
                      リンクタイトル
                    </base-label>
                    <input
                      class="input-field__input"
                      :ref="
                        (el) => {
                          if (el) addedLinkTitleRefs[index] = el;
                        }
                      "
                      :name="'addedLinkTitle' + index"
                      type="text"
                      v-model.trim.lazy="link.title"
                      required
                    />
                  </div>

                  <div class="input-field">
                    <base-label
                      class="input-field__label"
                      :input="addedLinkURLRefs[index]"
                      inputType="url"
                    >
                      リンクURL
                    </base-label>
                    <input
                      class="input-field__input"
                      :ref="
                        (el) => {
                          if (el) addedLinkURLRefs[index] = el;
                        }
                      "
                      type="url"
                      :name="'addedLinkURL' + index"
                      v-model.trim.lazy="link.URL"
                      required
                    />
                  </div>
                </div>

                <base-button
                  classes="rounded-xs tertiary"
                  type="button"
                  @click="confirmDeleteLink(link)"
                >
                  <base-icon size="md">
                    delete
                  </base-icon>
                </base-button>
              </div>
            </li>
          </transition-group>
        </div>

        <div
          v-if="card.links.length"
          class="create-card-form__create-button-wrapper"
          key="submitButtonWrapper"
        >
          <base-button
            classes="rounded-md primary"
            type="button"
            @click="createCard"
          >
            この内容で作成
          </base-button>
        </div>
      </form>
      <!-- ▲ カード作成フォーム ▲ -->

      <!-- ▼ リンク追加フォーム ▼ -->
      <form class="add-link-form" key="addLinkForm">
        <div class="form-group">
          <div class="form-group__body add-link-form__body">
            <div class="input-field">
              <base-label class="input-field__label" :input="newLinkTitleRef">
                リンクタイトル
              </base-label>
              <input
                class="input-field__input"
                ref="newLinkTitleRef"
                name="linkTitle"
                type="text"
                placeholder="公式サイト"
                required
              />
            </div>

            <div class="input-field">
              <base-label class="input-field__label" :input="newLinkURLRef">
                リンクURL
              </base-label>
              <input
                class="input-field__input"
                ref="newLinkURLRef"
                name="linkURL"
                type="url"
                placeholder="https://v3.ja.vuejs.org/"
                required
              />
            </div>
          </div>
          <base-button
            classes="rounded-xs primary"
            type="button"
            @click="addLink"
          >
            <base-icon size="md">
              add
            </base-icon>
          </base-button>
        </div>
      </form>
      <!-- ▲ リンク追加フォーム ▲ -->
    </transition-group>
  </base-card>
</template>

<script>
import { ref, reactive, onBeforeUpdate } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import useCard from "@/composables/useCard";
import useValidateInputs from "../composables/useValidateInputs";

export default {
  setup() {
    const { addCard } = useCard();

    const router = useRouter();
    const store = useStore();
    // const storedCards = computed(() => store.getters.storedCards);

    const newLinkTitleRef = ref(null);
    const newLinkURLRef = ref(null);

    const cardTitleRef = ref(null);
    const addedLinkTitleRefs = ref([]);
    const addedLinkURLRefs = ref([]);

    onBeforeUpdate(() => {
      addedLinkTitleRefs.value = [];
      addedLinkURLRefs.value = [];
    });

    // カード作成
    const card = reactive({
      id: null,
      title: "", // v-model
      links: [],
      tags: [],
    });

    const createCard = async () => {
      if (!isValidCard()) return;

      card.id = generateID();

      addCard({ ...card });
      // await store.dispatch("createCard", {
      //   index: storedCards.value.length,
      //   newCard: { ...card },
      // });

      postProcessOfAddCard();
    };

    const { validate, isValid } = useValidateInputs();

    const isValidCard = () => {
      const inputs = [
        cardTitleRef.value,
        ...addedLinkTitleRefs.value,
        ...addedLinkURLRefs.value,
      ];
      validate(inputs);

      return isValid.value;
    };

    const postProcessOfAddCard = () => {
      cardTitleRef.value.value = "";
      addedLinkTitleRefs.value = [];
      addedLinkURLRefs.value = [];

      card.title = "";
      card.links = [];

      router.replace("/storedCard");
    };

    // リンク追加
    const addLink = () => {
      if (!isValidLink()) return;

      const newLink = {
        id: generateID(),
        title: newLinkTitleRef.value.value,
        URL: newLinkURLRef.value.value,
        clickCount: 0,
      };

      card.links = [...card.links, { ...newLink }];

      postProcessOfRecordLink();
    };

    const isValidLink = () => {
      let inputs = [newLinkTitleRef.value, newLinkURLRef.value];
      validate(inputs);

      return isValid.value;
    };

    const generateID = () => {
      return Math.random()
        .toString(32)
        .substring(2);
    };

    const postProcessOfRecordLink = () => {
      newLinkTitleRef.value.value = "";
      newLinkURLRef.value.value = "";

      newLinkTitleRef.value.focus();
    };

    // リンク削除
    const confirmDeleteLink = (target) => {
      store.dispatch("showConfirmDialog", {
        title: "リンク消去確認",
        text: "このリンクを消去しますか？",
        handlerOnAllow: () => deleteLink(target),
      });
    };

    const deleteLink = (target) => {
      addedLinkTitleRefs.value = [];
      addedLinkURLRefs.value = [];

      card.links = card.links.filter((link) => {
        return link !== target;
      });

      store.dispatch("hideDialog");
    };

    return {
      newLinkTitleRef,
      newLinkURLRef,

      cardTitleRef,
      addedLinkTitleRefs,
      addedLinkURLRefs,

      // カード作成
      card,
      createCard,

      // リンク追加
      addLink,

      // リンク削除
      confirmDeleteLink,
    };
  },

  beforeRouteEnter(_, _2, next) {
    next((vm) => {
      vm.$refs.cardTitleRef.focus();
    });
  },
};
</script>

<style scoped lang="scss">
/*=======================================
	カード
  =======================================*/
.card {
  &.base-card {
    min-width: 40rem;
    height: max-content;

    @include respond(phone) {
      max-width: 35rem;
    }
  }
}

/*=======================================
	フォームの共通スタイル
  =======================================*/
.form-group {
  display: flex;
  justify-content: space-between;
  column-gap: var(--space-4);

  &__body {
    flex: 1;

    display: flex;
    flex-direction: column;
    row-gap: var(--space-16);
    padding: var(--space-10);
    border: 1px solid var(--color-gray-300);
    border-radius: 8px;
  }
}

.input-field {
  &__input {
    width: 100%;
    border-bottom: 2px solid var(--color-gray-200);
    background: var(--color-white);
    color: var(--color-gray-900);
    font-family: inherit;
    font-size: var(--text-md);
    font-weight: inherit;
    transition: border-color 0.25s var(--ease-out);

    &:focus {
      border-color: var(--color-gray-400);
    }
  }

  ::placeholder {
    color: var(--color-gray-200);
  }
}

/*=======================================
	カード作成フォーム
  =======================================*/
.create-card-form {
  display: flex;
  flex-direction: column;
  row-gap: var(--space-10);

  &__create-button-wrapper {
    margin-bottom: var(--space-16);
    padding-bottom: var(--space-16);
    border-bottom: 1px dashed var(--color-gray-300);
    text-align: center;
  }
}

.added-links {
  position: relative;
  display: flex;
  flex-direction: column;
  row-gap: var(--space-10);
}

/*=======================================
	リンク追加フォーム
  =======================================*/
.add-link-form {
  &__body {
    border: 2px solid var(--color-black);
  }
}
</style>
