<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created(){
    window.onload = function () {
      document.addEventListener("touchstart", function (event) {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      });
      document.addEventListener("gesturestart", function (event) {
        event.preventDefault();
      });
    };
  }
}
</script>

<style>
</style>
