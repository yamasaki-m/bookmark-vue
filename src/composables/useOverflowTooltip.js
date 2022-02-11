// overflow:hiddenを無視して表示したいツールチップはjsで制御
const showTooltip = (target) => {
  const x = target.getBoundingClientRect().left + window.pageXOffset;
  const y = target.getBoundingClientRect().top + window.pageYOffset;
  const width = target.offsetWidth;
  const text = target.attributes.text.value;

  const tooltip = document.querySelector(".tooltip-text--overflow");
  tooltip.style.visibility = "visible";
  tooltip.style.opacity = 1;
  tooltip.style.left = x + width / 2 + "px";
  tooltip.style.top = y - 11 + "px";
  tooltip.textContent = text;
};

const hideTooltip = () => {
  const tooltip = document.querySelector(".tooltip-text--overflow");
  tooltip.style.visibility = "hidden";
  tooltip.style.opacity = 0;
};

export default function useOverflowTooltip() {
  return { showTooltip, hideTooltip };
}
