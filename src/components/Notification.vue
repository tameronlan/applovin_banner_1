<template>
  <div class="app-notify" @click="$emit('openStore')">
    <div class="app-notify__icon">
      <noty-heart-icon/>
    </div>
    <div class="app-notify__text">
      {{noty.text}}
    </div>
    <div class="app-notify__btn">
      {{$t("yes").toUpperCase()}}
    </div>
    <div class="app-notify__pointer">
      <cursor-icon/>
    </div>
  </div>
</template>

<script>
import NotyHeartIcon from "@/assets/svg/noty_heart.svg";
import CursorIcon from "@/assets/svg/cursor.svg";

export default {
  name: "Notification",
  props: ["noty"],
  components: {NotyHeartIcon, CursorIcon}
}
</script>