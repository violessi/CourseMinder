<script lang="ts">
    import { Semester } from '$lib/models/types';
    // eslint-disable-next-line init-declarations
    export let data: Semester;
    $: ({ id, details } = data);
    $: ({ sem, year, units, gwa } = details);
</script>

<a
    class="block card card-hover p-5 variant-filled-primary shadow-md border border-tertiary-300"
    href="/student/grades/{id}"
>
    <div class="">{sem ?? '--'}, AY {year ?? '----'}</div>
    <div class="">{units ?? 0} units</div>
    <div class="font-bold text-xl pt-2">GWA: {gwa ?? 0}</div>
</a>
