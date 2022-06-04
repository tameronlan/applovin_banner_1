<template>
    <div class="popups">
        <popup v-for="popup in popups" :popup="popup" :key="popup.id"></popup>
    </div>
</template>

<script>
    import Popup from './Popup';

    export default {
        name: 'Popups',
        components: { Popup },
        data() {
            return {};
        },
        computed: {
            popups() {
                return this.$store.state.popups.popups;
            }
        }
    };
</script>
