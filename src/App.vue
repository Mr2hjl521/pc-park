<template>
  <div id="app">
    <keep-alive>
    <router-view  v-show="$route.meta.keepAlive"/>
    </keep-alive>

    <router-view  v-if="isRouterAlive"/>
    <Tabbar v-show="$route.meta.showFooter"></Tabbar>
  </div>
</template>
<script>
export default {
  name: 'app',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>