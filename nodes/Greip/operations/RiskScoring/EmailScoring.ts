import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function emailScoring(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const email = this.getNodeParameter('email', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		email,
	};

	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}
	if (additionalFields.userID) {
		qs.userID = additionalFields.userID;
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/scoring/email',
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
			debug: { email, additionalFields, qs, options },
			response,
		},
		pairedItem: { item: index },
	};
}
