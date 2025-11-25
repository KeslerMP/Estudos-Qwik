/*
 * WHAT IS THIS FILE?
 *
 * It's the entry point for the Qwik City preview server when building for production.
 *
 * Learn more about the preview server:
 * - https://qwik.builder.io/qwikcity/guides/preview/
 *
 */
import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';

/**
 * The default export is the QwikCity adapter used by the preview server.
 */
export default createQwikCity({ render, qwikCityPlan });
