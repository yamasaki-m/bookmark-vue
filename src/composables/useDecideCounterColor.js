import { computed } from "vue";

const decideCounterColor = (counters) => {
  counters.forEach((counter) => {
    const count = counter.textContent;
    const color = computed(() => {
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
    });

    counter.style.backgroundColor = color.value;
  });
};

export default function useDecideCounterColor() {
  return { decideCounterColor };
}

// if (count >= 10) {
//   counter.classList = baseClass + "red";
// } else if (count >= 5) {
//   counter.classList = baseClass + "yellow";
// } else if (count >= 3) {
//   counter.classList = baseClass + "green";
// } else if (count >= 1) {
//   counter.classList = baseClass + "blue";
// } else {
//   counter.classList = "link-list__counter";
// }

// if (count <= 0) {
//   counter.classList = "link-list__counter";
// } else if (count <= 2) {
//   counter.classList = baseClass + "blue";
// } else if (count <= 4) {
//   counter.classList = baseClass + "green";
// } else if (count <= 9) {
//   counter.classList = baseClass + "yellow";
// } else {
//   counter.classList = baseClass + "red";
// }
