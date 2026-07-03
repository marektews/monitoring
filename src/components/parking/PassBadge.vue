<script setup>
const props = defineProps(['pass'])
</script>

<template>
    <div class="pass-badge" :class="props.pass.used ? 'pass-used' : 'pass-free'"
        :title="props.pass.used ? 'wjazd: ' + (props.pass.ts ?? '') : 'wolny'">
        {{ props.pass.nr }}
    </div>
</template>

<style scoped>
.pass-badge {
    min-width: 36px;
    padding: 1px 5px;
    border-radius: 4px;
    border: 1px solid;
    text-align: center;
    font-size: 10pt;
}
/* kolory spójne z paletą Bootstrapa (danger/success) */
.pass-used {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
}
.pass-free {
    color: #198754;
    background-color: #f8f9fa;
    border-color: #19875466;
}
</style>
