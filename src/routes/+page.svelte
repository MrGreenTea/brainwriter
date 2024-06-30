<script lang="ts">
	import { source } from 'sveltekit-sse';
	import type { Page } from '$lib/data';

	const currentRound = source('/api').select('round');
	const pages = source('/api')
		.select('pages')
		.json(function or({ error, raw, previous }) {
			console.error(`Could not parse "${raw}" as json.`, error);
			return previous; // This will be the new value of the store
		});
	import type { PageData } from './$types';
	import { derived } from 'svelte/store';
	export let data: PageData;
	const { page: initialPage, currentRound: initialRound } = data;
	let { ideasPerRound } = initialPage;

	const page = derived(
		pages,
		(pages) => pages?.find((p: Page) => p.sessionId === initialPage.sessionId) || initialPage
	);
	const writtenIdeas = derived(page, (page) => page?.writtenIdeas || []);

	let newIdeas = new Array(ideasPerRound).fill('');
	$: newIdeaCount = newIdeas.filter((idea) => idea.trim() !== '').length;
</script>

<h1>Brainwriting session - Round {$currentRound || initialRound}</h1>

<div>
	{#each $writtenIdeas as idea}
		<p>{idea}</p>
	{/each}
</div>

{#if $page.submitted}
	<p>Waiting for others to submit</p>
{:else}
	<form method="POST">
		<fieldset name="ideas">
			{#each newIdeas as idea, i}
				<div>
					<input required name={`idea${i}`} bind:value={idea} />
				</div>
			{/each}
		</fieldset>

		<button
			disabled={newIdeaCount < ideasPerRound}
			class="disabled:cursor-not-allowed disabled:text-gray-500"
			type="submit">Submit</button
		>
	</form>
{/if}
