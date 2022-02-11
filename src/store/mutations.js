export default {
  // カード全体
  createCard(state, payload) {
    state.storedCards = payload;
  },

  setCards(state, payload) {
    state.storedCards = payload;
  },

  editCardTitle(state, { index, newTitle }) {
    const targetCard = state.storedCards[index];
    targetCard.title = newTitle;
  },

  deleteCard(state, { newCards }) {
    state.storedCards = newCards;
  },

  sortCard(state, { sortedCards }) {
    state.storedCards = sortedCards;
  },

  // タグ関連
  addTag(state, { index, newTags }) {
    const targetCard = state.storedCards[index];

    targetCard.tags = newTags;
  },

  deleteTag(state, { index, newTags }) {
    const targetCard = state.storedCards[index];
    targetCard.tags = newTags;
  },

  // リンク関連
  incrementCount(state, payload) {
    const targetCard = state.storedCards[payload.cardIndex];
    const targetLink = targetCard.links[payload.linkIndex];

    targetLink.clickCount = payload.newCount;
  },

  addLink(state, payload) {
    const targetCard = state.storedCards[payload.cardIndex];

    targetCard.links.push(payload.newLink);
  },

  editLink(state, payload) {
    const targetCard = state.storedCards[payload.cardIndex];

    targetCard.links[payload.linkIndex] = payload.newLink;
  },

  deleteLink(state, payload) {
    const targetCard = state.storedCards[payload.cardIndex];

    const links = targetCard.links;

    links.splice(0, links.length, ...payload.newList);
    // 現状、targetCard.links = payload.newLinks ではリアクティブにならない様子
  },

  resetClickCount(state) {
    [...state.storedCards].reduce((acc, card) => {
      [...card.links].map((link) => (link.clickCount = 0));
      acc = [card, ...acc];
      return acc;
    }, []);
  },
};
