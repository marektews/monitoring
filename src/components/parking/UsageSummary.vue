<script setup>
import { computed } from 'vue'

const props = defineProps(['used', 'total'])

const percent = computed(() =>
    props.total > 0 ? Math.round(100 * props.used / props.total) : 0
)
</script>

<template>
    <div class="usage-summary">
        <div class="usage-counts">
            zajęte <span class="fw-bold text-danger">{{ props.used }}</span> /
            wolne <span class="fw-bold text-success">{{ props.total - props.used }}</span> /
            łącznie <span class="fw-bold">{{ props.total }}</span>
        </div>
        <div class="progress usage-bar" role="progressbar"
            :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar bg-danger" :style="{ width: percent + '%' }">{{ percent }}%</div>
        </div>
    </div>
</template>

<style scoped>
.usage-summary {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 12pt;
}
.usage-counts {
    font-size: 12pt;
}
.usage-bar {
    width: 220px;
}
</style>
