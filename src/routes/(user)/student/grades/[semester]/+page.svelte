<script lang="ts">
    // import { IconPlus } from '@tabler/icons-svelte';
    import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
    import * as SemStore from '$lib/stores/SemesterStores';
    import type { TableSource } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';
    import { Modal, getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
    import AddGrade from '$lib/components/AddGrade.svelte';
    import { Subject, Semester } from '$lib/models/types';

    const modalStore = getModalStore();
    const semStore = SemStore.get();
    const semId = $page.params.semester;

    function computeHonor(gwa: number) {
        if (gwa === 0) return 'None';
        if (details.gwa) {
            if (details.gwa <= 1.45) {
                return 'University';
            } else if (details.gwa <= 1.75) {
                return 'College';
            } else {
                return 'None';
            }
        }
    }

    $: scholarship = computeHonor(details.gwa ?? 0);

    function getTable(subjects: Subject[]): TableSource {
        return {
            head: ['Class', 'Grade', 'Units'],
            body: tableMapperValues(subjects, ['className', 'grade', 'units']),
            meta: tableMapperValues(subjects, ['className', 'grade', 'units']),
        };
    }

    // fetch data
    function update(_: any) {
        const semId = $page.params.semester;
        const sem = semStore.getSem(semId);
        if (!sem) throw new Error('Semester not found');

        const { details, subjects } = sem;
        const table = getTable(subjects);
        return {
            details,
            table,
        };
    }
    $: ({ details, table } = update($semStore));

    function inputGrade(): void {
        const c: ModalComponent = { ref: AddGrade };
        const modal: ModalSettings = {
            type: 'component',
            component: c,
            title: 'Add New Class',
            response: (r: Subject) => {
                semStore.addSubject(r, semId);
            },
        };
        modalStore.trigger(modal);
    }
</script>

<div class="h-full m-10 space-y-10">
    <div class="flex justify-between">
        <div class="text-tertiary-900 font-bold text-4xl">{details.sem}</div>
        <div class="text-tertiary-900 font-bold text-4xl">AY {details.year}</div>
    </div>

    <div class="gap-10">
        <div
            class="bg-primary-300 px-10 py-6 space-x-7 rounded-xl font-bold border border-tertiary-300 grid grid-cols-3 gap-5"
        >
            <button
                type="button"
                class="btn bg-primary-500 text-secondary-500 rounded-xl border border-tertiary-300 col-start-3 justify-self-end"
                on:click={() => inputGrade()}
            >
                <!-- <IconPlus /> -->
                <span class="text-lg">Add Class</span>
            </button>
            <div class="col-span-3">
                {#if table.body.length > 0}
                    <Table source={table} />
                {:else}
                    <div class="text-tertiary-900 font-bold text-4xl">No Subjects</div>
                {/if}
            </div>
        </div>

        <div>
            <div class="card variant-filled-primary *: border border-tertiary-300 px-10 py-6 space-x-7 rounded-xl">
                <div class="flex justify-between">
                    <div class="text-tertiary-900 font-bold text-4xl">GWA: {details.gwa ?? 0}</div>
                    <div class="text-tertiary-900 font-bold text-4xl">Units: {details.units ?? 0}</div>
                    <div class="text-tertiary-900 font-bold text-4xl">Honorable <br /> Scholarship: {scholarship}</div>
                </div>
            </div>
        </div>
    </div>
</div>
