import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function countryLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const countryCode = this.getNodeParameter('countryCode', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		params?: string[];
		mode?: boolean;
	};

	const qs: { [key: string]: string } = {
		CountryCode: countryCode,
	};

	if (additionalFields.params && additionalFields.params.length > 0) {
		qs.params = additionalFields.params.join(',');
	}
	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}

	qs.source = 'n8n';

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/country',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	const response = await this.helpers.requestWithAuthentication.call(this, 'greipApi', options);

	return {
		json: response,
		pairedItem: { item: index },
	};
}
