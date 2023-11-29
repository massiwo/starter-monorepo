<template>
  <div class="container">
    <h1 class="title">Bienvenue sur le Template de projet Web</h1>
    <UnExemple class="text"></UnExemple>
  </div>
</template>

<style lang="scss">
@keyframes fade-up {
  0% {
    top: 10px;
    opacity: 0;
  }

  100% {
    top: 0;
    opacity: 1;
  }
}

.container {
  margin: auto;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1.title {
    position: relative;
    top: 10px;
    opacity: 0;
    font-family: BebasNeue, Helvetica, Arial, Verdana, Tahoma, sans-serif;
    display: block;
    font-size: 4em;
    text-align: center;
    animation: fade-up 1.2s forwards 1s;
  }

  .text {
    position: relative;
    animation: fade-up 1.2s forwards 1.3s;
    top: 10px;
    opacity: 0;
  }
}
</style>
