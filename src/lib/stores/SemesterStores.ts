import { AddSem, Semester, Subject } from '$lib/models/types';
import { get as getStore, writable } from 'svelte/store';
import { initializeApp } from 'firebase/app';
import { get as getFirebase, getDatabase, ref, set, type DatabaseReference } from 'firebase/database';
import { studentId } from '$lib/stores/CurriculumStores'
import { getContext, hasContext, setContext } from 'svelte';

const SEMESTER = Symbol('semester');

const firebaseConfig = {
    apiKey: 'AIzaSyCmwpRzGyoeD-Xuh6Cuh1Agbsxw31Uekhk',
    authDomain: 'courseminder-dev.firebaseapp.com',
    databaseURL: 'https://courseminder-dev-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'courseminder-dev',
    storageBucket: 'courseminder-dev.appspot.com',
    messagingSenderId: '274860730108',
    appId: '1:274860730108:web:b7f706a51ee7a79dbd1979',
    measurementId: 'G-1T6H3BFHRR',
};

// Get copy of student Id
let studentnumber = '';
studentId.subscribe((value) => {
    studentnumber = value;
});

// Initialize Firebase and get database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function initStore() {
    const store = writable<Semester[]>([]);
    const { subscribe, set, update } = store;

    async function isExistingSemester(semesterRef : DatabaseReference) {
        // Check if data for the semester already exists
        const snapshot = await getFirebase(semesterRef);
        if (snapshot.exists()) {
            return true;
        } else {
            return false;
        }
    }

    async function writeSemesterData(semesterRef : DatabaseReference, obg : Semester){
        if (!(await isExistingSemester(semesterRef))){
            set(semesterRef, obg);
        }else {
            throw new Error('Semester already exists');
        }
    }

    function addSem({ sem, year }: AddSem) {
        const obg = {
            id: `${sem} ${year}`,
            details: {
                sem,
                year,
                gwa: null,
                units: null,
            },
            subjects: [],
        } satisfies Semester;
        const semesterRef = ref(db, `semesterData/${studentnumber}/${obg.id}`);
        writeSemesterData(semesterRef, obg);                  
        update((store) => [...store, obg]);
    }

    function getSem(id: string) {
        return getStore(store).find((s) => s.id === id);
    }

    function computeGWA(subjects: Subject[]) {
        let totalUnits = 0;
        let totalGrade = 0;
        for (const subj of subjects) {
            totalUnits += subj.units;
            totalGrade += subj.grade * subj.units;
        }
        const gwa = totalGrade / totalUnits;
        return gwa;
    }

    function computeUnits(subjects: Subject[]) {
        let totalUnits = 0;
        for (const subj of subjects) totalUnits += subj.units;
        return totalUnits;
    }

    function addSubject({ className, grade, units }: Subject, id: string) {
        update((store) => {
            const sem = store.find((s) => s.id === id);
            if (typeof sem === 'undefined') throw new Error('Semester not found');

            // check if subject already exists
            // const subj = sem.subjects.find((s) => s.className.toLowerCase === className.toLowerCase);
            // if (typeof subj !== 'undefined') throw new Error('Subject already exists');

            sem.subjects.push({ className, grade, units });
            sem.details.gwa = computeGWA(sem.subjects);
            sem.details.units = computeUnits(sem.subjects);
            return store;
        });
    }

    return {
        subscribe,
        set,
        update,
        addSem,
        addSubject,
        getSem,
        computeGWA,
        computeUnits,
    };
}

type Store = ReturnType<typeof initStore>;

export function init() {
    setContext(SEMESTER, initStore() satisfies Store);
}

export function get() {
    if (!hasContext(SEMESTER)) throw new Error('Editing store not initialized');
    return getContext<Store>(SEMESTER);
}
