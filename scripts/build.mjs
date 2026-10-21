import {verifyCore} from './verify-core.mjs';
await verifyCore();
const {buildSite}=await import('../vendor/tech-week-core/build.mjs');
await buildSite();
