<script lang="ts">
    import { AppBar, AppRail, AppRailAnchor, AppShell } from '@skeletonlabs/skeleton';
    import { studentId } from '$lib/stores/CurriculumStores';
    import * as SemStore from '$lib/stores/SemesterStores';
    import { page } from '$app/stores';
    import icon from '$lib/assets/icon.png';

    // initialize sem store
    SemStore.init();

    // const course: string = 'BS Computer Science';
    let studentNumber: string = '';

    studentId.subscribe((value) => {
        studentNumber = value;
    });
</script>

<!-- Refer to the Skeleton Documentation to know what the following components are for. -->
<AppShell class="bg-surface-500">
    <AppRail
        slot="sidebarLeft"
        width="w-28"
        gap="gap-5"
        regionLead="flex justify-center items-center p-2"
        background="bg-secondary-500 text-slate-400/45"
        active="bg-tertiary-500/50 text-white"
    >
        <img src={icon} alt="Icon" slot="lead" class="size-24" />
        <AppRailAnchor href="/student/dashboard" selected={$page.url.pathname === '/student/dashboard'}>
            <span class="text-sm">Dashboard</span>
        </AppRailAnchor>
        <AppRailAnchor href="/student/curriculum" selected={$page.url.pathname === '/student/curriculum'}>
            <span class="text-sm">Curriculum</span>
        </AppRailAnchor>
        <AppRailAnchor href="/student/grades" selected={$page.url.pathname === '/student/grades'}>
            <span class="text-sm">Grades</span>
        </AppRailAnchor>

        <AppRailAnchor href="../../" slot="trail">
            <span class="text-sm">Log-out</span>
        </AppRailAnchor>
    </AppRail>

    <!-- Router Slot -->
    <slot />
    <!-- ---- / ---- -->
</AppShell>
