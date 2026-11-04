import {
	IHookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionTypes,
	INodeExecutionData,
} from 'n8n-workflow';

import {
	checkGreipWebhookExists,
	createGreipWebhook,
	deleteGreipWebhook,
} from './helpers/webhooks';

export class GreipTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip Trigger',
		name: 'greipTrigger',
		icon: { light: 'file:greip.svg', dark: 'file:greip.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description:
			'Receive real-time notifications from Greip via webhooks for fraud detection, proxy detection, profanity detection, and more',
		defaults: {
			name: 'Fraud Trigger',
		},
		inputs: [],
		outputs: [
			NodeConnectionTypes.Main, // 0 => Proxy Detection
			NodeConnectionTypes.Main, // 1 => Fraud Payment
			NodeConnectionTypes.Main, // 2 => Profanity
			NodeConnectionTypes.Main, // 3 => Spam Email
			NodeConnectionTypes.Main, // 4 => Spam Phone
		],
		outputNames: ['Proxy Detection', 'Fraud Payment', 'Profanity', 'Spam Email', 'Spam Phone'],
		credentials: [
			{
				displayName: 'Greip API Key',
				name: 'greipApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'greip-webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: 'all',
				options: [
					{ name: 'All Events', value: 'all' },
					{ name: 'Fraud Payment', value: 'fraud_payment' },
					{ name: 'Profanity', value: 'profanity' },
					{ name: 'Proxy Detection', value: 'proxy_detected' },
					{ name: 'Spam Email', value: 'spam_email' },
					{ name: 'Spam Phone', value: 'spam_phone' },
				],
			},
			{
				displayName:
					'When this workflow is activated, the production webhook URL is registered with your Greip account automatically.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return checkGreipWebhookExists(this);
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return createGreipWebhook(this);
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return deleteGreipWebhook(this);
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData();
		const req = this.getRequestObject();

		// Optional: Check User-Agent for extra security
		const userAgent = headers['user-agent'] as string;
		if (!userAgent || !userAgent.includes('Greip-Protocol/v1')) {
			return {
				workflowData: [
					this.helpers.returnJsonArray([
						{
							source: 'Greip',
							node: 'GreipTrigger',
							error: 'Unauthorized: Invalid user agent',
							timestamp: new Date().toISOString(),
						},
					]),
				],
				webhookResponse: {
					status: 401,
					body: { error: 'Unauthorized: Invalid user agent' },
				},
			};
		}

		const receivedEvent = bodyData.event as string;
		const validEvents = [
			'proxy_detected',
			'fraud_payment',
			'profanity',
			'spam_email',
			'spam_phone',
		];

		if (!receivedEvent || !validEvents.includes(receivedEvent)) {
			return {
				workflowData: [
					this.helpers.returnJsonArray([
						{
							source: 'Greip',
							node: 'GreipTrigger',
							error: 'Invalid or missing event type',
							timestamp: new Date().toISOString(),
							rawEvent: receivedEvent,
						},
					]),
				],
				webhookResponse: {
					status: 400,
					body: { error: 'Invalid or missing event type' },
				},
			};
		}

		const selectedEvent = this.getNodeParameter('event') as string;
		if (selectedEvent !== 'all' && selectedEvent !== receivedEvent) {
			return {
				webhookResponse: {
					status: 200,
					body: {
						message: 'Greip webhook acknowledged; event ignored by filter',
						eventType: receivedEvent,
						filter: selectedEvent,
						processed: false,
					},
				},
			};
		}

		let structuredData: IDataObject = {
			source: 'Greip',
			node: 'GreipTrigger',
			event: receivedEvent,
			timestamp: new Date().toISOString(),
			webhookUrl: req.url,
			rawHeaders: headers,
		};

		let outputIndex = 0;

		switch (receivedEvent) {
			case 'proxy_detected':
				outputIndex = 0;
				structuredData = {
					...structuredData,
					ip: bodyData.ip,
					ipType: bodyData.ipType,
					IPNumber: bodyData.IPNumber,
					countryCode: bodyData.countryCode,
					countryGeoNameID: bodyData.countryGeoNameID,
					countryName: bodyData.countryName,
					security: bodyData.security,
				};
				break;

			case 'fraud_payment':
				outputIndex = 1;
				structuredData = {
					...structuredData,
					customer_id: bodyData.customer_id,
					customer_email: bodyData.customer_email,
					customer_phone: bodyData.customer_phone,
					score: bodyData.score,
					rules: bodyData.rules,
					rulesChecked: bodyData.rulesChecked,
					rulesDetected: bodyData.rulesDetected,
				};
				break;

			case 'profanity':
				outputIndex = 2;
				structuredData = {
					...structuredData,
					text: bodyData.text,
					totalBadWords: bodyData.totalBadWords,
					riskScore: bodyData.riskScore,
					isSafe: bodyData.isSafe,
				};
				break;

			case 'spam_email':
				outputIndex = 3;
				structuredData = {
					...structuredData,
					email: bodyData.email,
					score: bodyData.score,
					reason: bodyData.reason,
					isValid: bodyData.isValid,
				};
				break;

			case 'spam_phone':
				outputIndex = 4;
				structuredData = {
					...structuredData,
					phone: bodyData.phone,
					countryCode: bodyData.countryCode,
					carrier: bodyData.carrier,
					reason: bodyData.reason,
					isValid: bodyData.isValid,
				};
				break;

			default:
				outputIndex = 0;
				structuredData = { ...structuredData, ...bodyData };
		}

		const outputs = [[], [], [], [], []] as INodeExecutionData[][];
		outputs[outputIndex] = [{ json: structuredData }];

		return {
			workflowData: outputs,
			webhookResponse: {
				status: 200,
				body: {
					message: 'Greip webhook received successfully',
					eventType: receivedEvent,
					processed: true,
				},
			},
		};
	}
}
