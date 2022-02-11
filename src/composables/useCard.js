import { ref, readonly } from "vue";

import useAuth from "@/composables/useAuth";

const firebase =
  "https://bookmark-vue-9e70a-default-rtdb.asia-southeast1.firebasedatabase.app";

const { loginMode, userId, token } = useAuth();

// state
const storedCards = ref([]);
const isLoading = ref(false);
const didFetchSample = ref(false);
const isError = ref(false);

// カード読み込み
const fetchCards = async (loginMode) => {
  isLoading.value = true;
  isError.value = false;

  let response;
  try {
    if (loginMode === "user") {
      response = await fetchUsersCards({ userId, token });
    } else if (loginMode === "guest" && !didFetchSample.value) {
      response = await fetchSampleCards();
      didFetchSample.value = true;
    } else {
      isLoading.value = false;
      return;
    }
    if (!response.ok) {
      const error = new Error(
        error.message || "データを読み込めませんでした。"
      );
      throw error;
    }
    const responseData = await response.json();
    setCards(responseData);
  } catch (error) {
    console.log(error.message);
    isError.value = true;
  }

  isLoading.value = false;
};

const fetchUsersCards = async ({ userId, token }) => {
  return await fetch(
    `${firebase}/users/${userId.value}/cards.json?auth=` + token.value,
    { method: "GET" }
  );
};

const fetchSampleCards = async () => {
  // didFetchSample.value = true;
  return await fetch(`${firebase}/guest/cards/.json`, { method: "GET" });
};

const setCards = (responseData) => {
  const cards = [];
  for (const key in responseData) {
    const card = {
      index: +key,
      id: responseData[key].id,
      title: responseData[key].title,
      tags: responseData[key].tags || [],
      links: responseData[key].links || [],
    };
    cards.push(card);
  }
  storedCards.value = cards;
};

// カード追加
const addCard = async (newCard) => {
  const index = storedCards.value.length;
  const newCards = [...storedCards.value, newCard];

  if (loginMode.value === "user") {
    const response = await fetch(
      `${firebase}/users/${userId.value}/cards/${index}.json?auth=` +
        token.value,
      { method: "PUT", body: JSON.stringify(newCard) }
    );
    if (!response.ok) {
      const error = new Error("データを正常に送信できませんでした。");
      throw error;
    }
  }

  storedCards.value = newCards;
};

// カード削除
const deleteCard = async (targetId) => {
  const newCards = storedCards.value.filter((card) => card.id !== targetId);

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/.json?auth=` + token.value,
      { method: "PUT", body: JSON.stringify(newCards) }
    );
  }

  storedCards.value = newCards;
};

// タイトル編集
const editCardTitle = async (newTitle, cardId) => {
  const cardIndex = storedCards.value.findIndex((card) => card.id === cardId);
  const targetCard = storedCards.value[cardIndex];

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/${cardIndex}/title/.json?auth=` +
        token.value,
      {
        method: "PUT",
        body: JSON.stringify(newTitle),
      }
    );
  }

  targetCard.title = newTitle;
};

// 外部composable関数からのデータ更新関連
const updateTags = async ({ newTags, cardIndex }) => {
  const targetCard = storedCards.value[cardIndex];
  targetCard.tags = newTags;

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/${cardIndex}/tags/.json?auth=` +
        token.value,
      {
        method: "PUT",
        body: JSON.stringify(newTags),
      }
    );
  }
};

const updateLinks = async ({ newLinks, cardIndex }) => {
  const targetCard = storedCards.value[cardIndex];
  targetCard.links = newLinks;

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/${cardIndex}/links/.json?auth=` +
        token.value,
      {
        method: "PUT",
        body: JSON.stringify(newLinks),
      }
    );
  }
};

const updateSingleLink = async ({ newLink, linkIndex, cardIndex }) => {
  const targetCard = storedCards.value[cardIndex];
  targetCard.links[linkIndex] = newLink;

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/${cardIndex}/links/${linkIndex}.json?auth=` +
        token.value,
      {
        method: "PATCH",
        body: JSON.stringify(newLink),
      }
    );
  }
};

const updateClickCount = async ({ newCount, linkIndex, cardIndex }) => {
  const targetCard = storedCards.value[cardIndex];
  const targetLink = targetCard.links[linkIndex];
  targetLink.clickCount = newCount;

  if (loginMode.value === "user") {
    await fetch(
      `${firebase}/users/${userId.value}/cards/${cardIndex}/links/${linkIndex}/clickCount.json?auth=` +
        token.value,
      {
        method: "PUT",
        body: JSON.stringify(newCount),
      }
    );
  }
};

export default function useCard() {
  return {
    storedCards: readonly(storedCards),
    isLoading: readonly(isLoading),
    didFetchSample: readonly(didFetchSample),
    isError: readonly(isError),

    fetchCards,
    fetchUsersCards,
    fetchSampleCards,
    addCard,
    deleteCard,
    editCardTitle,

    updateTags,
    updateLinks,
    updateSingleLink,
    updateClickCount,
  };
}
