<template>
    <div class="parking-container">
        <template v-if="loading">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div>Proszę czekać ...</div>
        </template>
        <template v-else-if="groups == null">
            <div class="alert alert-warning">Nie udało się pobrać stanu parkingu.</div>
        </template>
        <template v-else>
            <div class="card">
                <div class="card-body">
                    <div class="card-title">Parking działów kongresowych</div>
                    <UsageSummary :used="totals.used" :total="totals.total" />
                </div>
            </div>

            <!-- Karta per dział -->
            <div class="groups">
                <div v-for="(group, idx) in groups" :key="idx" class="card">
                    <div class="card-body">
                        <div class="dep-header">
                            <div class="dep-name">{{ group.dep }}</div>
                            <div class="dep-counts">
                                <span class="fw-bold text-danger">{{ used_of(group) }}</span> / {{ group.passes.length }}
                            </div>
                        </div>
                        <div v-if="group.passes.length" class="pass-grid">
                            <PassBadge v-for="p in group.passes" :key="p.id" :pass="p" />
                        </div>
                        <div v-else class="text-secondary"><small>brak zarejestrowanych identyfikatorów</small></div>
                    </div>
                </div>
            </div>

            <!-- Legenda stanów -->
            <div class="card">
                <div class="card-body">
                    <div class="card-title">LEGENDA</div>
                    <div class="legend-row">
                        <PassBadge :pass="{ nr: 1, used: false }" /> - identyfikator wolny
                    </div>
                    <div class="legend-row">
                        <PassBadge :pass="{ nr: 2, used: true }" /> - identyfikator użyty (pojazd na parkingu)
                    </div>
                </div>
            </div>

            <small>Stan z: {{ timestamp }}</small>
        </template>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import UsageSummary from '@/components/parking/UsageSummary.vue';
import PassBadge from '@/components/parking/PassBadge.vue';
import { useOdprawaSocket } from '@/composables/useOdprawaSocket.js';

const loading = ref(true)
const groups = ref(null)
const timer = ref(null)
const timestamp = ref(undefined)

let socket = null

onMounted(() => {
    // Kanał główny: WebSocket; rekoncyliacja pełnym fetchem po (re)połączeniu
    socket = useOdprawaSocket(['parking:pk'], null, loading_usage, apply_ws_parking)

    loading_usage()

    // Siatka bezpieczeństwa: wolny polling (co 60s) gdy WS rozłączony
    timer.value = setInterval(() => {
        if (!socket.isConnected.value)
            loading_usage()
    }, 60000)
})

onBeforeUnmount(() => {
    if (timer.value != null) {
        clearInterval(timer.value)
        timer.value = null
    }
})

const totals = computed(() => {
    let total = 0, used = 0
    for (const group of groups.value ?? []) {
        total += group.passes.length
        used += used_of(group)
    }
    return { total, used }
})

function used_of(group) {
    return group.passes.filter(p => p.used).length
}

// Pobieranie pełnego stanu użycia identyfikatorów (init + fallback)
function loading_usage() {
    fetch('/api/monitoring/parking/pk')
    .then(response => {
        if (response.status === 200)
            return response.json()
        else
            console.error("Loading pk parking usage:", response)
    })
    .then(d => {
        if (d) {
            groups.value = d.groups
            timestamp.value = new Date().toLocaleTimeString()
        }
        loading.value = false
    })
    .catch(err => {
        console.error("Loading pk parking usage:", err)
        loading.value = false
    })
}

// Aktualizacja stanu z ramki WebSocket (delta update)
function apply_ws_parking(json) {
    if (json.parking !== 'pk' || groups.value == null)
        return
    for (const group of groups.value) {
        const pass = group.passes.find(p => p.id === json.id)
        if (pass) {
            pass.used = json.used
            pass.ts = json.used ? json.ts : undefined
            timestamp.value = new Date().toLocaleTimeString()
            return
        }
    }
}
</script>

<style scoped>
.parking-container {
    padding: 16pt 6pt;
    display: flex;
    flex-direction: column;
    gap: 24pt;
}
.groups {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12pt;
}
.dep-header {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;
    gap: 12pt;
}
.dep-name {
    font-size: 13pt;
}
.pass-grid {
    margin-top: 9pt;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4pt;
    max-width: 400px;
}
.legend-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5pt;
    margin-bottom: 3pt;
}
</style>
