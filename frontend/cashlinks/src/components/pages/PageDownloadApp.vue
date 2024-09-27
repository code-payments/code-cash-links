<script lang="ts" setup>
import { ref } from 'vue';
import { UserAgent } from '../../utils';

defineProps({
    entropy: {
        type: String,
        required: true
    }
});

const cashUrl = ref(window.location.href.replace(/https?:\/\//, "codewallet://").replace(/download\//, ""));

function openInAppStore() {
    var url: string;

    if (UserAgent.iOS() || UserAgent.Safari() || !UserAgent.Android()) {
        url = 'https://apps.apple.com/us/app/code-wallet/id1562384846';
    } else {
        url = 'https://play.google.com/store/apps/details?id=com.getcode';
    }

    window.location.replace(url);
}
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <div class="max-w-sm px-5 mx-auto font-avenir-next-bold">
            <div class="flex flex-row min-h-screen justify-center items-center">
                <div>
                    <div class="text-white text-[26px] px-10 text-center
                        leading-tight tracking-tighter font-medium">
                        Someone sent you cash
                    </div>

                    <a :href="cashUrl" 
                        class="mt-6 block rounded-md bg-white py-4 text-base
                        font-semibold text-[#0f0c1f] text-center shadow-sm
                        active:bg-[#0f0c1f] active:text-white
                        active:border-white border border-transparent
                        w-full">Open in Code</a>

                    <button @click="openInAppStore()" type="button"
                        class="mt-6 block rounded-md bg-transparent border
                        border-white py-4 text-base font-semibold text-[#0f0c1f]
                        text-center text-white shadow-sm w-full">
                        Download Code Now</button>
                </div>
            </div>
        </div>
    </div>
</template>
