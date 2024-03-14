import { SemDetails, Semester, Subjects } from '$lib/models/types';
import { writable } from 'svelte/store';
import { initializeApp } from 'firebase/app';
import { get, getDatabase, ref, set, type DatabaseReference } from 'firebase/database';
import { studentId } from '$lib/stores/CurriculumStores'

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
        const snapshot = await get(semesterRef);
        if (snapshot.exists()) {
            return true;
        } else {
            return false;
        }
    }

    async function writeSemesterData(semesterRef, obg){
        if (!(await isExistingSemester(semesterRef))){
            set(semesterRef, obg);
        }else {
            throw new Error('Semester already exists');
        }
    }

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
        const semesterRef = ref(db, `semesterData/${studentnumber}/${obg.id}`);
        writeSemesterData(semesterRef, obg);                  
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
