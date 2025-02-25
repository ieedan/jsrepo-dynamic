import { type Manifest } from 'jsrepo';

type SelfContainedRegistry = {
	files: Record<string, string>;
	manifest: Manifest;
};

export const registries: SelfContainedRegistry[] = [
	{
		manifest: {
			categories: [
				{
					name: 'ui',
					blocks: [
						{
							name: 'button',
							directory: 'src/ui/button',
							category: 'ui',
							tests: false,
							subdirectory: true,
							list: true,
							files: ['button.svelte', 'index.ts'],
							localDependencies: ['utils/utils'],
							dependencies: [],
							devDependencies: [
								'lucide-svelte@^0.475.0',
								'bits-ui@1.3.2',
								'tailwind-variants@^0.3.1'
							],
							// these allow you to resolve the paths to other blocks when they are installed
							// the left if the literal import and the right is the template
							_imports_: {
								'$lib/utils/utils.js': '{{utils/utils}}.js'
							}
						}
					]
				},
				{
					name: 'utils',
					blocks: [
						{
							name: 'utils',
							directory: 'src/utils',
							category: 'utils',
							tests: false,
							subdirectory: false,
							list: false,
							files: ['utils.ts'],
							localDependencies: [],
							_imports_: {},
							dependencies: [],
							devDependencies: ['clsx@^2.1.1', 'tailwind-merge@^2.6.0']
						}
					]
				}
			]
		},
		files: {
			'src/ui/button/button.svelte': `<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const buttonVariants = tv({
		base: 'relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline'
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
	export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
			loading?: boolean;
		};
</script>

<script lang="ts">
	import { cn } from '$lib/utils/utils.js';
	import { LoaderCircle } from 'lucide-svelte';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href = undefined,
		type = 'button',
		loading = false,
		disabled = false,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a bind:this={ref} class={cn(buttonVariants({ variant, size }), className)} {href} {...restProps}>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		class={cn(buttonVariants({ variant, size }), className)}
		disabled={disabled || loading}
		{type}
		{...restProps}
	>
		{#if loading}
			<div class="absolute flex size-full place-items-center justify-center bg-inherit">
				<div class="flex animate-spin place-items-center justify-center">
					<LoaderCircle class="size-4" />
				</div>
			</div>
			<span class="sr-only">Loading</span>
		{/if}
		{@render children?.()}
	</button>
{/if}
`,
			'src/ui/button/index.ts': `import Root, {
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant,
	buttonVariants
} from './button.svelte';

export {
	Root,
	type ButtonProps as Props,
	//
	Root as Button,
	buttonVariants,
	type ButtonProps,
	type ButtonSize,
	type ButtonVariant
};
`,
			'src/utils/utils.ts': `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
`
		}
	}
];
