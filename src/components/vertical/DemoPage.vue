<template>
  <div class="demo ">
    <p class="mx-auto"> Hii </p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.demo > p {
    align-content: center;
}
    
@media only screen and (orientation: portrait) {
    .demo {
        background-color: yellow;
        font-size: 200px;
        height: 100dvh;
        width: 100dvw;
        color: white;
    }
}

@media only screen and (orientation: landscape) {
    .demo {
        background-color: red;
        font-size: 200px;
        height: 100dvh;
        width: 100dvw;
        color: white;
    }
}

</style>