<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const { form: sform, errors } = superForm(data.form);
</script>

<form method="POST" class="flex max-w-lg flex-col" use:enhance>
	<hgroup>
		<h2>Login</h2>
		<h3>Welcome back!</h3>
	</hgroup>
	<label for="email">Email</label>
	<input
		type="email"
		id="email"
		name="email"
		bind:value={$sform.email}
		required
	/>
	{#if $errors.email}
		<span class="text-sm font-semibold text-red-500">
			{$errors.email}
		</span>
	{/if}

	<label for="password">Password</label>
	<input
		type="password"
		id="password"
		name="password"
		bind:value={$sform.password}
		required
	/>
	{#if $errors.password}
		<span class="text-sm font-semibold text-red-500">
			{$errors.password}
		</span>
	{/if}

	<button type="submit" class="mt-3 rounded bg-blue-400 p-2">Login</button>
	{#if form?.errorMessage}
		<span class="text-sm font-semibold text-red-500">
			{form.errorMessage}
		</span>
	{/if}
</form>
<p>Don't have an account? <a href="/signup">Signup</a></p>
