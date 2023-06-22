<script setup>
defineProps(['name'])
</script>

<template>
    <div>
        <div class="sector-header">
            <img src="@/assets/D15.svg" width="16" height="20" />
            <div>{{ name }}</div>
        </div>
        <slot />
    </div>
</template>

<style scoped>
.sector-header {
    font-size: 13pt;
    margin-bottom: 4pt;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5pt;
}
</style>