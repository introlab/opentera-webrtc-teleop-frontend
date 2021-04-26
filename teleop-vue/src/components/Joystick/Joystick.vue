<template>
    <canvas ref="canvas" v-bind:width="width" v-bind:height="height"
        v-on:mousedown="onMouseDown" v-on:mouseup="onMouseUp"
        v-on:mousemove="onMouseMove" v-on:mouseout="onMouseOut"/>
</template>

<script>
export default {
    name: "joystick",
    data() {
        return {
            x: null,
            y: null,
            loopIntervalId: null,
            positionChangeIntervalId: null,
            canvas: null,
            context: null,
            isMouseDown: false
        }
    },
    props: ["width", "height", "absoluteMaxX", "absoluteMaxY"],
    emits: [
        "joystickPositionChange"
    ],
    methods: {
        init() {
            this.loopIntervalId = setInterval(function() {
                this.initVariables();
                this.drawFrame();
            }.bind(this), 1000 / 60); // 60 Hz

            this.positionChangeIntervalId = setInterval(function() {
                this.emitJoystickPosition();
            }.bind(this), 100) // 100 ms
        },
        initVariables() {
            if (this.c === null || this.y === null || !this.isMouseDown) {
                this.x = this.getCenterX();
                this.y = this.getCenterY();
            }
        },
        onMouseDown(event) {
            if (event.button === 0) {
                this.updateJoystickPositionFromMouseEvent(event);
                this.isMouseDown = true;
            }
        },
        onMouseUp(event) {
            if (event.button === 0) {
                this.x = this.getCenterX();
                this.y = this.getCenterY();
                this.isMouseDown = false;
                this.emitJoystickPosition();
            }
        },
        onMouseMove(event) {
            if (this.isMouseDown) {
                this.updateJoystickPositionFromMouseEvent(event);
            }
        },
        onMouseOut(event) {
            this.x = this.getCenterX();
            this.y = this.getCenterY();
            this.isMouseDown = false;
            this.emitJoystickPosition();
        },
        updateJoystickPositionFromMouseEvent(event) {
            const rect = this.canvas.getBoundingClientRect();      
            this.x = event.clientX - rect.left;
            this.y = event.clientY - rect.top;

            const centerX = this.getCenterX();
            const centerY = this.getCenterY();  
            const deltaX = this.x - centerX;
            const deltaY = this.y - centerY;
            const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const maxRadius = this.getCanvasRadius() - this.getJoystickRadius();

            if (radius > maxRadius)
            {
                const ratio = maxRadius / radius;
                this.x = deltaX * ratio + centerX;
                this.y = deltaY * ratio + centerY;
            }
            this.emitJoystickPosition();
        },
        drawFrame() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawBackground();
            this.drawJoystick();
        },
        drawJoystick() {
            if (this.isMouseDown) {
                this.context.fillStyle = 'rgba(0, 0, 0, 0.75)';
            }
            else {
                this.context.fillStyle = '#000000';
            }

            this.context.beginPath();
            this.context.arc(this.x, this.y, this.getJoystickRadius(), 0, 2 * Math.PI);
            this.context.fill();
        },
        drawBackground() {
            const centerX = this.getCenterX();
            const centerY = this.getCenterY();

            const radius = this.getCanvasRadius();

            //Draw the background circle
            this.context.fillStyle = '#87CEEB';
            this.context.beginPath();
            this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            this.context.fill();
            
            const pointOffset = radius / 8;
            const halfPointOffset = pointOffset / 2;

            //draw center cross
            this.context.lineWidth = 2;
            this.context.strokeStyle = '#4682B4';
            this.context.beginPath();
            this.context.moveTo(centerX, centerY - pointOffset);
            this.context.lineTo(centerX, centerY + pointOffset);
            this.context.stroke();
            this.context.beginPath();
            this.context.moveTo(centerX - pointOffset, centerY);
            this.context.lineTo(centerX+ pointOffset, centerY);
            this.context.stroke();

            //draw the up triangle
            const upTriangleStartY = centerY - 3 * radius / 4;

            this.context.fillStyle = '#4682B4';
            this.context.beginPath();
            this.context.moveTo(centerX, upTriangleStartY);
            this.context.lineTo(centerX - halfPointOffset, upTriangleStartY + pointOffset);
            this.context.lineTo(centerX + halfPointOffset, upTriangleStartY + pointOffset);
            this.context.fill();

            //draw the down triangle
            const downTriangleStartY = centerY + 3 * radius / 4;

            this.context.beginPath();
            this.context.moveTo(centerX, downTriangleStartY);
            this.context.lineTo(centerX - halfPointOffset, downTriangleStartY - pointOffset);
            this.context.lineTo(centerX + halfPointOffset, downTriangleStartY - pointOffset);
            this.context.fill();

            //draw the left triangle
            const leftTriangleStartX = centerX - 3 * radius / 4;

            this.context.beginPath();
            this.context.moveTo(leftTriangleStartX, centerY);
            this.context.lineTo(leftTriangleStartX + pointOffset, centerY - halfPointOffset);
            this.context.lineTo(leftTriangleStartX + pointOffset, centerY + halfPointOffset);
            this.context.fill();

            //draw the right triangle
            const rightTriangleStartX = centerX + 3 * radius / 4;
            
            this.context.beginPath();
            this.context.moveTo(rightTriangleStartX, centerY);
            this.context.lineTo(rightTriangleStartX - pointOffset, centerY - halfPointOffset);
            this.context.lineTo(rightTriangleStartX - pointOffset, centerY + halfPointOffset);
            this.context.fill();
        },
        emitJoystickPosition() {
            const event = {
                x: (this.x - this.getCenterX()) * this.absoluteMaxX / (this.getCanvasRadius() - this.getJoystickRadius()),
                y: (this.y - this.getCenterY()) * this.absoluteMaxY / (this.getCanvasRadius() - this.getJoystickRadius()),
            };
            this.$emit("joystickPositionChange", event)
        },
        getCenterX() {
            return this.canvas.width / 2;
        },
        getCenterY() {
            return this.canvas.width / 2;
        },
        getCanvasRadius() {
            return Math.min(this.canvas.width, this.canvas.height) / 2;
        },
        getJoystickRadius() {
            return this.getCanvasRadius() / 4;
        }
    },
    mounted() {
        this.canvas = this.$refs.canvas;
        this.context = this.canvas.getContext("2d");
        this.init();
    },
    unmounted() {
        clearInterval(this.loopIntervalId);
        clearInterval(this.positionChangeIntervalId);
    }
}
</script>

<style>

</style>