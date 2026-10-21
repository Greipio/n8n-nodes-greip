import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { greipApiPost } from '../../helpers/api';

export async function profanityDetection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const text = this.getNodeParameter('text', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
	};

	const body: Record<string, string> = {
		text,
		source: 'n8n',
	};

	if (typeof additionalFields.mode === 'boolean' && additionalFields.mode) {
		body.mode = 'test';
	}

	return greipApiPost(this, 'score/text', body, index);
}
