<script lang="ts">
    import '../app.postcss';
    import { Modal, type ModalComponent, initializeStores } from '@skeletonlabs/skeleton';
    import AddGrade from '$lib/components/AddGrade.svelte';
    import AddSem from '$lib/components/AddSem.svelte';

    initializeStores();

    const modalRegistry: Record<string, ModalComponent> = {
        addsem: { ref: AddSem },
        addgrade: { ref: AddGrade },
    };
</script>

<Modal components={modalRegistry} />
<slot />
