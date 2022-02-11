<template>
  <section class="create-card">
    <create-card-form />
  </section>
</template>

<script>
import CreateCardForm from "@/components/CreateCardForm";

export default { components: { CreateCardForm } };
</script>

<style scoped lang="scss">
.create-card {
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 13rem);
  // 13rem = 10(margin-top) + 3(page移動時のアニメーション translateY)

  margin-top: 10rem;
  margin-bottom: var(--space-28);
  background-image: url("../assets/image/undraw_Through_the_desert_re_1q2x.svg");
  background-size: 30rem;
  background-repeat: no-repeat;
  background-position: right bottom;

  @include respond(phone) {
    background-position: center bottom;
  }
}
</style>
