import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function ipScoring(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const ip = this.getNodeParameter('ip', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const credentials = await this.getCredentials('greipApi');

	const qs: { [key: string]: string } = {
		ip,
	};

	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}
	if (additionalFields.userID) {
		qs.userID = additionalFields.userID;
	}

	qs.source = 'n8n';

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/ip/threats',
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
