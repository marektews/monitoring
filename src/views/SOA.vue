<script setup>
import { ref, onMounted } from 'vue';
import Terminal from '../components/TerminalNode.vue';
import Sector from '../components/SectorNode.vue';
import Bus from '../components/BusNode.vue';

const loading = ref([true, true])
const terminals = ref(null)
const states = ref(null)
const timer = ref(null)
const timestamp = ref(undefined)

onMounted(() => {
    loading_terminals()
    loading_states()
    timer.value = setInterval(loading_states, 20000)
})

// pobieranie listy terminali, sektorów i ich busów
function loading_terminals() {
    fetch('/api/monitoring/terminals')
    .then(response => response.json())
    .then(d => {
        terminals.value = d
        loading.value[0] = false
    })
    .catch(err => console.error("Loading terminals static info:", err))
}

// pobieranie statusów wszystkiego
function loading_states() {
    fetch('/api/monitoring/states')
    .then(response => response.json())
    .then(d => {
        states.value = d
        loading.value[1] = false
        timestamp.value = new Date().toLocaleTimeString()
    })
    .catch(err => console.error("Loading states:", err))
}

function get_state(rja_id) {
    return states.value[rja_id]
}
</script>

<template>
    <div class="soa-container">
        <template v-if="loading.includes(true)">
            <div  class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>Proszę czekać ...</div>
        </template>
        <template v-else>
            <Terminal v-for="(term, idx1) in terminals" :key="idx1" :name="term.name">
                <Sector v-for="(sec, idx2) in term.sectors" :key="idx2" :name="sec.name">
                    <Bus v-for="(rja, idx3) in sec.rja" :key="idx3" 
                        :rja="rja" 
                        :state="get_state(rja.id)"
                    />
                </Sector>
            </Terminal>

            <small>Stan z: {{ timestamp }}</small>
        </template>
    </div>
</template>

<style scoped>
.soa-container {
    padding: 16pt 6pt;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24pt;
}
</style>