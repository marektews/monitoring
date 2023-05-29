<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
    <header>
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="48" height="48" />
        <h2>Monitoring</h2>
    </header>
    <RouterView />
</template>

<style scoped>
header {
    line-height: 1.5;
    max-height: 100vh;
    margin-bottom: 1rem;
}

.logo {
    display: block;
    margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
    header {
        display: flex;
        place-items: center;
        padding-right: calc(var(--section-gap) / 2);
    }

    .logo {
        margin: 0 2rem 0 0;
    }

    header .wrapper {
        display: flex;
        place-items: flex-start;
        flex-wrap: wrap;
    }
}
</style>
