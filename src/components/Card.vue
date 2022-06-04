<template>
  <div class="feed-card" :class="classes">
    <div class="feed-card__avatar_cover">
      <div class="feed-card__avatar_blured" :style="{backgroundImage: `url(${user.avatar})`}"></div>
    </div>

    <div class="feed-card__avatar" :style="{backgroundImage: `url(${user.avatar})`}"></div>
    <div class="feed-card__more"><more-icon/></div>
    <div class="feed-card__photos"><photo-icon/>{{user.photos}}</div>

    <div class="feed-card-scroller">
      <div class="feed-card-scroller__line"></div>
      <div class="feed-card-scroller__pointer"></div>
    </div>

    <div class="feed-card__info">
      {{user.name}}, {{user.age}}<div class="feed-card__online"></div>
    </div>

    <div
        class="feed-card__action feed-card__action_like"
        v-touch
        @click="$emit('likeAction', index)"
    ><like-icon/></div>
    <div
        class="feed-card__action feed-card__action_dislike"
        v-touch
        @click="$emit('dislikeAction', index)"
    ><dislike-icon/></div>
    <div class="feed-card-tutorial__pointer"><cursor-icon/></div>
  </div>
</template>

<script>
import LikeIcon from "@/assets/svg/like.svg";
import DislikeIcon from "@/assets/svg/dislike.svg";
import MoreIcon from "@/assets/svg/more.svg";
import PhotoIcon from "@/assets/svg/photo.svg";
import CursorIcon from "@/assets/svg/cursor.svg";

export default {
  name: "Card",
  props: ["user", "index", "state", "tutorOn"],
  components: {
    LikeIcon,
    DislikeIcon,
    MoreIcon,
    PhotoIcon,
    CursorIcon
  },
  computed: {
    classes(){
      let classes = [];

      classes.push(`feed-card_${this.state}`)

      if (this.state === "current" && this.tutorOn){
        classes.push("feed-card_tutor")
      }

      return classes
    }
  }
}
</script>