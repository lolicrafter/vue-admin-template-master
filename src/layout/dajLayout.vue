<template>
  <div class="app-wrapper">
    <div class="dj-container">
      <Header />
      <app-main />
    </div>
  </div>
</template>

<script>
import { Header, AppMain } from './components'

export default {
  name: 'DajLayout',
  components: {
    Header,
    AppMain
  },
  mixins: [],
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;

}

</style>
