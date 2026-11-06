import {
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
	VersionedNodeType,
} from 'n8n-workflow';

import {
	dataLookupOperations,
	dataLookupFields,
	dataLookupAdditionalFields,
	riskScoringOperations,
	riskScoringFields,
	riskScoringTransactionData,
	riskScoringAdditionalFields,
} from './resources';

import {
	asnLookup as asnLookupV2,
	binLookup as binLookupV2,
	countryLookup as countryLookupV2,
	domainLookup as domainLookupV2,
	ibanLookup as ibanLookupV2,
	ipLookup as ipLookupV2,
	emailScoring as emailScoringV2,
	ipScoring as ipScoringV2,
	paymentFraudDetection as paymentFraudDetectionV2,
	phoneScoring as phoneScoringV2,
	profanityDetection as profanityDetectionV2,
} from './operations';

import {
	dataLookupOperations as dataLookupOperationsV1,
	dataLookupFields as dataLookupFieldsV1,
	dataLookupAdditionalFields as dataLookupAdditionalFieldsV1,
	riskScoringOperations as riskScoringOperationsV1,
	riskScoringFields as riskScoringFieldsV1,
	riskScoringTransactionData as riskScoringTransactionDataV1,
	riskScoringAdditionalFields as riskScoringAdditionalFieldsV1,
} from './v1/resources';

import {
	asnLookup as asnLookupV1,
	binLookup as binLookupV1,
	countryLookup as countryLookupV1,
	domainLookup as domainLookupV1,
	ibanLookup as ibanLookupV1,
	ipLookup as ipLookupV1,
	emailScoring as emailScoringV1,
	ipScoring as ipScoringV1,
	paymentFraudDetection as paymentFraudDetectionV1,
	phoneScoring as phoneScoringV1,
	profanityDetection as profanityDetectionV1,
} from './v1/operations';

/**
 * Greip API v1 (legacy host https://greipapi.com) — preserved for existing workflows
 * that were saved with node version 1.
 */
class GreipV1 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip',
		name: 'greip',
		icon: { light: 'file:Greip.svg', dark: 'file:Greip.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{"Endpoint: " + $parameter["operation"]}}',
		description:
			'Get fraud prevention, threat intelligence, and risk scoring data from Greip (legacy API v1).',
		usableAsTool: true,
		defaults: {
			name: 'Greip',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				displayName: 'Greip API Key',
				name: 'greipApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resources',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Data Lookup', value: 'dataLookup' },
					{ name: 'Risk Scoring', value: 'riskScoring' },
				],
				default: 'dataLookup',
			},
			...dataLookupOperationsV1,
			...riskScoringOperationsV1,
			...dataLookupFieldsV1,
			...riskScoringFieldsV1,
			...riskScoringTransactionDataV1,
			...dataLookupAdditionalFieldsV1,
			...riskScoringAdditionalFieldsV1,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let result: INodeExecutionData;

				if (resource === 'dataLookup') {
					switch (operation) {
						case 'asnLookup':
							result = await asnLookupV1.call(this, i);
							break;
						case 'binLookup':
							result = await binLookupV1.call(this, i);
							break;
						case 'countryLookup':
							result = await countryLookupV1.call(this, i);
							break;
						case 'domainLookup':
							result = await domainLookupV1.call(this, i);
							break;
						case 'ibanLookup':
							result = await ibanLookupV1.call(this, i);
							break;
						case 'ipLookup':
							result = await ipLookupV1.call(this, i);
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown data lookup operation: ${operation}`,
							);
					}
				} else if (resource === 'riskScoring') {
					switch (operation) {
						case 'emailScoring':
							result = await emailScoringV1.call(this, i);
							break;
						case 'ipThreats':
							result = await ipScoringV1.call(this, i);
							break;
						case 'paymentFraudDetection':
							result = await paymentFraudDetectionV1.call(this, i);
							break;
						case 'phoneScoring':
							result = await phoneScoringV1.call(this, i);
							break;
						case 'profanityDetection':
							result = await profanityDetectionV1.call(this, i);
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown risk scoring operation: ${operation}`,
							);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}
		}

		return [returnData];
	}
}

class GreipV2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip',
		name: 'greip',
		icon: { light: 'file:Greip.svg', dark: 'file:Greip.dark.svg' },
		group: ['transform'],
		version: 2,
		subtitle: '={{"Endpoint: " + $parameter["operation"]}}',
		description: 'Get fraud prevention, threat intelligence, and risk scoring data from Greip.',
		usableAsTool: true,
		defaults: {
			name: 'Greip',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				displayName: 'Greip API Key',
				name: 'greipApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resources',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Data Lookup', value: 'dataLookup' },
					{ name: 'Risk Scoring', value: 'riskScoring' },
				],
				default: 'dataLookup',
			},
			// Operations
			...dataLookupOperations,
			...riskScoringOperations,
			// Fields
			...dataLookupFields,
			...riskScoringFields,
			...riskScoringTransactionData,
			// Additional Fields
			...dataLookupAdditionalFields,
			...riskScoringAdditionalFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				let result: INodeExecutionData;

				if (resource === 'dataLookup') {
					switch (operation) {
						case 'asnLookup':
							result = await asnLookupV2.call(this, i);
							break;
						case 'binLookup':
							result = await binLookupV2.call(this, i);
							break;
						case 'countryLookup':
							result = await countryLookupV2.call(this, i);
							break;
						case 'domainLookup':
							result = await domainLookupV2.call(this, i);
							break;
						case 'ibanLookup':
							result = await ibanLookupV2.call(this, i);
							break;
						case 'ipLookup':
							result = await ipLookupV2.call(this, i);
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown data lookup operation: ${operation}`,
							);
					}
				} else if (resource === 'riskScoring') {
					switch (operation) {
						case 'emailScoring':
							result = await emailScoringV2.call(this, i);
							break;
						case 'ipThreats':
							result = await ipScoringV2.call(this, i);
							break;
						case 'paymentFraudDetection':
							result = await paymentFraudDetectionV2.call(this, i);
							break;
						case 'phoneScoring':
							result = await phoneScoringV2.call(this, i);
							break;
						case 'profanityDetection':
							result = await profanityDetectionV2.call(this, i);
							break;
						default:
							throw new NodeOperationError(
								this.getNode(),
								`Unknown risk scoring operation: ${operation}`,
							);
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`);
				}

				returnData.push(result);
			} catch (error) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: message },
						pairedItem: { item: i },
					});
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}
		}

		return [returnData];
	}
}

const baseDescription: INodeTypeBaseDescription = {
	displayName: 'Greip',
	name: 'greip',
	icon: { light: 'file:Greip.svg', dark: 'file:Greip.dark.svg' },
	group: ['transform'],
	defaultVersion: 2,
	description:
		'Get fraud prevention, threat intelligence, and risk scoring data from Greip. Version 1 uses the legacy Greip API; version 2 uses Greip API v2.',
	usableAsTool: true,
};

export class Greip extends VersionedNodeType {
	constructor() {
		super(
			{
				1: new GreipV1(),
				2: new GreipV2(),
			},
			baseDescription,
		);
	}
}
