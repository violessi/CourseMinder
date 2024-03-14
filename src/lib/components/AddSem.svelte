<script lang="ts">
    import { AddSem, SemType } from '$lib/models/types';
    import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
    import type { SvelteComponent } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { safeParse } from 'valibot';

    // eslint-disable-next-line init-declarations
    export let parent: SvelteComponent;

    // eslint-disable-next-line init-declarations
    const formData: AddSem = {
        sem: SemType.first,
        year: '2023-2024',
    };
    const modalStore = getModalStore();
    let message = '';

    function handleSubmit(e: Event) {
        e.preventDefault();

        const res = safeParse(AddSem, formData);
        if (!formData.year.match(/\d{4}-\d{4}/)) {
            message = 'Invalid year format. Please follow the YYYY-YYYY format.';
            return;
        }
        if (!formData.sem || !formData.year) {
            message = 'Please fill out all fields.';
            return;
        }
        if (res.success && $modalStore[0].response) {
            $modalStore[0].response(res.output);
            modalStore.close();
        } else message = 'Invalid input.';
    }
</script>

{#if $modalStore[0]}
    <div class="p-4 w-modal shadow-xl space-y-4 bg-secondary-400 rounded-container-token border border-tertiary-900">
        <header class="text-2xl font-bold text-center">{$modalStore[0].title ?? '(title missing)'}</header>
        <div class="border border-tertiary-900 p-4 space-y-4 rounded-container-token">
            <div class="flex place-items-center">
                <div class="w-1/4">Semester:</div>
                <ListBox
                    class="flex items-center justify-self-start"
                    background=""
                    spacing="space-y-0"
                    regionDefault="text-center"
                >
                    <ListBoxItem bind:group={formData.sem} name="1st" value={SemType.first}>{SemType.first}</ListBoxItem
                    >
                    <ListBoxItem bind:group={formData.sem} name="2nd" value={SemType.second}
                        >{SemType.second}</ListBoxItem
                    >
                    <ListBoxItem bind:group={formData.sem} name="Midyear" value={SemType.midyear}
                        >{SemType.midyear}</ListBoxItem
                    >
                </ListBox>
            </div>

            <form class="modal-form">
                <label class="label flex place-items-center gap-5">
                    <div class="w-1/4">Academic Year:</div>
                    <input class="input" type="text" bind:value={formData.year} required placeholder="YYYY-YYYY" />
                </label>
            </form>
        </div>
        {#if message}
            <div class="text-error-200 text-center">{message}</div>
        {/if}

        <footer class="modal-footer {parent.regionFooter}">
            <button class="btn {parent.buttonNeutral}" on:click={modalStore.close}>{parent.buttonTextCancel}</button>
            <button class="btn {parent.buttonPositive}" on:click={handleSubmit}>Done</button>
        </footer>
    </div>
{/if}
