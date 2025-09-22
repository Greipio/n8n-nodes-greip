import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function countryLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const CountryCode = this.getNodeParameter('CountryCode', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		params?: string;
		mode?: boolean;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		CountryCode,
	};

	if (additionalFields.params) {
		qs.params = additionalFields.params;
	}
	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/country',
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
			debug: { CountryCode, additionalFields, qs, options },
			response,
		},
		pairedItem: { item: index },
	};
}
