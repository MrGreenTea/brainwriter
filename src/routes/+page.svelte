<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	const { page } = data;
	let { writtenIdeas, sessionId, newIdeaCount, ideasPerRound } = page;

	let newIdeas = new Array(ideasPerRound).fill('');
</script>

<h1>Brainwriting session</h1>
<h2>User: {sessionId}</h2>

<div>
	{#each writtenIdeas as idea}
		<p>{idea}</p>
	{/each}
</div>

<form method="POST">
	<fieldset name="ideas">
		{#each newIdeas as idea, i}
			<div>
				<input required name={`idea${i}`} bind:value={idea} />
			</div>
		{/each}
	</fieldset>

	<button type="submit">Submit</button>
</form>
