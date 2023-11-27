<script setup lang="ts">
import { ref, Transition } from 'vue';
import { SectionHeader, SectionFooter } from '../sections';

const soon = ref(false);
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <SectionHeader :glow="true" :loading="false" />

        <div class="max-w-sm m-auto h-full flex items-center justify-center">

            <div class="-mt-10">
                <h1 class="text-white text-xl text-center leading-tight font-medium
                font-avenir-next-bold">Kin Already Collected</h1>

                <p class="mt-10 text-white text-md text-center leading-tight font-medium
                font-avenir-next-regular opacity-70">This Kin was already collected by someone.</p>

                <div class="mt-14 flex items-center justify-center">
                    <a href="https://apps.apple.com/us/app/code-wallet/id1562384846" target="_blank"
                        class="flex items-center justify-center rounded-full bg-transparent border border-white/20 px-10 py-1.5 text-base font-semibold text-[#0f0c1f] text-center text-white shadow-sm whitespace-nowrap">
                        <svg class="mr-3 h-4 w-4 align-middle" viewBox="0 0 67 81">
                            <g transform="matrix(1,0,0,1,-45230,-25608)"> <g transform="matrix(4.18645,0,0,4.18645,45225.7,25620.3)"> <path d="M11.895,0.156C12.49,-0.566 12.91,-1.553 12.91,-2.549C12.91,-2.686 12.9,-2.822 12.881,-2.93C11.904,-2.891 10.732,-2.285 10.039,-1.465C9.482,-0.84 8.975,0.156 8.975,1.152C8.975,1.309 9.004,1.455 9.014,1.504C9.072,1.514 9.17,1.533 9.277,1.533C10.146,1.533 11.24,0.947 11.895,0.156ZM12.578,1.738C11.123,1.738 9.932,2.627 9.17,2.627C8.359,2.627 7.305,1.797 6.035,1.797C3.623,1.797 1.182,3.789 1.182,7.539C1.182,9.883 2.08,12.354 3.203,13.945C4.16,15.293 5,16.396 6.211,16.396C7.402,16.396 7.93,15.605 9.414,15.605C10.918,15.605 11.26,16.377 12.578,16.377C13.887,16.377 14.756,15.176 15.586,13.994C16.504,12.637 16.895,11.318 16.904,11.25C16.826,11.23 14.326,10.205 14.326,7.344C14.326,4.863 16.289,3.75 16.406,3.662C15.107,1.797 13.125,1.738 12.578,1.738Z" style="fill:white;fill-rule:nonzero;"/> </g> </g>
                        </svg>
                        <span class="">App Store</span>
                    </a>
                    <a @click.prevent="soon=true" href="https://play.google.com/store/apps/details?id=com.getcode"
                        class="ml-5 flex items-center justify-center rounded-full bg-transparent border border-white/20 px-10 py-1.5 text-base font-semibold text-[#0f0c1f] text-center text-white shadow-sm whitespace-nowrap">
                        <svg class="mr-3 h-4 w-4 align-middle" viewBox="0 0 72 81">
                            <g transform="matrix(1,0,0,1,-45359,-25612)"> <g transform="matrix(1.39701,0,0,1.39701,-21833,-11547)"> <path d="M48097.8,26603.8C48098.7,26601.3 48101,26599.6 48103.8,26599.6C48105,26599.6 48106.1,26599.9 48107.1,26600.5L48132.7,26615.3L48121.3,26626.8L48097.8,26603.8ZM48134.4,26616.4L48145.1,26622.5L48145.1,26622.6C48147.1,26623.6 48148.4,26625.7 48148.4,26628.2C48148.4,26630.6 48147.1,26632.7 48145.1,26633.8L48134.5,26639.9L48122.7,26628.2L48134.4,26616.4ZM48132.7,26640.9L48107.1,26655.7L48107,26655.8C48106.1,26656.3 48105,26656.6 48103.8,26656.6C48101.3,26656.6 48099.1,26655.2 48098.1,26653.1L48121.3,26629.6L48132.7,26640.9ZM48097.4,26650.9C48097.4,26650.7 48097.4,26650.5 48097.4,26650.2L48097.4,26606.2L48119.8,26628.2L48097.4,26650.9Z" style="fill:white;"/> </g> </g>
                        </svg>
                        <span class="">Play Store 
                            <Transition>
                                <span class="opacity-50 text-xs" v-if="soon">(coming soon)</span>
                            </Transition>
                        </span>
                    </a>
                </div>
            </div>

        </div>

    <SectionFooter />
</div>
</template>

<style scoped>

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}


    
</style>