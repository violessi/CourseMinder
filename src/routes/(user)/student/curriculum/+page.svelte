<script lang="ts">
    import { initializeApp } from "firebase/app";
    import { getDatabase, ref, push, get, child, set, query, equalTo, orderByValue, orderByKey } from "firebase/database"
    import { studentId, studentDegree } from '$lib/stores/CurriculumStores';

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

    // Initialize Firebase and get database
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    let studentnumber;
    studentId.subscribe((value) => {
        studentnumber = value;
    });

    let degree;
    studentDegree.subscribe((value) => {
        degree = value;
    });

    let courses: string[] = [];
    if (degree === 'Computer Science') {
        courses = [
            'CS 10',
            'CS 11',
            'CS 12',
            'CS 30',
            'CS 31',
            'CS 32',
            'CS 33',
            'CS 20',
            'CS 21',
            'CS 140',
            'CS 145',
            ' CS 165',
            'CS 132',
            'CS 136',
            'CS 138',
            'CS 150',
            'CS 153',
            'CS 155',
            'CS 191',
            'CS 192',
            'CS 133',
            'CS 180',
            'CS Elective',
            'CS 194',
            'CS 195',
            'CS 196',
            'CS 198',
            'CS 199',
            'Math 21',
            'Math 22',
            'Math 23',
            'Math 40',
            'Physics 71',
            'Physics 72',
            'Kas 1',
            'Philo 1',
            'Soc Sci 1/2',
            'Eng 13',
            'Eng 30',
            'Speech 30',
            'Fil 40',
            'Engg 150',
            'Free Elective',
            'GE Elective',
            'STS 1/DRMAPS',
            'PI 100',
            'Arts 1',
            'NSTP 1',
            'NSTP 2',
        ];
    } else if (degree === 'Civil Engineering') {
        courses = [
            'Physics 71',
            'Physics 71.1',
            'Chem 16',
            'Chem 16.1',
            'Math 21',
            'Eng 13',
            'Speech 30',
            'Physics 72',
            'Physics 72.1',
            'ES 1',
            'CE 29',
            'Math 22',
            'GE 10',
            'CE 1',
            'CE 41',
            'CE 11',
            'Math 23',
            'CE 24',
            'GE 12',
            'ES 101',
            'NSTP 1',
            'CE 22',
            'CE 31',
            'CE 130',
            'CE 17',
            'CE 25',
            'ES 102',
            'NSTP 2',
            'CE 123',
            'CE 115',
            'CE 141',
            'CE 18',
            'CE 151',
            'CE 162',
            'CE 124',
            'CE 132',
            'CE 116',
            'CE 142',
            'CE 152',
            'CE 163',
            'CE 190',
            'CE 195',
            'CE 199',
            'CE Elective 1',
            'Kas 1',
            'Fil 40',
            'DRMAPS',
            'GE Elective',
            'CE 196',
            'CE Elective 2',
            'Arts 1',
            'Philo 1',
            'Soc Sci 2',
            'PI 100',
        ];
    }
    else if (degree === 'Civil Engineering'){
        courses = ['Physics 71', 'Physics 71.1', 'Chem 16', 'Chem 16.1', 'Math 21', 'Eng 13', 'Speech 30',
                    'Physics 72', 'Physics 72.1', 'ES 1', 'CE 29', 'Math 22', 'GE 10', 'CE 1', 'CE 41', 
                    'CE 11', 'Math 23', 'CE 24', 'GE 12', 'ES 101', 'NSTP 1', 'CE 22', 'CE 31', 'CE 130', 
                    'CE 17', 'CE 25', 'ES 102', 'NSTP 2', 'CE 123', 'CE 115', 'CE 141', 'CE 18', 'CE 151', 
                    'CE 162', 'CE 124', 'CE 132', 'CE 116', 'CE 142', 'CE 152', 'CE 163', 'CE 190', 'CE 195',
                    'CE 199', 'CE Elective 1', 'Kas 1', 'Fil 40', 'DRMAPS', 'GE Elective', 'CE 196',
                    'CE Elective 2', 'Arts 1', 'Philo 1', 'Soc Sci 2', 'PI 100'];
    }

    let showPopup = false;
    let selectedCourse = '';
    let courseTitle = ''
    let courseDescription = '';
    let numUnits = '';
    let prerequisites = '';
    let corequisites = '';

    async function getCourseKey(course : string) {
        console.log(course);
        const q = query(ref(db, 'courseMap'), orderByValue(), equalTo(course));
        const snapshot = await get(q);
        if (snapshot.exists()) {
            let courseKey;
            snapshot.forEach((childSnapshot) => {
                console.log('Child found');
                courseKey = childSnapshot.key;
            });
            console.log(courseKey);
            return courseKey;
        } else {
            console.log('No matching courses.');
        }
    }

    async function getCourseData(courseKey : string | undefined) {
        if (courseKey === null){
            console.log('courseKey is null');
            return
        }
        const courseRef = ref(db, 'courses/' + courseKey);
        const snapshot = await get(courseRef);
        if (snapshot.exists()) {
            let courseData = snapshot.val();
            selectedCourse = courseData.course;
            courseTitle = courseData.title;
            courseDescription = courseData.desc;
            numUnits = courseData.numUnits;
            prerequisites = courseData.prereq;
            corequisites = courseData.coreq;
        } else {
            console.log('No data available');
        }
    }
    

    async function showCoursePopup(course : string) {
        selectedCourse = course;
        showPopup = true;
        let courseKey : string | undefined = await getCourseKey(course);
        getCourseData(courseKey);
    }

    function closePopup() {
        showPopup = false;
    }

    async function makeCourseDirectory() {
        const courseRef = ref(db, `courses`);
        for (let i = 0; i < courses.length; i++) {
            const snapshot = await get(child(courseRef, courses[i]));
            let courseKey;
            if (!snapshot.exists()) {
                let courseData = {
                    course: courses[i],
                    title: courseTitle,
                    desc: courseDescription,
                    numUnits: numUnits,
                    prereq: prerequisites,
                    coreq: corequisites
                };
                const newCourseRef = push(courseRef, courseData);
                courseKey = newCourseRef.key;
                const mapRef = ref(db, 'courseMap/' + courseKey);
                set(mapRef, courses[i]);

            }
        }
    }

    // makeCourseDirectory();

    async function deleteCollection(collectionPath : string) {
        const courseref = ref(db, collectionPath);
        await set(courseref, null);
    }

    // deleteCollection('courses');
    // deleteCollection('courseMap')


</script>
<body>
    <div class="flex-row grid grid-cols-4 p-2 grid-rows-5 gap-4 content-center">
        {#each courses as course (course)}
            <button on:click={() => showCoursePopup(course)} class="bg-secondary-500 rounded-lg p-1.5 text-sm">{course}</button>
        {/each}
    </div>
    
    {#if showPopup}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-4 rounded left-7 w-1/2 items-center justify-center">
                <h2 class="text-emerald-900 text-xl font-bold mb-2"> {selectedCourse}</h2>
                <div class="flex-column">
                    <p class="text-emerald-900"><strong>Course Title:</strong> {courseTitle}</p>
                    <p class="text-emerald-900"><strong>Course Description:</strong> {courseDescription}</p>
                    <p class="text-emerald-900"><strong>Number of Units:</strong> {numUnits}</p>
                    <p class="text-emerald-900"><strong>Prerequisites:</strong> {prerequisites}</p>
                    <p class="text-emerald-900"><strong>Corequisites:</strong> {corequisites}</p>
                </div>
                <button on:click={closePopup} class="bg-red-500 text-white rounded px-2 py-1">Close</button>
            </div>
        </div>
    {/if}
</body>
