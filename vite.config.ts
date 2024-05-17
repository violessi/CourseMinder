/* eslint-disable new-cap */
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        purgeCss(),
        Icons({
            compiler: 'svelte',
        }),
    ],
});
