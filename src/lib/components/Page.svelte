<script lang="ts">
	import type { Page } from '$lib/data';
	export let page: Page;
	export let title: string = 'Page';
	export let subtitle: string | null = null;
</script>

<div class="bg-background overflow-hidden rounded-lg border border-muted">
	<div class="mb-4 flex items-center justify-between bg-primary px-4 py-2 text-primary-foreground">
		<h2 class="text-lg font-bold">{title}</h2>
		{#if subtitle}<div class="text-sm text-muted">{subtitle}</div>{/if}
	</div>
	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
		{#each page.writtenIdeas as idea}
			<div class="overflow-hidden rounded-lg bg-card shadow-md">
				<div class="p-4">
					<p class="mb-4 text-muted-foreground">{idea}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
