import { onMounted, onBeforeUnmount } from "vue";

export default function useClickOutside(selector, isShow, callback) {
  const clickOutside = (event) => {
    event.stopPropagation();

    const isOutside = !event.target.closest(selector);

    isOutside && isShow.value && callback();
  };

  onMounted(() => {
    window.addEventListener("click", clickOutside);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("click", clickOutside);
  });

  return { clickOutside };
}
