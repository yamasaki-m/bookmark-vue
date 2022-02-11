import { ref, readonly, computed } from "vue";

import useCard from "@/composables/useCard";

const { storedCards } = useCard();

// state
const isFiltered = ref(false);
const filteredCards = ref([]);
const allOptions = computed(() => {
  return storedCards.value.reduce((accumulatedTags, currentCard) => {
    return Array.from(new Set([...accumulatedTags, ...currentCard.tags]));
  }, []);
});
const checkedOptions = ref(["displayAll"]);
const isShowFilterDropdown = ref(false);

// function
let isDisplayAll = true;
const setCheckedOptions = (options) => {
  if (options.includes("displayAll") && !isDisplayAll) {
    checkedOptions.value = ["displayAll"];
    isDisplayAll = true;
  } else {
    checkedOptions.value = options.filter((option) => {
      return option !== "displayAll";
    });
    isDisplayAll = false;
  }
};

const filterCards = () => {
  if (isDisplayAll || !checkedOptions.value.length) {
    isFiltered.value = false;
    toggleFilterDropdown();
    return;
  }

  const matchedTag = (tag) => {
    return checkedOptions.value.some((option) => option === tag);
  };
  filteredCards.value = storedCards.value.filter((card) => {
    return card.tags.some(matchedTag);
  });

  isFiltered.value = true;
  toggleFilterDropdown();
};

const toggleFilterDropdown = () => {
  isShowFilterDropdown.value = !isShowFilterDropdown.value;
};

export default function useFilter() {
  return {
    isFiltered: readonly(isFiltered),
    filteredCards: readonly(filteredCards),
    allOptions: readonly(allOptions),
    checkedOptions: readonly(checkedOptions),
    isShowFilterDropdown: readonly(isShowFilterDropdown),

    filterCards,
    setCheckedOptions,
    toggleFilterDropdown,
  };
}
