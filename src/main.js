import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store from "./store/index";

import BaseCard from "./components/UI/BaseCard.vue";
import BaseDialog from "./components/UI/BaseDialog.vue";
import BaseSpinner from "./components/UI/BaseSpinner.vue";
import BaseDropdown from "./components/UI/BaseDropdown.vue";
import BaseForm from "./components/UI/BaseForm.vue";
import BaseInput from "./components/UI/BaseInput.vue";
import BaseLabel from "./components/UI/BaseLabel.vue";
import BaseModalForm from "./components/UI/BaseModalForm.vue";
import BaseButton from "./components/UI/BaseButton.vue";
import BaseToolTip from "./components/UI/BaseToolTip.vue";
import BaseIcon from "./components/UI/BaseIcon.vue";

import "./dnd-polyfill";

// 共通SCSS
require("./assets/scss/main.scss");

const app = createApp(App);

app.use(router);
app.use(store);

app.component("base-card", BaseCard);
app.component("base-dialog", BaseDialog);
app.component("base-spinner", BaseSpinner);
app.component("base-form", BaseForm);
app.component("base-input", BaseInput);
app.component("base-label", BaseLabel);
app.component("base-modal-form", BaseModalForm);
app.component("base-dropdown", BaseDropdown);
app.component("base-button", BaseButton);
app.component("base-tooltip", BaseToolTip);
app.component("base-icon", BaseIcon);

app.mount("#app");
