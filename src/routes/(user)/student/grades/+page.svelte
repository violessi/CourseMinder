<script lang="ts">
    import GradeCard from '$lib/components/GradeCard.svelte';
    import * as SemStore from '$lib/stores/SemesterStores';
    import { AddSem as AddSemType } from '$lib/models/types';
    import { Modal, getModalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
    import AddSem from '$lib/components/AddSem.svelte';

    const modalStore = getModalStore();
    const semStore = SemStore.get();

    function computeGWA() {
        let totalUnits = 0;
        let totalGrade = 0;
        $semStore.forEach((sem) => {
            const subjs = sem.subjects;
            subjs.forEach((subj) => {
                totalUnits += subj.units;
                totalGrade += subj.grade * subj.units;
            });
        });
        if (totalUnits === 0) return 0;
        return totalGrade / totalUnits;
    }

    function computeUnits() {
        let totalUnits = 0;
        $semStore.forEach((sem) => {
            const subjs = sem.subjects;
            subjs.forEach((subj) => {
                totalUnits += subj.units;
            });
        });
        return totalUnits;
    }

    function computeHonor(gwa: number) {
        if (gwa === 0) return 'None';
        else if (gwa <= 1.2) {
            return 'Summa Cum Laude';
        } else if (gwa <= 1.45) {
            return 'Magna Cum Laude';
        } else if (gwa <= 1.75) {
            return 'Cum Laude';
        } else {
            return 'None';
        }
    }

    function inputSem(): void {
        const c: ModalComponent = { ref: AddSem };
        const modal: ModalSettings = {
            type: 'component',
            component: c,
            title: 'Add New Semester',
            response: (r: AddSemType) => {
                semStore.addSem(r);
            },
        };
        modalStore.trigger(modal);
    }

    $: totalUnits = computeUnits();
    $: GWA = computeGWA();
    $: honor = computeHonor(GWA);

    $: console.log($semStore);
</script>

<div class="h-full m-10 space-y-10">
    <div class="flex justify-between">
        <div class="text-tertiary-900 font-bold text-4xl">View Grades</div>
        <button type="button" class="btn bg-secondary-400 text-white rounded-xl" on:click={() => inputSem()}>
            <!-- <IconPlus /> -->
            <span class="text-lg">Add Semester</span>
        </button>
    </div>

    <div
        class="bg-surface-300 py-6 rounded-xl flex justify-center font-bold border border-tertiary-300 gap-10 [&>div]:flex [&>div]:items-center [&>div]:gap-4"
    >
        <div>
            <div class="text-2xl text-tertiary-700">Total<br />Units</div>
            <div class="text-4xl text-tertiary-900">{totalUnits} units</div>
        </div>
        <div>
            <div class="text-2xl text-tertiary-700">GWA</div>
            <div class="text-4xl text-tertiary-900">{GWA.toFixed(4)}</div>
        </div>
        <div>
            <div class="text-2xl text-tertiary-700">Latin<br />Honors</div>
            <div class="text-4xl text-tertiary-900">{honor}</div>
        </div>
    </div>

    <!-- render SemesterStore -->
    <div class="grid grid-cols-4 grid-flow-row-dense gap-10">
        {#each $semStore as sem}
            <GradeCard data={sem} />
        {/each}
    </div>
</div>
