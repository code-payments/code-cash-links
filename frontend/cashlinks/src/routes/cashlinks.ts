import * as cashlinks from '../components';
import { UserAgent } from '../utils';

const routes = [
  { path: '/e=:entropy', name: 'receive', component: cashlinks.PageReceiveBill, props: true, meta: { bodyClass: ['bg-[#0f0c1f]', 'overflow-hidden'] }},
  { path: '/claimed', name: 'claimed', component: cashlinks.PageAlreadyClaimed, meta: { bodyClass: ['bg-[#0f0c1f]', 'overflow-hidden'] }},
  { path: '/expired', name: 'expired', component: cashlinks.PageExpiredBill, meta: { bodyClass: ['bg-[#0f0c1f]', 'overflow-hidden'] }},
];

// Special case for mobile devices (show an extra page)
if (UserAgent.isMobileDevice()) {
  routes.push(
    { path: '/download/e=:entropy', name: 'download', component: cashlinks.PageDownloadApp, props: true, meta: { bodyClass: ['bg-[#0f0c1f]'] }},
  )
} else {
  routes.push(
    { path: '/download/e=:entropy', name: 'download', component: cashlinks.PageReceiveBill, props: true, meta: { bodyClass: ['bg-[#0f0c1f]', 'overflow-hidden'] }},
  )
}

export {
    routes
}