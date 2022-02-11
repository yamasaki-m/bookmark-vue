import { ref, readonly } from "vue";

const deviceType = ref(null);

const checkDeviceType = () => {
  const tablet = "(max-width: 73.75em)";
  const phone = "(max-width: 47.5em)";

  deviceType.value = null;

  if (matchMedia(phone).matches) {
    deviceType.value = "phone";
  } else if (matchMedia(tablet).matches) {
    deviceType.value = "tablet";
  } else {
    deviceType.value = "desktop";
  }
};

export default function useCheckDeviceType() {
  return {
    deviceType: readonly(deviceType),
    checkDeviceType,
  };
}
