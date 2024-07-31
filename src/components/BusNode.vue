<template>
    <div class="bus-container">
        <StatusLed :status="props.state?.status"/>
        <div>{{ props.rja?.ident }} - {{ props.rja?.name }} {{ props.rja?.lp }}</div>
    </div>
</template>


<script setup>
import StatusLed from './StatusLed.vue'
const props = defineProps(['rja', 'state'])
</script>


<style scoped>
.bus-container {
    font-size: 10pt;
    display: flex;
    flex-direction: row;
    gap: 4pt;
    align-items: center;
}
</style>