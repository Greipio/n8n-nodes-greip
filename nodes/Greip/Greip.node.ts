import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';

// Import resource properties
import {
	dataLookupOperations,
	dataLookupFields,
	dataLookupAdditionalFields,
	riskScoringOperations,
	riskScoringFields,
	riskScoringTransactionData,
	riskScoringAdditionalFields,
} from './resources';

// Import operation functions
import {
	asnLookup,
	binLookup,
	countryLookup,
	domainLookup,
	ibanLookup,
	ipLookup,
	emailScoring,
	ipScoring,
	paymentFraudDetection,
	phoneScoring,
	profanityDetection,
} from './operations';

export class Greip implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip',
		name: 'greip',
		icon: 'file:Greip.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{"Endpoint: " + $parameter["operation"]}}',
		description: 'Get fraud prevention, threat intelligence, and risk scoring data from Greip.',
		usableAsTool: true,
		defaults: {
			name: 'Greip',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				displayName: 'Greip API Key',
				name: 'greipApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Category',
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
							result = await asnLookup.call(this, i);
							break;
						case 'binLookup':
							result = await binLookup.call(this, i);
							break;
						case 'countryLookup':
							result = await countryLookup.call(this, i);
							break;
						case 'domainLookup':
							result = await domainLookup.call(this, i);
							break;
						case 'ibanLookup':
							result = await ibanLookup.call(this, i);
							break;
						case 'ipLookup':
							result = await ipLookup.call(this, i);
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
							result = await emailScoring.call(this, i);
							break;
						case 'ipThreats':
							result = await ipScoring.call(this, i);
							break;
						case 'paymentFraudDetection':
							result = await paymentFraudDetection.call(this, i);
							break;
						case 'phoneScoring':
							result = await phoneScoring.call(this, i);
							break;
						case 'profanityDetection':
							result = await profanityDetection.call(this, i);
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
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
				} else {
					throw error;
				}
			}
		}

		return [returnData];
	}
}
