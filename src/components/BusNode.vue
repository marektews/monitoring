<script setup>
import StatusLed from './StatusLed.vue'
const props = defineProps(['rja', 'state'])
</script>

<template>
    <div class="bus-container">
        <StatusLed :status="props.state?.status"/>
        <div>{{ props.rja?.ident }} - {{ props.rja?.name }}</div>
    </div>
</template>

<style scoped>
.bus-container {
    font-size: 10pt;
    display: flex;
    flex-direction: row;
    gap: 4pt;
    align-items: center;
}
</style>