import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function asnLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const asn = this.getNodeParameter('asn', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		asn,
	};

	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/asn',
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
		json: {
			debug: { asn, additionalFields, qs, options },
			response,
		},
		pairedItem: { item: index },
	};
}
