import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function domainLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const domain = this.getNodeParameter('domain', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		domain,
	};

	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}

	qs.source = 'n8n';

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/domain',
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
