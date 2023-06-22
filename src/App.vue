<script setup>
import SOA from './views/SOA.vue'
</script>

<template>
    <header>
        <i class="fa-solid fa-wave-square fa-shake" />
        <div>Monitor</div>
    </header>
    <main>
        <SOA />
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
