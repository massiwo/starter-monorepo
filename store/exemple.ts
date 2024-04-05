/**
 * Store Pinia pour la gestion des utilisateurs
 *
 * Ce fichier est un exemple de store Pinia en TypeScript pour gérer toutes les opérations CRUD
 * (Créer, Lire, Mettre à jour, Supprimer) sur les utilisateurs dans une application Nuxt.js.
 * Il fournit des fonctions pour interagir avec une API backend, permettant de charger, ajouter,
 * mettre à jour et supprimer des utilisateurs. Chaque action manipule l'état `users` qui
 * représente la liste actuelle des utilisateurs dans l'application.
 *
 * Utilisez ce store comme modèle pour gérer d'autres types de données dans votre application.
 *
 * Date : Novembre 2023
 * Pour plus d'informations, consultez la documentation https://pinia.vuejs.org/ssr/nuxt.html
 */

import { defineStore } from "pinia";
import { ref } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
  // Ajoutez d'autres champs selon vos besoins
}

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const isLoading = ref(false);

  // Charger les utilisateurs
  async function loadUsers() {
    isLoading.value = true;
    try {
      const response = await fetch("/api/users");
      users.value = await response.json();
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      isLoading.value = false;
    }
  }

  return { users, isLoading, loadUsers };
});

/** 
 * EXEMPLE D'UTILISATION DU LE STORE DANS UN COMPOSANT VUE
 * Ceci est un exemple à supprimer en phase de développement pour votre projet

<template>
  <div v-if="userStore.isLoading">Chargement...</div>
  <ul v-else>
    <li v-for="user in userStore.users" :key="user.id">
      {{ user.name }}
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useUserStore } from '@/store/exemple';

export default defineComponent({
  setup() {
    const userStore = useUserStore();
    userStore.loadUsers();

    return { userStore };
  },
});
</script>

*/
