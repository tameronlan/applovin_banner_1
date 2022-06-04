<template>
    <div :class="loaderClass"></div>
</template>

<script>
    export default {
        name: 'Loader',
        props: ['small','extra-small'],
        computed: {
            loaderClass() {
                const classes = { 'loader-circle': true };

                if (this.small) {
                    classes['loader-circle_small'] = true;
                }

                if (this.extraSmall) {
                    classes['loader-circle_extra-small'] = true;
                }

                return classes;
            }
        }
    };
</script>
