<template>
    <div class="app">
      <div class="feed__title">
        {{ $t("feed_title") }}
      </div>

      <template v-if="notification.text && notification.text.length">
        <notification
          :noty="notification"
          @openStore="openStore"
        />
      </template>

      <div class="feed__cards" :class="currentIndex">
        <card
            v-for="(user, index) in users"
            :index="index"
            :user="user"
            :state="states[index]"
            :key="user.id"
            :tutorOn="!(notification.text && notification.text.length) && tutorOn"
            @likeAction="likeAction"
            @dislikeAction="dislikeAction"
        ></card>
      </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex';
    import FilterIcon from "@/assets/svg/filter.svg";
    import Card from "@/components/Card";
    import Notification from "@/components/Notification";
    import {androidLinkSM, iosLinkSM} from "@/settings/sm/links";
    import {androidLinkEM, iosLinkEM} from "@/settings/em/links";
    import {androidLinkIH, iosLinkIH} from "@/settings/ih/links";
    import {usersData} from "@/store/v3/users";

    export default {
        name: 'app',
        components: {
          Notification,
          Card,
          FilterIcon
        },
        data(){
            return {
              currentIndex: 0,
              states: [],
              notification: {},
              tutorOn: true
            }
        },
        created() {
            this.setUsers(usersData.reverse())

            this.currentIndex = this.users.length - 1

            this.updateStates()
        },
        computed: {
            ...mapState(["users"]),
            styleForPointer(){
                return {
                  top: 0,
                  left: 0,
                  transform: `translate(0, 0) rotate(0deg)`
                }
            }
        },
        methods: {
            ...mapMutations(["setUsers", "updateUser"]),
            updateStates(){
                let users = this.users

                users.forEach((user, index) => {
                  this.states[index] = this.stateForCard(index)
                })
            },
            stateForCard(cardIndex){
                  let state = ""

                  if (this.currentIndex < cardIndex) {
                      state = this.states[cardIndex]
                  } else if (this.currentIndex === cardIndex) {
                      state = "current"
                  } else {
                      state = "future"
                  }

                  return state
              },
              likeAction(index){
                  this.doAction(index, true)
              },
              dislikeAction(index){
                  this.doAction(index, false)
              },
              doAction(index, isLike){
                  this.states[index] = isLike ? "liked" : "disliked"

                  if (isLike) {
                    this.tutorOn = false

                    setTimeout(()=> {
                      this.showNotification('mutual', this.users[index])
                    }, 1000 + 1000 * Math.random())
                  }

                  if (this.currentIndex - 1 >= 0){
                    this.currentIndex = this.currentIndex - 1
                  } else {
                    if (!isLike) {
                      this.tutorOn = false

                      setTimeout(()=> {
                        this.showNotification('like', this.users[index])
                      }, 500 + 1000 * Math.random())
                    }
                  }

                  this.updateStates()
              },
              showNotification(type, user){
                if (this.notification.text) {
                  return;
                }

                this.notification = {
                  text: this.$t(type === 'like' ? 'woman_like' : 'woman_mutual_like', {name: user.name })
                }
              },
              openStore(){
                let androidLink, iosLink;

                if (process.env.VUE_APP_NAME === "sm"){
                    androidLink = androidLinkSM;
                    iosLink = iosLinkSM;
                } else if (process.env.VUE_APP_NAME === "ih") {
                    androidLink = androidLinkIH;
                    iosLink = iosLinkIH;
                } else if (process.env.VUE_APP_NAME === "em") {
                    androidLink = androidLinkEM;
                    iosLink = iosLinkEM;
                }

                let url = /android/i.test(navigator.userAgent) ? androidLink : iosLink;

                if (window.mraid){
                  mraid.open(url);
                } else {
                  this.$toasted.show(`MRAD is not initialized::${url}`)
                }
              }
        }
    };
</script>
