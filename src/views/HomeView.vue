<script setup>
import { ref, reactive } from 'vue'
import Bus from '../components/Bus.vue'

const buses = reactive({ list: [] })

fetch('/api/monitoring/buses')
.then(response => {
    if(response.status == 200)
        return response.json()
    else
        return []
})
.then(d => {
    console.log('Fetch buses list:', d)
    buses.list = d
})
.catch( error => console.error('Fetch buses list error:', error))
</script>

<template>
    <main>
        <Bus v-for="(item, index) in buses.list" :key="index" :item="item" />
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4pt;
}
</style>