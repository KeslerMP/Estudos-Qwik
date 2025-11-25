/*
 * WHAT IS THIS FILE?
 *
 * Development entry point using only client-side modules:
 * - Doesn't include any SSR code
 * - Connect to the dev server for HMR (hot module reload)
 * - Renders your application in client-only mode
 */
import { render, type RenderOptions } from '@builder.io/qwik';
import Root from './root';

export default function (opts: RenderOptions) {
  return render(document, <Root />, opts);
}
