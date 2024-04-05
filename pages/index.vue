<template>
  <div class="flex flex-rows align-middle justify-center h-screen">
    <!-- ===== Home Start ===== -->
    <div class="left-wrapper flex flex-col justify-center align-middle p-15">
      <div class="text-wrapper flex flex-col text-right align-bottom justify-end">
        <h1 class="title font-bold text-9xl block uppercase text-secondary">
          Starter de <br>
          Projet Web
        </h1>
        <p class="text-l font-bold uppercase mr-2">RATP Infrastructure / MSI / PSM</p>
      </div>
    </div>
    <div class="right-wrapper h-full w-full bg-primary flex justify-center align-middle">
      <div class="image flex w-full max-w-6xl">
        <IllustrationDemo />
      </div>
    </div>
    <div class="credits absolute z-99999 left-0 ml-2 p-3 flex align-middle">
      <div class="align-bottom justify-end">
        <span class="tag font-bold mr-2">Avril 2024</span>
        <span class="tag inline-block font-bold py-1 px-3 bg-primary text-white rounded-full text-center">
          {{ version }}
        </span>
        <p class="tag opacity-20 hover:opacity-100 text-primary">
          <a href="#" title="massimo.bayle@ratp.fr">by Massimo Bayle</a>
        </p>
      </div>
    </div>
    <div class="credits absolute z-99999 left-0 bottom-0 ml-2 p-3 flex align-middle">
      <div class="image vue-logo mr-6">
        <VueIconDemo />
      </div>
      <div class="image nuxt-logo mr-6">
        <NuxtIconDemo />
      </div>
    </div>
    <!-- ===== Home End ===== -->
  </div>
</template>

<script setup>
import IllustrationDemo from '~/components/Illustration-Demo.vue';
import VueIconDemo from '~/components/Vue-Icon-Demo.vue';
import NuxtIconDemo from '~/components/Nuxt-Icon-Demo.vue';
import { version } from "~/package.json"
</script>

<style lang="css">
@keyframes fadeIn {
  0% {
    top: 24px;
    opacity: 0;
  }

  100% {
    top: 0;
    opacity: 100%;
  }
}

.left-wrapper,
.right-wrapper {
  width: 50%;
}

.title {
  position: relative;

}
.text-wrapper {
  animation: fadeIn 2s forwards 1s ease-out;
  position: relative;
  top: 24px;
  opacity: 0;
}

.credits .image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.credits .image svg {
  height: 32px;
  width: auto;
}
</style>
