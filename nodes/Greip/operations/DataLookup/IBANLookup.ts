import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function ibanLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const iban = this.getNodeParameter('iban', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: string;
		userID?: string;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		iban,
	};

	if (additionalFields.mode) {
		qs.mode = additionalFields.mode;
	}
	if (additionalFields.userID) {
		qs.userID = additionalFields.userID;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/iban',
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