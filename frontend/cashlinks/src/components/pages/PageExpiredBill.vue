<script setup lang="ts">
    import { SectionHeader, SectionFooter } from '../sections';
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <SectionHeader :glow="true" :loading="false" />

        <div class="max-w-sm m-auto h-full flex items-center justify-center">

            <div class="-mt-10">
                <h1 class="text-white text-xl text-center leading-tight font-medium
                font-avenir-next-bold">Link Expired</h1>

                <p class="mt-10 text-white text-md text-center font-medium
                font-avenir-next-regular opacity-70">This Kin was automatically returned to
                the sender because it wasn't collected within 24 hours. Please ask
                them to send the Kin again.</p>
            </div>

        </div>

        <SectionFooter/>
    </div>
</template>