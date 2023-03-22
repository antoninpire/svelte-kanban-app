<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;

	const { form: sform, errors } = superForm(data.form);
</script>

<main class="gradient flex h-screen w-screen items-center justify-center">
	<form method="POST" class="flex w-[18rem] flex-col" use:enhance>
		<h2 class="text-4xl font-bold text-white">Sign Up</h2>

		<fieldset class="mt-7 flex flex-col gap-1">
			<label class="font-semibold text-gray-300" for="email">Email</label>
			<Input
				type="email"
				id="email"
				name="email"
				bind:value={$sform.email}
				placeholder="mail@example.com"
				required
			/>
			{#if $errors.email}
				<span class="-mb-4 mt-2 text-center text-sm font-semibold text-red-500">
					{$errors.email}
				</span>
			{/if}
		</fieldset>

		<fielset class="mt-5 flex flex-col gap-1">
			<label class="font-semibold text-gray-300" for="password">Password</label>
			<Input
				type="password"
				id="password"
				name="password"
				bind:value={$sform.password}
				required
				placeholder="*************"
			/>
			{#if $errors.password}
				<span class="mt-2 -mb-4 text-center text-sm font-semibold text-red-500">
					{$errors.password}
				</span>
			{/if}
		</fielset>

		{#if form?.errorMessage}
			<span class="mt-3 -mb-4 text-center text-sm font-semibold text-red-500">
				{form.errorMessage}
			</span>
		{/if}

		<div class="mt-8 flex items-center justify-center">
			<Button>Sign Up</Button>
		</div>

		<span class="mt-6 text-center text-sm font-medium text-gray-300"
			>Already have an account? <a
				href="/login"
				class="text-primary hover:text-primary/90">Login</a
			></span
		>
	</form>
</main>

<svelte:head>
	<title>Sign Up</title>
</svelte:head>
