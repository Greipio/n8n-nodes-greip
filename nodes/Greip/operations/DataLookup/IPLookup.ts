import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function ipLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const ip = this.getNodeParameter('ip', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		lang?: string;
		mode?: boolean;
		params?: string[];
		userID?: string;
	};

	const qs: { [key: string]: string } = {
		ip,
	};

	if (additionalFields.lang) {
		qs.lang = additionalFields.lang;
	}
	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			qs.mode = 'test';
		}
	}
	if (additionalFields.params && additionalFields.params.length > 0) {
		qs.params = additionalFields.params.join(',');
	}
	if (additionalFields.userID) {
		qs.userID = additionalFields.userID;
	}

	qs.source = 'n8n';

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://greipapi.com/lookup/ip',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'greipApi', options);

	return {
		json: {
			response,
		},
		pairedItem: { item: index },
	};
}
