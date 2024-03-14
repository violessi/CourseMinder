import { type Writable, writable } from 'svelte/store';

function persist(key : string, initialValue : string) {
    const isBrowser = typeof window !== 'undefined';
    const storedValue = isBrowser ? localStorage.getItem(key) : null;
    const initial = storedValue === null ? initialValue : JSON.parse(storedValue);

    const store : Writable<string> = writable(initial, () => {
        if (isBrowser) {
            const unsubscribe = store.subscribe(($value : string) => {
                localStorage.setItem(key, JSON.stringify($value));
            });

            return unsubscribe;
        }
    });

    return { subscribe: store.subscribe, set: store.set, update: store.update };
}

export const studentId = persist('studentId', '');
export const studentDegree = persist('studentDegree', '');