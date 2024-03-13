import { SemDetails, Semester, Subjects } from '$lib/models/types';
import { get, writable } from 'svelte/store';

function initStore() {
    const store = writable<Semester[]>([]);
    const { subscribe, set, update } = store;

    function add({ sem, year }: Omit<SemDetails, 'gwa' | 'units'>) {
        const obg = {
            id: `${sem}:${year}`,
            details: {
                sem,
                year,
                gwa: null,
                units: null,
            },
            subjects: [],
        } satisfies Semester;

        update((store) => [...store, obg]);
    }

    function getSem(id: string): Semester {
        const res = get(store).find((s) => s.id === id);
        if (typeof res === 'undefined') throw new Error('Semester not found');
        return res;
    }

    function computeGWA(id: string) {
        update((store) => {
            const sem = getSem(id);
            const totalUnits = sem.subjects.reduce((acc, cur) => Number(acc) + Number(cur.units), 0);
            const totalGrade = sem.subjects.reduce(
                (acc, cur) => Number(acc) + Number(cur.grade) * Number(cur.units),
                0,
            );
            sem.details.units = totalUnits;
            const res = totalGrade / totalUnits;
            res.toFixed(4);
            sem.details.gwa = res;
            return store;
        });
    }

    function addsubject(id: string, subject: Subjects[0]) {
        update((store) => {
            const sem = getSem(id);
            sem.subjects.push(subject);
            return store;
        });
    }

    return {
        subscribe,
        set,
        update,
        add,
        getSem,
        addsubject,
        computeGWA,
    };
}

export const SemesterStore = initStore();
