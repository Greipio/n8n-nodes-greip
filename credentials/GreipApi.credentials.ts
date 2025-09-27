import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GreipApi implements ICredentialType {
	name = 'greipApi';
	displayName = 'Greip API';
	documentationUrl = 'https://docs.greip.io/knowledge-base/account-management/obtaining-api-key';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			url: 'https://greipapi.com/bearer',
			method: 'GET',
			qs: {
				source: 'n8n',
			},
		},
	};
}
