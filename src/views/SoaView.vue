<template>
    <div class="soa-container">
        <template v-if="loading.includes(true)">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>Proszę czekać ...</div>
        </template>
        <template v-else>
            <TerminalNode v-for="(term, idx1) in terminals" :key="idx1" :name="term.name">
                <SectorNode v-for="(sec, idx2) in term.sectors" :key="idx2" :name="sec.name">
                    <BusNode v-for="(rja, idx3) in sec.rja" :key="idx3"
                        :rja="rja"
                        :state="get_state(rja.id)"
                    />
                </SectorNode>
            </TerminalNode>

            <div class="card">
                <div class="card-body">
                    <div class="card-title">LEGENDA</div>
                    <div class="d-flex">
                        <StatusLed status="no-bus" /> - brak autokaru
                    </div>
                    <div class="d-flex">
                        <StatusLed status="in-buffer" /> - postój w buforze
                    </div>
                    <div class="d-flex">
                        <StatusLed status="second-circle" /> - kołowanie, za wczesny przyjazd
                    </div>
                    <div class="d-flex">
                        <StatusLed status="send-to-sector" /> - podstawianie na sektor
                    </div>
                    <div class="d-flex">
                        <StatusLed status="on-sector" /> - postój na sektorze
                    </div>
                    <div class="d-flex">
                        <StatusLed status="ready-to-leave" /> - gotowy do odjazdu
                    </div>
                    <div class="d-flex">
                        <StatusLed status="on-the-road" /> - w trasie
                    </div>
                </div>
            </div>

            <small>Stan z: {{ timestamp }}</small>
        </template>
    </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TerminalNode from '../components/TerminalNode.vue';
import SectorNode from '../components/SectorNode.vue';
import BusNode from '../components/BusNode.vue';
import StatusLed from '@/components/StatusLed.vue';
import { useOdprawaSocket } from '@/composables/useOdprawaSocket.js';

const loading = ref([true, true])
const terminals = ref(null)
const states = ref(null)
const timer = ref(null)
const timestamp = ref(undefined)

// tematy WS budowane z listy terminali: buffer:<name> rozwija się po stronie
// backendu na sector:<sid> wszystkich sektorów terminala
const ws_topics = ref([])
let socket = null

onMounted(() => {
    // Kanał główny: WebSocket. Tematy podajemy getterem, bo lista terminali
    // ładuje się asynchronicznie — po jej pobraniu wołamy socket.resubscribe().
    socket = useOdprawaSocket(() => ws_topics.value, apply_ws_state, loading_states)

    loading_terminals()
    loading_states()

    // Siatka bezpieczeństwa: wolny polling tylko gdy WS jest rozłączony
    timer.value = setInterval(() => {
        if (!socket.isConnected.value)
            loading_states()
    }, 60000)
})

onBeforeUnmount(() => {
    if (timer.value != null) {
        clearInterval(timer.value)
        timer.value = null
    }
    // socket sprząta się sam przez własny onBeforeUnmount
})

// pobieranie listy terminali, sektorów i ich busów
function loading_terminals() {
    fetch('/api/monitoring/terminals')
    .then(response => response.json())
    .then(d => {
        terminals.value = d
        ws_topics.value = d.map(t => 'buffer:' + t.name)
        if (socket) socket.resubscribe()
        loading.value[0] = false
    })
    .catch(err => {
        console.error("Loading terminals static info:", err)
        loading.value[0] = false
    })
}

// pobieranie statusów wszystkiego
function loading_states() {
    fetch('/api/monitoring/states')
    .then(response => {
        if(response.status === 200)
            return response.json()
        else
            console.error("Loading states:", response)
    })
    .then(d => {
        states.value = d
        loading.value[1] = false
        timestamp.value = new Date().toLocaleTimeString()
    })
    .catch(err => {
        console.error("Loading states:", err)
        loading.value[1] = false
    })
}

// aktualizacja stanu pojedynczego autokaru z ramki WebSocket
function apply_ws_state(json) {
    // przed pierwszym pełnym fetchem stanów pomijamy — loading_states i tak uzupełni
    if (states.value == null)
        return
    states.value[json.rja_id] = {
        status: json.status,
        ts: json.ts
    }
    timestamp.value = new Date().toLocaleTimeString()
}

function get_state(rja_id) {
    return states.value ? states.value[rja_id] : undefined
}
</script>


<style scoped>
.soa-container {
    padding: 16pt 6pt;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24pt;
}
</style>