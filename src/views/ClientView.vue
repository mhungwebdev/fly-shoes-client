<template>
  <div class="client-view-container pos-relative w-100pc">
    <TheHeaderClientVue
      class="pt-20 pb-20 mt-20 mb-20 header"
    ></TheHeaderClientVue>
    <div class="content mb-80">
      <RouterView></RouterView>
    </div>
    <TheFooter></TheFooter>
  </div>
</template>

<script setup lang="ts">
import { databaseRealTime } from "@/firebase";
import TheFooter from "@/layouts/TheFooter.vue";
import TheHeaderClientVue from "@/layouts/TheHeaderClient.vue";
import type { Notification } from "@/models";
import { useUserStore } from "@/stores";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { onUnmounted } from "vue";

const userStore = useUserStore();

const q = query(
  collection(databaseRealTime, "notification"),
  where("UserID", "==", userStore.currentUser ? userStore.currentUser.UserID : 0)
);
const unsubscribe = onSnapshot(q, (querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc);
    const notification: Notification = doc.data() as Notification;
    notification.ID = doc.id;
    if (userStore.notifications.find((n) => n.ID == doc.id) == undefined) {
      userStore.notifications.unshift(notification);
    }
  });
});

onUnmounted(() => {
    unsubscribe();
})
</script>

<style lang="scss" scoped>
.client-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;;

  .header {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: white;
    width: 100%;
    padding-left: calc(50% - 600px);
    padding-right: calc(50% - 600px);
  }

  .content {
    width: 1200px;
  }
}
</style>
