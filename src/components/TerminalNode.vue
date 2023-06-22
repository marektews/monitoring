<script setup>
const props = defineProps(['name'])
</script>

<template>
    <div class="card">
        <div class="card-body">
            <div class="terminal-name">{{ name }}</div>
            <div class="terminal-body">
                <slot />
            </div>
        </div>
    </div>
</template>

<style scoped>
.terminal-name {
    font-size: 18pt;
    margin-bottom: 9pt;
}
.terminal-body {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 20pt;
}
</style>