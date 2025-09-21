import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function profanityDetection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const text = this.getNodeParameter('text', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		listBadWords?: string;
		mode?: string;
		scoreOnly?: string;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		text,
	};

	if (additionalFields.listBadWords) {
		qs.listBadWords = additionalFields.listBadWords;
	}
	if (additionalFields.mode) {
		qs.mode = additionalFields.mode;
	}
	if (additionalFields.scoreOnly) {
		qs.scoreOnly = additionalFields.scoreOnly;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/scoring/profanity',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${credentials.apiKey}`,
		},
		qs,
		json: true,
	};

	const response = await this.helpers.httpRequest(options);

	return {
		json: response,
		pairedItem: { item: index },
	};
}