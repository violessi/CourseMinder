<script lang="ts">
    import { Subject } from '$lib/models/types';
    import type { SvelteComponent } from 'svelte';
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { safeParse } from 'valibot';

    // eslint-disable-next-line init-declarations
    export let parent: SvelteComponent;

    const modalStore = getModalStore();

    // Form Data
    const formData: Subject = {
        className: 'null',
        grade: 0,
        units: 0,
    };

    let message = '';
    const gradesArray = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0, 4.0, 5.0];

    function handleSubmit(e: Event) {
        if (!formData.className || !formData.grade || !formData.units) {
            e.preventDefault();
            message = 'Please fill out all fields.';
        } else if (!gradesArray.includes(formData.grade)) {
            e.preventDefault();
            message = 'Invalid grade. Please follow the UP Grading System format.';
        }

        const res = safeParse(Subject, formData);
        if (res.success) {
            if ($modalStore[0].response) $modalStore[0].response(formData);
            modalStore.close();
        } else {
            e.preventDefault();
            message = 'Invalid input.';
        }
    }

    // Base Classes
    const cBase =
        ' p-4 w-modal shadow-xl space-y-4 bg-secondary-400 rounded-container-token border border-tertiary-900';
    const cHeader = 'text-2xl font-bold text-center';
    const cForm = 'border border-tertiary-900 p-4 space-y-4 rounded-container-token';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
    <div class="modal-example-form {cBase}">
        <header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
        <!-- Enable for debugging: -->
        <div class={cForm}>
            <form class="modal-form">
                <label class="label flex place-items-center gap-5">
                    <div class="w-1/4">Class Name:</div>
                    <input
                        class="input"
                        type="text"
                        bind:value={formData.className}
                        required
                        placeholder="Enter class name..."
                    />
                </label>
                <label class="label flex place-items-center gap-5">
                    <div class="w-1/4">Grade:</div>
                    <input
                        class="input"
                        type="number"
                        bind:value={formData.grade}
                        required
                        placeholder="Enter class grade..."
                    />
                </label>
                <label class="label flex place-items-center gap-5">
                    <div class="w-1/4">Units:</div>
                    <input
                        class="input"
                        type="number"
                        bind:value={formData.units}
                        required
                        placeholder="Enter class units..."
                    />
                </label>
            </form>
        </div>
        {#if message}
            <div class="text-error-200 text-center">{message}</div>
        {/if}

        <!-- prettier-ignore -->
        <footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={modalStore.close}>{parent.buttonTextCancel}</button>
			<button class="btn {parent.buttonPositive}" on:click={(e) => handleSubmit(e)}>Done</button>
		</footer>
    </div>
{/if}
