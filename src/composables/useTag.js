import useCard from "@/composables/useCard";

const { updateTags } = useCard();

const addTag = async ({ newTag, currentTags, cardIndex }) => {
  const newTags = [...currentTags, newTag];
  updateTags({ newTags, cardIndex });
};

const deleteTag = async ({ targetTag, currentTags, cardIndex }) => {
  const newTags = currentTags.filter((tag) => tag !== targetTag);
  updateTags({ newTags, cardIndex });

  // if (!store.getters.filteredCards.length) {
  //   store.dispatch("removeFilter");
  // }
};

export default function useTag() {
  return {
    addTag,
    deleteTag,
  };
}
