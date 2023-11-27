<script lang="ts">
import { defineComponent } from "vue";
import { KikCodeDescription, KikCode, createKikCodePayload } from "../../utils/kik";

import bill from '../../assets/bill.png';
import { UserAgent } from "../../utils";

export default defineComponent({
  name: "KikCode",
  props: {
    payload: {
      type: Uint8Array,
      required: true,
    },
    scanned: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: Number,
      default: 73470,
    },
  },
  setup(props) {
    const size = { width: 200, height: 200 };
    const payload = createKikCodePayload(props.payload);
    const description: KikCodeDescription = KikCode.generateDescription(size, payload);
    const scale = UserAgent.isMobileDevice() ? 28 : 30;

    return {
      scale,
      description,
      bill,

      logo: {
        minX: 0,
        maxX: 93.51064,
        minY: 0,
        maxY: 94.21016,
        scaleFactor: 0.5,
      }
    };
  },
});
</script>
<template>
  <div class="code-bill relative group">

    <div class="relative overflow-hidden" :class="{ 'swipe': scanned }">
      <div class="absolute top-0 -inset-full h-full w-1/2 z-5 block transform
      -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-50" :class="{
        'shine': scanned
      }" />

      <div class="relative" 
        :style="{
          width: `${ scale * 1 }vh`,
          height: `${ scale * 1.8 }vh`,
        }">

        <img class="w-full drop-shadow-xl" :src="bill" />

        <svg class="absolute" 
        viewBox="0 0 200 200"
        :style="{
          width: `${ (description.size.width/350)*scale }vh`,
          height: `${ (description.size.height/350)*scale }vh`,
          top: `${ scale * 0.62 }vh`,
          left: `${ scale * 0.217 }vh`,
        }">

          <mask id="circle-mask">
            <rect width="100%" height="100%" fill="white" />
            <g :transform="'translate(' +
              ((description.size.width - logo.maxX * logo.scaleFactor + logo.minX * logo.scaleFactor) / 2) + ', ' +
              ((description.size.height - logo.maxY * logo.scaleFactor + logo.minY * logo.scaleFactor) / 2) + ')' +
              ' scale(' + logo.scaleFactor + ')'">
              <circle cx="24.6985" cy="25.0039" r="10.3001" fill="black" />
              <circle cx="69.0534" cy="25.0039" r="10.3001" fill="black" />
              <circle cx="69.0534" cy="69.3591" r="10.3001" fill="black" />
              <circle cx="24.6985" cy="69.3591" r="10.3001" fill="black" />
              <circle cx="24.9531" cy="47.2068" r="10.3001" fill="black" />
              <circle cx="46.9016" cy="25.1057" r="10.3001" fill="black" />
              <circle cx="46.9016" cy="69.3591" r="10.3001" fill="black" />
              <circle cx="46.901" cy="87.2844" r="6.92572" fill="black" />
              <circle cx="46.901" cy="6.92572" r="6.92572" fill="black" />
              <circle cx="6.92572" cy="47.2069" r="6.92572" fill="black" />
              <circle cx="86.58492" cy="47.2069" r="6.92572" fill="black" />
            </g>
          </mask>

          <g>
            <g mask="url(#circle-mask)">
              <path :d="description.center" fill="white" />
            </g>
            <g mask="url(#circle-mask)">
              <path v-for="(arc, index) in description.arcs" :key="'arc-' + index" :d="arc" stroke="white"
                stroke-linecap="round" stroke-width="6.8" />
            </g>
            <g mask="url(#circle-mask)">
              <path v-for="(dot, index) in description.dots" :key="'dot-' + index" :d="dot" fill="white" />
            </g>
          </g>

        </svg>

        <span class="mint absolute opacity-60 text-white"
          :style="{
            bottom: `${ scale * 0.117 }vh`,
            left: `${ scale * 0.028 }vh`,
            fontSize: `${ scale * 0.024 }vh`,
          }">kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6</span>

        <span class="amount-tl absolute font-bold text-white origin-top-left"
          :style="{
            top: `${ scale * 0.148 }vh`,
            left: `${ scale * 0.071 }vh`,
            fontSize: `${ scale * 0.112 }vh`,
          }">
          <svg 
            :style="{
              width:`${ scale * 0.048 }vh`,
              height:`${ scale * 0.048 }vh`,
            }"
            viewBox="0 0 26 24" 
            fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-90
            inline-block h-5 valign-bottom">
            <path d="M-5.68248e-07 12L6.5 0.741672L19.5 0.741672L26 12L19.5
            23.2583L6.5 23.2583L-5.68248e-07 12Z" fill="currentColor"/>
          </svg>

          {{ amount.toLocaleString('en-US') }}
        </span>

        <span class="amount-br absolute font-bold text-white origin-bottom-right"
          :style="{
            bottom: `${ scale * 0.128 }vh`,
            right: `${ scale * 0.051 }vh`,
            fontSize: `${ scale * 0.112 }vh`,
          }">
          <svg 
            :style="{
              width:`${ scale * 0.048 }vh`,
              height:`${ scale * 0.048 }vh`,
            }"
            viewBox="0 0 26 24" 
            fill="none" xmlns="http://www.w3.org/2000/svg" class="rotate-90
            inline-block h-5 valign-bottom">
            <path d="M-5.68248e-07 12L6.5 0.741672L19.5 0.741672L26 12L19.5
            23.2583L6.5 23.2583L-5.68248e-07 12Z" fill="currentColor"/>
          </svg>
          {{ amount.toLocaleString('en-US') }}
        </span>
      </div>

    </div>

  </div>
</template>


<style scoped>
.code-bill {
  transform-style: preserve-3d;
  perspective: 2000px;
}

.amount-tl {
  font-family: "Avenir Next LT Pro Bold";
  /* Using multiple transforms here to get the anchor point in the top left */
  transform: scaleY(-1) rotate(90deg) scaleY(-1) translateX(-100%);
  line-height: 0;
}

.amount-br {
  font-family: "Avenir Next LT Pro Bold";
  transform: scaleY(-1) rotate(90deg) scaleY(-1) translateX(100%);
  line-height: 0;
}

.mint {
  line-height: 0;
}

svg {
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, .6));
}

.shine {
  animation: shine 0.1s;
}

@keyframes shine {
  100% {
    left: 125%;
  }
}

.swipe {
  animation: pop 0.4s forwards ease-out, fade 0.3s forwards ease-out, shadow 0.4s forwards ease-in;
  animation-delay: 0.1s;
}

@keyframes pop {
  100% {
    transform: scale(1.1);
  }
}

@keyframes fade {
  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes shadow {
  0% {
    filter: drop-shadow(1px 1px 3px rgb(0 0 0 / 0.2));
  }

  100% {
    filter: drop-shadow(4px 4px 20px rgb(0 0 0 / 0.2));
  }
}</style>