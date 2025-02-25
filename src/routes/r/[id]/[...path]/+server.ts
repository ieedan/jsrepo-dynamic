import { registries } from '$lib/data.js';
import { error, text } from '@sveltejs/kit';

export const GET = ({ params }) => {
	// filepath is just the catch all param ...path 
	const { id, path: filePath } = params;

	// find the registry from our dummy data
	// this would be where you get this information from a database or generate it
	const registry = registries[parseInt(id)];

	if (!registry) throw error(404, 'Invalid id!');

	// in this case the registry is separate from files so just serve the manifest json
	if (filePath === 'jsrepo-manifest.json') {
		return text(JSON.stringify(registry.manifest));
	}

	// get the content for the requested file
	const file = registry.files[filePath];

	if (!file) throw error(404, `Couldn't find ${filePath}`);

	return text(file);
};
