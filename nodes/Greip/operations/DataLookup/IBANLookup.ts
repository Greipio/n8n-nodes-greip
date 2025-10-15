import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function ibanLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const iban = this.getNodeParameter('iban', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: { [key: string]: string } = {
		iban,
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
		url: 'https://greipapi.com/lookup/iban',
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
