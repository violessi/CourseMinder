<script lang="ts">
    import { getDatabase, ref, set, get } from 'firebase/database';
    import { studentId, studentDegree } from '$lib/stores/CurriculumStores';
    import { goto } from '$app/navigation';
    import icon2 from '$lib/assets/icon2.png';
    import { initializeApp } from 'firebase/app';

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

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    let degree = '';
    let name = '';
    let studentnumber = '';
    let password = '';
    let errorMessage = '';

    async function writeStudentData(studentnumber: string, name: string, degree: string, password: string) {
        const db = getDatabase(app);
        const reference = ref(db, 'students/' + studentnumber);

        // Check if the student already exists
        const snapshot = await get(reference);
        if (snapshot.exists()) {
            // The student already exists, handle this case as needed
            errorMessage = 'A student with this number already exists.';
        } else {
            // The student doesn't exist, write the data
            set(reference, {
                studentid: studentnumber,
                name: name,
                degree: degree,
                password: password,
            });
            studentId.set(studentnumber);
            studentDegree.set(degree);
            goto(`../student/dashboard`);
        }
    }
    const handleSubmit = () => {
        // Check if all fields are filled
        if (degree && name && studentnumber && password) {
            writeStudentData(studentnumber, name, degree, password);
        } else {
            // Handle the case when not all fields are filled
            // You can show an error message or do something else
            errorMessage = 'Please fill-up all fields.';
        }
    };
</script>

<div class="background">
    <div class="black-film h-full">
        <p>&nbsp</p>
        <img src={icon2} alt="Icon" class="w-20 h-11 ml-4" />
        <p class="font-michroma mt-0 text-[9px] ml-4">CourseMinder</p>
        <div class="SignUpContainer">
            <form class="max-w-sm mx-auto" on:submit|preventDefault={handleSubmit}>
                <div class="CreateAccountShape">
                    <p class="TTCommons-Regular-14">CREATE ACCOUNT</p>
                </div>
                <br />
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            class="w-4 h-4 text-gray-800 dark:text-gray"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 2a3 3 0 0 0-3 3v1H5a3 3 0 0 0-3 3v2.4l1.4.7a7.7 7.7 0 0 0 .7.3 21 21 0 0 0 16.4-.3l1.5-.7V9a3 3 0 0 0-3-3h-2V5a3 3 0 0 0-3-3h-4Zm5 4V5c0-.6-.4-1-1-1h-4a1 1 0 0 0-1 1v1h6Zm6.4 7.9.6-.3V19a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-5.4l.6.3a10 10 0 0 0 .7.3 23 23 0 0 0 18-.3h.1L21 13l.4.9ZM12 10a1 1 0 1 0 0 2 1 1 0 1 0 0-2Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <select
                        id="degree"
                        class="bg-green-50 text-green-900 text-sm rounded-lg block w-full ps-10 p-2.5 dark:bg-green-100 dark:border-green-600 dark:placeholder-gray-400 dark:text-green dark:focus:ring-green-500 dark:focus:border-green-500"
                        bind:value={degree}
                    >
                        <option disabled selected value="">Degree Program</option>
                        <option>Computer Science</option>
                        <option>Civil Engineering</option>
                    </select>
                </div>
                <br />
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            class="w-4 h-4 text-gray-800 dark:text-gray"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="email-address-icon"
                        class="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-green-100 dark:border-green-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500"
                        placeholder="Full Name"
                        bind:value={name}
                    />
                </div>
                <br />
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            class="w-4 h-4 text-gray-800 dark:text-gray"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                d="M2 5.6V18c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2V5.6l-.9.7-7.9 6a2 2 0 0 1-2.4 0l-8-6-.8-.7Z"
                            />
                            <path d="M20.7 4.1A2 2 0 0 0 20 4H4a2 2 0 0 0-.6.1l.7.6 7.9 6 7.9-6 .8-.6Z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="email-address-icon"
                        class="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-green-100 dark:border-green-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500"
                        placeholder="Student Number"
                        bind:value={studentnumber}
                    />
                </div>
                <br />
                <div class="relative">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                        <svg
                            class="w-4 h-4 text-gray-800 dark:text-gray"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M8 10V7a4 4 0 1 1 8 0v3h1a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7c0-1.1.9-2 2-2h1Zm2-3a2 2 0 1 1 4 0v3h-4V7Zm2 6c.6 0 1 .4 1 1v3a1 1 0 1 1-2 0v-3c0-.6.4-1 1-1Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <input
                        type="password"
                        id="email-address-icon"
                        class="bg-green-50 border border-green-300 text-green-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full ps-10 p-2.5 dark:bg-green-100 dark:border-green-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500"
                        placeholder="Password"
                        bind:value={password}
                    />
                </div>
                <div class="error">{errorMessage}</div>

                <p class="TTCommons-Regular-14">
                    <br />
                    Already have an account? <a class="hyperlink" href="/login2">Login here.</a>
                </p>
                <br />
                <div class="SignupButtonShape">
                    <button type="submit" class="SignupButton"> SIGN UP </button>
                </div>
            </form>
            <div class="SignUpRightContainer">
                <p class="TTCommons-Regular-14">
                    <br />
                    WELCOME TO COURSEMINDER!
                </p>
            </div>
        </div>
    </div>
</div>

<style>
    .background {
        background-image: url('$lib/assets/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
        height: 100%;
    }

    .black-film {
        background-color: rgba(0, 0, 0, 0.5);
    }

    .hyperlink {
        color: #226004;
    }

    .error {
        color: red;
    }

    .font-michroma {
        font-family: 'Michroma', sans-serif;
        font-weight: 400;
        font-style: normal;
    }

    .TTCommons-Regular-14 {
        font-family: Arial;
        font-size: 14px;
        color: black;
        letter-spacing: -0.04em;
    }

    .SignUpContainer {
        border: 4px solid #284c3b;
        border-radius: 25px;
        background: linear-gradient(to right, #ffffff 50%, rgba(177, 226, 197, 0.4) 0%);
        display: flex;
        align-items: center;
        text-align: center;
        left: 0px;
        margin-top: 10px;
        margin-left: 180px;
        margin-right: 270px;
    }

    .SignUpRightContainer {
        width: auto;
        height: 500px;
        display: flex;
        margin: 0 auto;
        align-items: top;
        text-align: center;
        background-image: url('$lib/assets/girl.png');
        background-position: 100%;
        background-size: contain;
        background-repeat: no-repeat;
        justify-content: center;
    }

    .SignupButton {
        background-color: #507858;

        cursor: pointer;

        font-family: Arial Bold;
        font-weight: 600;
        border-radius: 5px;
        box-shadow: none;
        color: #f8fafc;
        line-height: 20px;
        height: 54px;

        border: 1px solid transparent;
        width: 75%;
        font-size: 25px;
        text-align: center;
        display: block;
        margin: 0 auto;

        justify-content: center;
    }

    .CreateAccountShape {
        background-color: #86d295;
        border-radius: 25px;
        height: 50px;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 12px 0;
    }
</style>
