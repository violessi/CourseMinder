import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  test.setTimeout(100000);
  
  // enter the app website
  await page.goto('https://courseminder.vercel.app/');
  
  // check if on main page
  await expect(page.getByRole('heading', { name: 'CourseMinder' })).toHaveText("CourseMinder");

  // sample of a signup of existing user with incomplete information
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('link', { name: 'Student' }).click();
  await page.locator('#degree').selectOption('Computer Science');
  await page.getByPlaceholder('Full Name').click();
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('J');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim ');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim O');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim Oscares');
  await page.getByPlaceholder('Student Number').click();
  await page.getByPlaceholder('Student Number').fill('201908261');
  await page.getByRole('button', { name: 'SIGN UP' }).click();
  
  // check if the error message pops up 
  await page.getByText('Please fill-up all fields.').click();

  // add the necessary missing details 
  await page.getByPlaceholder('Password').fill('123456789');
  
  // try logging in with existing user
  await page.getByRole('link', { name: 'Login here.' }).click();

  await page.getByRole('button', { name: 'LOGIN' }).click();
  await page.getByText('Student Number or Password is').click();

  // proper login
  await page.getByPlaceholder('Student Number').click();
  await page.getByPlaceholder('Student Number').fill('201908261');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('jim123456789');
  await page.getByRole('button', { name: 'LOGIN' }).click();

  // check if we are on the student dashboard
  await page.getByText('Welcome, Bea!').click();

  // check if we can see curriculum page, and 3 random courses
  await page.getByRole('link', { name: 'Curriculum' }).click();
  await page.getByRole('button', { name: 'CS 140' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'CS 155' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'CS 140' }).click();

  // check if we can see the information of sample: CS 140
  await page.getByText('Course Title: Operating').click();
  await page.getByRole('button', { name: 'Close' }).click();

  // check if we can add a semester
  await page.getByRole('link', { name: 'Grades' }).click();
  await page.getByRole('button', { name: 'Add Semester' }).click();
  await page.getByRole('option', { name: '1st Semester' }).click();
  await page.getByPlaceholder('YYYY-YYYY').fill('2023-2024');
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('link', { name: '1st Semester, AY 2023-2024 0' }).click();

  // check if we can add a grade from a class CS 140

  await page.getByRole('button', { name: 'Add Class' }).click();
  await page.getByPlaceholder('Enter class name...').click();
  await page.getByPlaceholder('Enter class name...').fill('');
  await page.getByPlaceholder('Enter class name...').press('CapsLock');
  await page.getByPlaceholder('Enter class name...').fill('CS 140');
  await page.getByPlaceholder('Enter class grade...').click();
  await page.getByPlaceholder('Enter class grade...').fill('1.00');
  await page.getByPlaceholder('Enter class units...').click();
  await page.getByPlaceholder('Enter class units...').fill('4.0');
  await page.getByRole('button', { name: 'Done' }).click();
  
  // check if it is the proper subject
  await page.getByRole('gridcell', { name: 'CS' }).click();

  // check if it is the proper grade
  await page.getByRole('gridcell', { name: '1', exact: true }).click();

  // check if it is the proper units
  await page.getByRole('gridcell', { name: '4', exact: true }).click();
  
  // logout from the student side
  await page.getByRole('link', { name: 'Log-out' }).click();

  // check if we go back to the start page
  await page.getByRole('heading', { name: 'CourseMinder' }).click();

  // section for sample signup of faculty
  // Note that this will always work because there is no checking for faculty yet
  await page.getByRole('link', { name: 'Sign Up' }).click();
  await page.getByRole('link', { name: 'Faculty' }).click();
  await page.locator('#degree').selectOption('Department of Computer Science');
  await page.getByPlaceholder('Full Name').click();
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('J');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim ');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim O');
  await page.getByPlaceholder('Full Name').press('CapsLock');
  await page.getByPlaceholder('Full Name').fill('Jim Oscares');
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('jimoscares@gmail.com');
  await page.getByPlaceholder('Password').click();
  await page.getByPlaceholder('Password').fill('123456789');
  await page.getByRole('button', { name: 'SIGN UP' }).click();
  await page.getByRole('link', { name: 'Statistics' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();


  await page.getByRole('link', { name: 'Log-out' }).click();

  // try logging in with the wrong expected values
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Faculty' }).click();
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').fill('try@gmail.com');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('1234');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  // error message check 
  await expect(page.getByText('Email or Password is not valid')).toHaveText('Email or Password is not valid');

  // try logging in with the expected values
  await page.getByPlaceholder('Email').click();
  await page.getByPlaceholder('Email').press('Control+a');
  await page.getByPlaceholder('Email').fill('faculty@gmail.com');
  await page.getByPlaceholder('Email').press('Tab');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: 'LOGIN' }).click();
  // check if we are on the faculty dashboard
  await page.getByRole('link', { name: 'Statistics' }).click();
  await page.getByRole('link', { name: 'Dashboard' }).click();
  await page.getByRole('link', { name: 'Log-out' }).click();
});