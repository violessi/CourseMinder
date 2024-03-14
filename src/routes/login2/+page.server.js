import { redirect } from '@sveltejs/kit';

/** @type {import ('./$types').Actions} */
export const actions = {
    default: async ({ cookies, request }) => {
        const formData = await request.formData();
        const email = formData.get('email');
        const password = formData.get('password');

        if (email === '2020@12345' && password === 'password') {
            cookies.set('access', 'true', { path: '/', sameSite: 'strict' });
            //throw redirect(302, '/student/dashboard');
        }

        return {
            email,
            message: 'Student Number or Password is not valid',
        };
    },
};
