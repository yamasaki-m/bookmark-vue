<template>
  <section class="user-auth">
    <user-auth-form />
  </section>
</template>

<script>
import UserAuthForm from "@/components/UserAuthForm";

export default { components: { UserAuthForm } };
</script>

<style scoped lang="scss">
.user-auth {
  position: relative;
  min-height: calc(100vh - 3rem);
  // 3rem = page移動時のアニメーション(translateY)

  background-image: url("../assets/image/undraw_Login_re_4vu2.svg");
  background-repeat: no-repeat;
  background-size: 30rem;
  background-position: right bottom;

  @include respond(phone) {
    background-position: center bottom;
  }
}
</style>
