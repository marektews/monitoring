<script setup>
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
 import { faRoute, faBus, faPaperPlane, faSquareParking, faCircleQuestion, faArrowRightRotate, faBell } from '@fortawesome/free-solid-svg-icons';

const props = defineProps(['status'])

const status_color_class = computed(() => {
    switch(props.status) {
        case 'no-bus': return "text-secondary"
        case 'in-buffer': return "text-primary"
        case 'second-circle': return "text-warning"
        case 'send-to-sector': return "text-success"
        case 'on-sector': return "text-danger"
        case 'ready-to-leave': return "text-warning"
        case 'on-the-road': return "text-success"
    }
    return "text-secondary"
})

const status_icon = computed(() => {
    switch(props.status) {
        case 'no-bus': return faCircleQuestion
        case 'in-buffer': return faBus
        case 'second-circle': return faArrowRightRotate
        case 'send-to-sector': return faPaperPlane
        case 'on-sector': return faSquareParking
        case 'ready-to-leave': return faBell
        case 'on-the-road': return faRoute
    }
    return faCircleQuestion
})
</script>

<template>
    <div :class="status_color_class" class="sl-cnt">
        <FontAwesomeIcon :icon="status_icon" />
    </div>
</template>

<style scoped>
.sl-cnt {
    min-width: 17px;
}
/* .no-bus::before {
    font: var(--fa-font-regular);
    /* content: "\f059"; * /
    /* content: "\e4e3"; * /
}

.in-buffer:before {
    font: var(--fa-font-solid);
    content: "\f207";
}

.second-circle:before {
    font: var(--fa-font-solid);
    content: "\f01e";
}

.send-to-sector:before {
    font: var(--fa-font-solid);
    content: "\f1d8";
}

.on-sector:before {
    font: var(--fa-font-solid);
    content: "\f540";
}

.on-the-road:before {
    font: var(--fa-font-solid);
    content: "\f4d7";
} */

</style>