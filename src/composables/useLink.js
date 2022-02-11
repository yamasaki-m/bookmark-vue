import useCard from "@/composables/useCard";

import { ref, readonly } from "vue";

const { updateLinks, updateSingleLink, updateClickCount } = useCard();

const editTargetLink = ref(null);

const addLink = async ({ newLink, currentLinks, cardIndex }) => {
  const newLinks = [...currentLinks, newLink];
  updateLinks({ newLinks, cardIndex });
};

const deleteLink = async ({ targetLink, currentLinks, cardIndex }) => {
  const newLinks = currentLinks.filter((link) => link.id !== targetLink.id);
  updateLinks({ newLinks, cardIndex });
};

const editLink = async ({ newLink, linkIndex, cardIndex }) => {
  console.log({ newLink, linkIndex, cardIndex });
  updateSingleLink({ newLink, linkIndex, cardIndex });
};

const openLink = (url) => {
  window.open(url, "_blank");
};

const setEditTargetLink = (link) => {
  editTargetLink.value = link;
};

const incrementCount = ({ currentCount, linkIndex, cardIndex }) => {
  const newCount = ++currentCount;

  updateClickCount({ newCount, linkIndex, cardIndex });
};

const setCounterColor = (counters) => {
  counters.forEach((counter) => {
    const count = counter.textContent;

    const color = () => {
      if (count >= 10) {
        return "var(--color-red)";
      } else if (count >= 5) {
        return "var(--color-yellow)";
      } else if (count >= 3) {
        return "var(--color-green)";
      } else if (count >= 1) {
        return "var(--color-blue)";
      } else {
        return "var(--color-gray-300)";
      }
    };
    counter.style.backgroundColor = color();
  });
};

export default function useLink() {
  return {
    editTargetLink: readonly(editTargetLink),

    addLink,
    deleteLink,
    editLink,
    openLink,
    setEditTargetLink,
    incrementCount,
    setCounterColor,
  };
}
