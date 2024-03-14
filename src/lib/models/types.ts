import { type Output, array, enum_, nullable, number, object, pick, safeInteger, string, toUpperCase } from 'valibot';

export enum SemType {
    first = '1st Semester',
    second = '2nd Semester',
    midyear = 'Midyear',
}

export const SemDetails = object({
    sem: enum_(SemType),
    year: string(),
    gwa: nullable(number()),
    units: nullable(number([safeInteger()])),
});
export type SemDetails = Output<typeof SemDetails>;

export const Subject = object({
    className: string([toUpperCase()]),
    grade: number(),
    units: number([safeInteger()]),
});

export type Subject = Output<typeof Subject>;

export const Semester = object({
    id: string(),
    details: SemDetails,
    subjects: array(Subject),
});
export type Semester = Output<typeof Semester>;

export const AddSem = pick(SemDetails, ['sem', 'year']);
export type AddSem = Output<typeof AddSem>;
