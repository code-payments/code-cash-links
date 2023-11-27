<script lang="ts" setup>
import { ref } from 'vue';
import { UserAgent } from '../../utils';
import { SectionHeader } from '../sections';

const props = defineProps({
    entropy: {
        type: String,
        required: true
    }
});

const cashUrl = ref(window.location.href.replace(/https?:\/\//, "codewallet://").replace(/download\//, ""));

// If your app isn't installed, this method opens the App Store 
// (iOS) or Google Play (Android) to download the app
function openInAppStore() {
    var url : string;

    if (UserAgent.iOS() || UserAgent.Safari() || !UserAgent.Android()) {
        // Your Apple App Store URL
        url = 'https://apps.apple.com/us/app/code-wallet/id1562384846';
    } else {
        // Your Google Play Store URL
        // url = 'https://play.google.com/store/apps/details?id=com.getcode';
        url = 'https://www.getcode.com/download';
    }

    window.location.replace(url);
}

// This method opens your app if it's installed
function openInApp() {
    // Your app's custom scheme URL
    window.location.replace(cashUrl.value);
}
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <SectionHeader :glow="true" :loading="false" />

        <div class="max-w-sm py-10 px-5 mx-auto font-avenir-next-bold">
            <div class="delay-show-1 pb-10">
                <div class="pb-5 text-white text-[28px] text-center leading-tight
                tracking-tighter font-medium">You need the Code Wallet
                    app to collect this cash</div>

                <button type="button" @click="openInApp()" class="mt-6 block rounded-md bg-white
                py-4 text-base font-semibold text-[#0f0c1f] text-center
                shadow-sm w-full">I Already Have the Code Wallet App</button>
            </div>

            <div class="delay-show-2 border-b border-[#565C86] hidden"></div>
            <div class="delay-show-2 border-b border-white/50 relative">
                <div class="text-white text-base text-center absolute -top-4 w-full"><span class="bg-[#0f0c1f] px-2">Otherwise</span></div>
            </div>

            <div class="delay-show-3 mt-10">
                <div class="pb-10 text-white text-[28px] text-center
                leading-tight tracking-tighter font-medium">Don’t have the <br> Code
                    Wallet app yet?</div>

                <div class="flex content-center text-white">
                    <div class="grow-0 flex justify-center">
                        <div class="flex border border-white rounded-full w-14
                        h-14 justify-center content-center grid">1</div>
                    </div>

                    <div class="grow h-14 grid content-center pl-3 text-lg leading-6">
                        Download the Code Wallet app and create a Code account
                    </div>
                </div>

                <button type="button" @click="openInAppStore()" class="mt-6 block rounded-md bg-transparent border border-white
                py-4 text-base font-semibold text-[#0f0c1f] text-center text-white
                shadow-sm w-full">Download Code Now</button>

                <div class="flex content-center text-white mt-8">
                    <div class="grow-0 flex justify-center">
                        <div class="flex border border-white rounded-full w-14
                        h-14 justify-center content-center grid">2</div>
                    </div>

                    <div class="grow h-14 grid content-center pl-3 text-lg leading-6">
                        Click the Cash Link again to collect your cash
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.delay-long {
    opacity: 0;
    animation: fade 2s ease-in-out 1.5s forwards;
}

@keyframes fade-slide {
    0% {
        opacity: 0;
        transform: translateY(-0.5vh);
    }

    100% {
        opacity: 1;
    }
}

.delay-show-1 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 0s forwards;
}

.delay-show-2 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 0.5s forwards;
}

.delay-show-3 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 1.0s forwards;
}

.delay-show-4 {
    opacity: 0;
    animation: fade-slide 0.5s ease-out 1.5s forwards;
}</style>
