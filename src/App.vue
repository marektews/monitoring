<template>
    <header>
        <div class="title-group">
            <FontAwesomeIcon :icon="faWaveSquare" :shake="true" />
            <div>Monitoring</div>
        </div>

        <div class="radio-group">
            <div class="form-check">
                <input class="form-check-input" type="radio" name="tura" id="w2" :value="2" v-model="tura">
                <label class="form-check-label" for="w2">
                    W2
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="tura" id="w3" :value="3" v-model="tura">
                <label class="form-check-label" for="w3">
                    W3
                </label>
            </div>
        </div>
    </header>
    <main>
        <SoaView :tura="tura" />
    </main>
</template>


<script setup>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faWaveSquare } from '@fortawesome/free-solid-svg-icons';
import SoaView from './views/SoaView.vue'

const tura = ref(2)

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

.radio-group {
    display: flex;
    flex-direction: row;
    gap: 9pt;
}
</style>
