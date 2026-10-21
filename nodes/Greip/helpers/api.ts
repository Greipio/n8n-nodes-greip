import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';

export const GREIP_API_BASE_URL = 'https://v2.greipapi.com';

export const JSON_HEADERS = {
	Accept: 'application/json',
	'Content-Type': 'application/json',
};

export type CommonAdditionalFields = {
	mode?: boolean;
	userID?: string;
};

export function applyCommonQueryParams(
	qs: Record<string, string>,
	additionalFields: CommonAdditionalFields,
): void {
	if (typeof additionalFields.mode === 'boolean' && additionalFields.mode) {
		qs.mode = 'test';
	}
	if (additionalFields.userID) {
		qs.user_id = additionalFields.userID;
	}
	qs.source = 'n8n';
}

export function v2Url(path: string): string {
	return `${GREIP_API_BASE_URL}/${path.replace(/^\//, '')}`;
}

export async function greipApiGet(
	ctx: IExecuteFunctions,
	path: string,
	qs: Record<string, string>,
	index: number,
): Promise<INodeExecutionData> {
	const options: IHttpRequestOptions = {
		method: 'GET',
		url: v2Url(path),
		headers: JSON_HEADERS,
		qs,
		json: true,
	};

	const response = await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'greipApi', options);

	return {
		json: response,
		pairedItem: { item: index },
	};
}

export async function greipApiPost(
	ctx: IExecuteFunctions,
	path: string,
	body: Record<string, unknown>,
	index: number,
): Promise<INodeExecutionData> {
	const options: IHttpRequestOptions = {
		method: 'POST',
		url: v2Url(path),
		headers: JSON_HEADERS,
		body,
		json: true,
	};

	const response = await ctx.helpers.httpRequestWithAuthentication.call(ctx, 'greipApi', options);

	return {
		json: response,
		pairedItem: { item: index },
	};
}
