<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { Page } from '$lib/data';
	import type { PageData } from './$types';
	import { derived, type Readable } from 'svelte/store';
	import PageComponent from '$lib/components/Page.svelte';

	const currentRound = source('/api').select('round');
	const pages = source('/api')
		.select('pages')
		.json(function or({ error, raw, previous }) {
			console.error(`Could not parse "${raw}" as json.`, error);
			return previous; // This will be the new value of the store
		});
	export let data: PageData;
	const { page: initialPage, currentRound: initialRound } = data;
	let { ideasPerRound } = initialPage;

	const page: Readable<Page> = derived(
		pages,
		(pages) => pages?.find((p: Page) => p.sessionId === initialPage.sessionId) || initialPage
	);

	let newIdeas = new Array(ideasPerRound).fill('');
	$: newIdeaCount = newIdeas.filter((idea) => idea.trim() !== '').length;
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-6 p-6">
	<header class="border-b bg-card p-4">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<h1 class="text-2xl font-bold">Collaborative Ideation</h1>
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2 text-primary">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="h-5 w-5"
						><line x1="10" x2="14" y1="2" y2="2"></line><line x1="12" x2="15" y1="14" y2="11"
						></line><circle cx="12" cy="14" r="8"></circle></svg
					><span class="text-lg font-medium">5:00</span>
				</div>
				<a
					href="/all"
					class="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>End Session</a
				>
			</div>
		</div>
	</header>
	<PageComponent
		page={$page || initialPage}
		title="Previous Ideas"
		subtitle={`Current Round: ${$currentRound || initialRound}`}
	/>
	{#if $page.submitted}
		<p class="text-sm text-muted-foreground">
			Waiting for others to submit their ideas before moving to next round.
		</p>
	{:else}
		<form class="grid grid-cols-1 gap-4" method="POST">
			<div class="bg-background rounded-lg border p-4">
				<h2 class="mb-4 text-lg font-semibold">New Ideas</h2>
				<div class="grid grid-cols-1 gap-3">
					{#each newIdeas as idea, i}
						<div>
							<input
								class="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								required
								name={`idea${i}`}
								bind:value={idea}
								placeholder="Idea {i + 1}"
							/>
						</div>
					{/each}
					<div class="flex justify-end">
						<button
							class="ring-offset-background focus-visible:ring-ring inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
							type="submit"
							disabled={newIdeaCount < ideasPerRound}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</form>
	{/if}
</div>
