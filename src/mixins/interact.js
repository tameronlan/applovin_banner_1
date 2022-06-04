import interact from 'interactjs';

export default {
    data() {
        let windowWidth = window !== undefined ? window.outerWidth : 500;

        return {
            interactAnimating: true,
            interactDragged: null,
            interactMaxRotation: 0,
            interactLockXAxis: false,
            interactLockYAxis: false,
            interactLockSwipeLeft: false,
            interactPosition: {
                x: 0,
                y: 0,
                rotation: 0,
            },
            interactOutOfSightXCoordinate: windowWidth ,
            interactOutOfSightYCoordinate: 600,
            interactYThreshold: 150,
            interactXThreshold: 100,
        };
    },

    computed: {
        transformString() {
            if (!this.interactAnimating || this.interactDragged) {
                const { x, y, rotation } = this.interactPosition;

                return `translate3D(${x}px, ${y}px, 0) rotate(${rotation}deg)`;
            }

            return null;
        },
    },

    mounted() {
        const element = this.$refs.interactElement;

        interact(element).draggable({
            ignoreFrom: 'button, .ignore-form',

            onstart: () => {
                this.interactAnimating = false;
            },

            onmove: (event) => {
                let x = 0;

                const shouldPreventSwipeLeft = (
                    this.interactLockSwipeLeft &&
                    this.interactPosition.x <= 0 &&
                    event.dx < 0
                );

                if (shouldPreventSwipeLeft) x = 0;
                else x = this.interactLockXAxis ? 0 : (this.interactPosition.x || 0) + event.dx;

                const y = this.interactLockYAxis ? 0 : (this.interactPosition.y || 0) + event.dy;
                // const y = 0;

                let rotation = this.interactMaxRotation * (x / this.interactXThreshold);

                if (rotation > this.interactMaxRotation) rotation = this.interactMaxRotation;
                else if (rotation < -this.interactMaxRotation) rotation = -this.interactMaxRotation;

                this.interactSetPosition({ x, y, rotation }, true);
            },

            onend: () => {
                const { x, y } = this.interactPosition;
                const { interactXThreshold } = this;
                this.interactAnimating = true;

                if (x > interactXThreshold) {
                    this.draggedRight();
                } else if (x < -interactXThreshold) {
                    this.draggedLeft();
                } else {
                    this.interactSetPosition({ x: 0, y: 0, rotation: 0 });
                }
            },
        });
    },

    methods: {
        draggedRight() {},
        draggedLeft() {},
        interactSetPosition(coordinates, isDragging = false) {
            const { x, y, rotation } = coordinates;

            if (Number.isFinite(x)) this.interactPosition.x = x;
            if (Number.isFinite(y)) this.interactPosition.y = y;
            if (Number.isFinite(rotation)) this.interactPosition.rotation = rotation;

            this.$emit('drag', {
                ...this.interactPosition,
                isDragging,
            });
        },
        interactUnsetElement() {
            interact(this.$refs.interactElement).unset();

            this.interactDragged = true;
        },
    },
};

