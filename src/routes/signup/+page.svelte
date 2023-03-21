<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const { form: sform, errors } = superForm(data.form);
</script>

<form method="POST" use:enhance>
	<hgroup>
		<h2>Register</h2>
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

	<button type="submit">Register</button>
	{#if form?.errorMessage}
		<span class="text-sm font-semibold text-red-500">
			{form.errorMessage}
		</span>
	{/if}
</form>
<p>Already have an account? <a href="/login">Login</a></p>
