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

    <!-- Belka przełączania widoków; v-if odmontowuje nieaktywne widoki,
         dzięki czemu nie trzymają własnych połączeń WS ani pollingu -->
    <nav class="view-switch nav nav-pills">
        <button class="nav-link" :class="{ active: view === 'soa' }" @click="view = 'soa'">
            Odprawa autokarów
        </button>
        <button class="nav-link" :class="{ active: view === 'srp' }" @click="view = 'srp'">
            Parking niepełnosprawnych
        </button>
        <button class="nav-link" :class="{ active: view === 'pk' }" @click="view = 'pk'">
            Parking działów
        </button>
    </nav>

    <main>
        <SoaView v-if="view === 'soa'" />
        <SrpParkingView v-else-if="view === 'srp'" />
        <PkParkingView v-else />
    </main>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import SoaView from './views/SoaView.vue'
import SrpParkingView from './views/SrpParkingView.vue'
import PkParkingView from './views/PkParkingView.vue'

const view = ref('soa')

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

.view-switch {
    padding: 6pt 6pt 0 6pt;
    gap: 4pt;
}
</style>
