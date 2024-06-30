<script lang="ts">
	import type { Page } from '$lib/data';
	export let page: Page;
	export let title: string = 'Page';
	export let subtitle: string | null = null;
</script>

<div class="bg-background border-muted overflow-hidden rounded-lg border">
	<div class="bg-primary text-primary-foreground mb-4 flex items-center justify-between px-4 py-2">
		<h2 class="text-lg font-bold">{title}</h2>
		{#if subtitle}<div class="text-muted text-sm">{subtitle}</div>{/if}
	</div>
	<div class="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
		{#each page.writtenIdeas as idea}
			<div class="bg-card overflow-hidden rounded-lg shadow-md">
				<div class="p-4">
					<p class="text-muted-foreground mb-4">{idea}</p>
				</div>
			</div>
		{/each}
	</div>
</div>
