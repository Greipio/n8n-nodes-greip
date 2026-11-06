import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function phoneScoring(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const phone = this.getNodeParameter('phone', index) as string;
	const countryCode = this.getNodeParameter('countryCode', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: { [key: string]: string } = {
		phone,
		countryCode,
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
		url: 'https://greipapi.com/scoring/phone',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		qs,
		json: true,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'greipApi', options);

	return {
		json: response,
		pairedItem: { item: index },
	};
}
