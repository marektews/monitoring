<script setup>
import D15 from '../components/icons/D15.vue'

const props = defineProps({
    item: { type: Object, required: true }
})

</script>

<template>
    <div class="bus-container">
        <div class="congregation">{{ item.congregation }}</div>
        <div class="attributes">
            <div><span class="value">{{ item.sector }}</span></div> |
            <div><span class="value">{{ item.substitution }}</span></div> |
            <div><span class="value">{{ item.departure }}</span></div>
        </div>
    </div>
</template>

<style scoped>
.bus-container {
    background-color: rgba(255, 255, 255, 0.095);
    border-radius: 2pt;
    padding: 4pt 1.2rem;
}

.congregation {
    font-weight: bold;
    color: white;
}

.attributes {
    font-size: small;
    display: flex;
    flex-direction: row;
    gap: 4pt;
}

.icon {
    width: 1rem;
    height: 1rem;
    
}
.value {
    color: white;
}
</style>