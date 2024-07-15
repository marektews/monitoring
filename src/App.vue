<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import SoaView from './views/SoaView.vue'
</script>

<template>
    <header>
        <FontAwesomeIcon :icon="faWaveSquare" :shake="true" />
        <div>Monitoring</div>
    </header>
    <main>
        <SoaView />
    </main>
</template>

<style scoped>
header {
    padding-left: 6pt;
    font-size: 20pt;
    display: flex;
    align-items: center;
    gap: 9pt;
}
</style>
