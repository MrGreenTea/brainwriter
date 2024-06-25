<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div>
	<h1>All</h1>
	<ul>
		{#each data.pages as page, i}
			<li>
				<h3 class="text-xl font-bold">Page {i}</h3>
				{#each page.writtenIdeas as idea}
					<p>{idea}</p>
				{/each}
			</li>
		{/each}
	</ul>
</div>
