<script lang="ts">
	import Page from '$lib/components/Page.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="container mx-auto px-4 py-8 md:px-6">
	<h1 class="mb-6 text-3xl font-bold">Brainwriting Ideas</h1>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each data.pages as page, i}
			<Page title={`Page ${i + 1}`} {page} />
		{/each}
	</div>
</div>
