import {
	IDataObject,
	IHookFunctions,
	IHttpRequestOptions,
	JsonObject,
	NodeApiError,
} from 'n8n-workflow';

import { GREIP_API_BASE_URL, JSON_HEADERS } from '../../Greip/helpers/api';

type GreipWebhookRecord = {
	id?: string | number;
	url?: string;
	webhook_url?: string;
};

function v2Url(path: string): string {
	return `${GREIP_API_BASE_URL}/${path.replace(/^\//, '')}`;
}

function getHttpStatusCode(error: unknown): number | undefined {
	if (error instanceof NodeApiError) {
		const code = error.httpCode;
		if (typeof code === 'number') {
			return code;
		}
		if (typeof code === 'string') {
			const parsed = Number.parseInt(code, 10);
			if (!Number.isNaN(parsed)) {
				return parsed;
			}
		}
	}

	const json = error as JsonObject;
	if (typeof json.statusCode === 'number') {
		return json.statusCode;
	}
	if (typeof json.httpCode === 'number') {
		return json.httpCode;
	}

	const response = json.response as IDataObject | undefined;
	if (response && typeof response.statusCode === 'number') {
		return response.statusCode;
	}

	return undefined;
}

function isWebhookNotFoundError(error: unknown): boolean {
	return getHttpStatusCode(error) === 404;
}

async function greipApiRequest(
	ctx: IHookFunctions,
	method: IHttpRequestOptions['method'],
	path: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method,
		url: v2Url(path),
		headers: JSON_HEADERS,
		json: true,
		body,
	};

	let response: IDataObject;

	try {
		response = (await ctx.helpers.httpRequestWithAuthentication.call(
			ctx,
			'greipApi',
			options,
		)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(ctx.getNode(), error as JsonObject);
	}

	if (response.success === false) {
		throw new NodeApiError(ctx.getNode(), response as JsonObject);
	}

	return response;
}

function getWebhooksFromResponse(response: IDataObject): GreipWebhookRecord[] {
	const data = response.data;

	if (Array.isArray(data)) {
		return data as GreipWebhookRecord[];
	}

	if (data && typeof data === 'object') {
		const webhooks = (data as IDataObject).webhooks;
		if (Array.isArray(webhooks)) {
			return webhooks as GreipWebhookRecord[];
		}
	}

	return [];
}

function getWebhookUrl(webhook: GreipWebhookRecord): string | undefined {
	return webhook.url ?? webhook.webhook_url;
}

function getWebhookId(response: IDataObject): string | number | undefined {
	const data = response.data;

	if (!data || typeof data !== 'object') {
		return undefined;
	}

	const record = data as IDataObject;
	const webhook = record.webhook as IDataObject | undefined;
	const id = record.id ?? record.webhook_id ?? record.webhookId ?? webhook?.id;

	if (typeof id === 'string' || typeof id === 'number') {
		return id;
	}

	return undefined;
}

export async function checkGreipWebhookExists(ctx: IHookFunctions): Promise<boolean> {
	const webhookUrl = ctx.getNodeWebhookUrl('default');
	const webhookData = ctx.getWorkflowStaticData('node');
	const response = await greipApiRequest(ctx, 'GET', 'account/webhooks');

	for (const webhook of getWebhooksFromResponse(response)) {
		if (getWebhookUrl(webhook) === webhookUrl && webhook.id !== undefined) {
			webhookData.webhookId = webhook.id;
			return true;
		}
	}

	return false;
}

export async function createGreipWebhook(ctx: IHookFunctions): Promise<boolean> {
	const webhookUrl = ctx.getNodeWebhookUrl('default');
	const webhookData = ctx.getWorkflowStaticData('node');

	const response = await greipApiRequest(ctx, 'POST', 'account/webhooks', {
		url: webhookUrl,
		source: 'n8n',
	});

	const webhookId = getWebhookId(response);

	if (webhookId === undefined) {
		return false;
	}

	webhookData.webhookId = webhookId;

	return true;
}

export async function deleteGreipWebhook(ctx: IHookFunctions): Promise<boolean> {
	const webhookData = ctx.getWorkflowStaticData('node');
	const webhookId = webhookData.webhookId as string | number | undefined;

	if (webhookId === undefined) {
		return true;
	}

	try {
		await greipApiRequest(ctx, 'DELETE', `account/webhooks/${webhookId}`);
	} catch (error) {
		// Greip may already have removed this webhook (404); treat as success.
		if (isWebhookNotFoundError(error)) {
			delete webhookData.webhookId;
			return true;
		}

		throw error;
	}

	delete webhookData.webhookId;

	return true;
}
