<template>
    <div class="app__loader">
        <loader/>
        <div class="app__loader-title">
            {{$t('loading_dots')}}
        </div>
    </div>
</template>

<script>
    import Loader from './common/Loader';
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "start",
        components: {Loader},
        computed: {
        },
        data() {
            return { isLoading: true }
        },
    }
</script>
