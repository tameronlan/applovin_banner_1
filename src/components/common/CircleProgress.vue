<template>
    <svg
            :width="diameter"
            :height="diameter"
            :viewBox="`0 0 ${diameter} ${diameter}`"
            :style="{transform: `rotate(${anglePosition}deg)`}"
            :class="wrapperClass"
    >
        <circle
                :stroke-width="strokeWidth"
                :stroke="strokeFillBg"
                :r="r"
                :cx="center"
                :cy="center"
                :fill="circleFill"
        ></circle>
        <circle
                :stroke-width="strokeWidth"
                :stroke="strokeFill"
                :r="r"
                :cx="center"
                :cy="center"
                fill="rgba(0,0,0,0)"
                :style="{
                    strokeDasharray: dashData.array,
                    strokeDashoffset: dashData.offset,
                    transition: transitionCircleLineStyle
                }"
        ></circle>
    </svg>
</template>

<script>
    export default {
        name: "circle-progress",
        props: {
            diameter: {
                required: false,
                default : 60
            },
            percent: {
                type: Number,
                required: false,
                default : 0
            },
            strokeWidth: {
                required: false,
                default : 6
            },
            strokeFill: {
                type: String,
                required: false,
                default : 'rgba(0,0,0,1)'
            },
            strokeFillBg: {
                type: String,
                required: false,
                default : 'rgba(0,0,0,.1)'
            },
            circleFill: {
                type: String,
                required: false,
                default : 'rgba(0,0,0,0)'
            },
            anglePosition: {
                type: Number,
                required: false,
                default : -90
            },
            transitionCircleLineStyle: {
                type: String,
                default: 'all .05s linear'
            },
            wrapperClass: {
                type: String,
                required: false,
            }
        },
        data (){
            return {
                currentPercent: 0,
                center: 30,
                r: 27,
                dashArray: 0,
                dashOffset: 0,
            }
        },
        computed: {
            dashData(){
                this.dashArray = 2 * this.r * Math.PI;
                this.dashOffset = this.dashArray - ( this.dashArray * this.currentPercent / 100 );

                return {
                    array: this.dashArray,
                    offset: this.dashOffset,
                }
            }
        },
        created(){
            if (this.percent !== undefined) this.currentPercent = this.percent;

            this.center = this.diameter / 2;
            this.r = this.center - this.strokeWidth / 2;
        },
        watch:{
            percent(newVal){
                this.updatePercent(newVal);
            }
        },
        methods: {
            updatePercent(percent){
                if(
                    percent !== undefined
                    && percent >= 0
                    && percent <= 100
                ){
                    this.currentPercent = percent;
                }
            }
        }
    }
</script>

<style scoped>

</style>
