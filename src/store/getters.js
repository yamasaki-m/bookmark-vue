export default {
  storedCards(state) {
    return state.storedCards;
  },

  filterOptions(state) {
    return state.storedCards.reduce((accumulatedTags, currentCard) => {
      return Array.from(new Set([...accumulatedTags, ...currentCard.tags]));
    }, []);
  },
};
