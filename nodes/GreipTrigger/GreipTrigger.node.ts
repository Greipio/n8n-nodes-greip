import {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	NodeConnectionType,
	INodeExecutionData,
} from 'n8n-workflow';

export class GreipTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip Trigger',
		name: 'greipTrigger',
		icon: 'file:greip.svg',
		group: ['trigger'],
		version: 1,
		description:
			'Receive real-time notifications from Greip via webhooks for fraud detection, proxy detection, profanity detection, and more',
		defaults: {
			name: 'Greip Trigger',
		},
		inputs: [],
		outputs: [
			NodeConnectionType.Main, // 0 => Proxy Detection
			NodeConnectionType.Main, // 1 => Fraud Payment
			NodeConnectionType.Main, // 2 => Profanity
			NodeConnectionType.Main, // 3 => Spam Email
			NodeConnectionType.Main, // 4 => Spam Phone
		],
		outputNames: ['Proxy Detection', 'Fraud Payment', 'Profanity', 'Spam Email', 'Spam Phone'],
		credentials: [
			{
				displayName: 'Greip API Key',
				name: 'greipApi',
				required: false,
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
		properties: [],
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
					this.helpers.returnJsonArray([{
						source: 'Greip',
						node: 'GreipTrigger',
						error: 'Unauthorized: Invalid user agent',
						timestamp: new Date().toISOString(),
					}]),
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
					this.helpers.returnJsonArray([{
						source: 'Greip',
						node: 'GreipTrigger',
						error: 'Invalid or missing event type',
						timestamp: new Date().toISOString(),
						rawEvent: receivedEvent,
					}]),
				],
				webhookResponse: {
					status: 400,
					body: { error: 'Invalid or missing event type' },
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
