<template>
    <header>
        <div class="title-group">
            <FontAwesomeIcon :icon="faWaveSquare" :shake="true" />
            <div>Monitoring</div>
        </div>

        <div v-if="tura" class="tura-label" :title="tura.name">
            {{ tura.shortcut }}
        </div>
    </header>
    <main>
        <SoaView />
    </main>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import SoaView from './views/SoaView.vue'

// aktywna tura wyznaczana przez serwer (filozofia gokongres)
const tura = ref(null)

onMounted(() => {
    fetch('/api/config/active/tura')
    .then(response => response.status === 200 ? response.json() : null)
    .then(d => { tura.value = d })
    .catch(err => console.error('Loading active tura:', err))
})

</script>


<style scoped>
header {
    padding-left: 6pt;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 9pt;
}

.title-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 9pt;
    font-size: 20pt;
}

.tura-label {
    font-size: 16pt;
    font-weight: bold;
}
</style>
