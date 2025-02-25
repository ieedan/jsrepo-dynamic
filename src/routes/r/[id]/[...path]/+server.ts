import { blocks } from '$lib/data.js';
import { error, text } from '@sveltejs/kit';

export const GET = ({ params }) => {
	const { id, path: filePath } = params;

	const block = blocks[parseInt(id)];

	if (!block) throw error(404, 'Invalid id!');

	if (filePath === 'jsrepo-manifest.json') {
		return text(JSON.stringify(block.manifest));
	}

	const file = block.files[filePath];

	if (!file) throw error(404, `Couldn't find ${filePath}`);

	return text(file);
};
