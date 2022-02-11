// import { useRoute } from "vue-router";
// import { useStore } from "vuex";
import { onMounted, onUnmounted } from "vue";

export default function useHideOnScroll(target) {
  // const route = useRoute();
  // const store = useStore();
  // const isDraggable = computed(() => store.getters.isDraggable);

  onMounted(() => {
    window.addEventListener("scroll", onScrollHandler);
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", onScrollHandler);
  });

  // onScrollHandler
  let isRunning = false;
  const onScrollHandler = () => {
    if (!isRunning) {
      requestAnimationFrame(hideOnScroll);
    }
    isRunning = true;
  };

  // hideOnScroll
  let prevPosition = window.pageYOffset;
  const hideOnScroll = () => {
    const currentPosition = window.pageYOffset;
    if (prevPosition > currentPosition) {
      // if (prevPosition > currentPosition && !isDraggable.value) {
      target.value.classList.remove("hide");
    } else {
      target.value.classList.add("hide");
    }
    prevPosition = currentPosition;
    isRunning = false;
  };

  // watch(
  //   () => [route.name, isDraggable.value],
  //   ([newRouteName, newIsDraggable]) => {
  //     if (!newIsDraggable) {
  //       target.value.classList.remove("hide");
  //     } else {
  //       console.log(newRouteName);
  //       target.value.classList.add("hide");
  //     }
  //   }
  // );
}
