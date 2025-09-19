import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Greip implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Greip',
		name: 'greip',
		icon: 'file:Greip.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get fraud prevention, threat intelligence, and risk scoring data from Greip.',
		defaults: {
			name: 'Greip',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'GreipApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://greipapi.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'ASN', value: 'asn' },
					{ name: 'BIN', value: 'bin' },
					{ name: 'Country', value: 'country' },
					{ name: 'Domain', value: 'domain' },
					{ name: 'Email Address', value: 'emailAddress' },
					{ name: 'IBAN', value: 'iban' },
					{ name: 'IP Address', value: 'ipAddress' },
					{ name: 'Payment', value: 'payment' },
					{ name: 'Phone Number', value: 'phoneNumber' },
					{ name: 'Text', value: 'text' },
				],

				default: 'ipAddress',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['ipAddress'] } },
				options: [
					{
						name: 'Lookup',
						value: 'ipLookup',
						action: 'IP Lookup',
						description: 'Lookup IP address details (new endpoint)',
						displayOptions: { show: { resource: ['ipAddress'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/ip',
								qs: {
									ip: '={{$parameter["ip"]}}',
									params: '={{$parameter["params"]}}',
									format: '={{$parameter["format"]}}',
									lang: '={{$parameter["lang"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
					{
						name: 'Scoring',
						value: 'ipThreats',
						action: 'IP Scoring',
						description: 'Get threat intelligence and risk scoring for an IP address',
						displayOptions: { show: { resource: ['ipAddress'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/ip/threats',
								qs: {
									ip: '={{$parameter["ip"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
				],
				default: 'ipLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['asn'] } },
				options: [
					{
						name: 'Lookup',
						value: 'asnLookup',
						action: 'ASN Lookup',
						description: 'Lookup Autonomous System Number (ASN) details',
						displayOptions: { show: { resource: ['asn'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/asn',
								qs: {
									asn: '={{$parameter["asn"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
								},
							},
						},
					},
				],
				default: 'asnLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['iban'] } },
				options: [
					{
						name: 'Lookup',
						value: 'ibanLookup',
						action: 'IBAN Lookup',
						description: 'Validate and lookup IBAN details',
						displayOptions: { show: { resource: ['iban'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/iban',
								qs: {
									iban: '={{$parameter["iban"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
				],
				default: 'ibanLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['bin'] } },
				options: [
					{
						name: 'Lookup',
						value: 'binLookup',
						action: 'BIN Lookup',
						description: 'Lookup and validate card BIN/IIN details',
						displayOptions: { show: { resource: ['bin'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/bin',
								qs: {
									bin: '={{$parameter["bin"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
				],
				default: 'binLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['country'] } },
				options: [
					{
						name: 'Lookup',
						value: 'countryLookup',
						action: 'Country lookup',
						description: 'Lookup country details by country code',
						displayOptions: { show: { resource: ['country'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/country',
								qs: {
									CountryCode: '={{$parameter["CountryCode"]}}',
									params: '={{$parameter["params"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
								},
							},
						},
					},
				],
				default: 'countryLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['domain'] } },
				options: [
					{
						name: 'Lookup',
						value: 'domainLookup',
						action: 'Domain lookup',
						description: 'Lookup domain details and risk metrics',
						displayOptions: { show: { resource: ['domain'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/domain',
								qs: {
									domain: '={{$parameter["domain"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
								},
							},
						},
					},
				],
				default: 'domainLookup',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['emailAddress'] } },
				options: [
					{
						name: 'Scoring',
						value: 'emailScoring',
						action: 'Email scoring',
						description: 'Validate and score an email address',
						displayOptions: { show: { resource: ['emailAddress'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/email',
								qs: {
									email: '={{$parameter["email"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
				],
				default: 'emailScoring',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['phoneNumber'] } },
				options: [
					{
						name: 'Scoring',
						value: 'phoneScoring',
						action: 'Phone number scoring',
						description: 'Validate and score a phone number',
						displayOptions: { show: { resource: ['phoneNumber'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/phone',
								qs: {
									phone: '={{$parameter["phone"]}}',
									countryCode: '={{$parameter["countryCode"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
							},
						},
					},
				],
				default: 'phoneScoring',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['text'] } },
				options: [
					{
						name: 'Scoring',
						value: 'profanityDetection',
						action: 'Profanity detection',
						description: 'Detect offensive or inappropriate language in text',
						displayOptions: { show: { resource: ['text'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/profanity',
								qs: {
									text: '={{$parameter["text"]}}',
									scoreOnly: '={{$parameter["scoreOnly"]}}',
									listBadWords: '={{$parameter["listBadWords"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
								},
							},
						},
					},
				],
				default: 'profanityDetection',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['payment'] } },
				options: [
					{
						name: 'Scoring',
						value: 'paymentFraudDetection',
						action: 'Payment fraud detection',
						description: 'Detect and score payment fraud risk for a transaction',
						displayOptions: { show: { resource: ['payment'] } },
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'POST',
								url: '/scoring/payment',
								headers: {
									'Content-Type': 'application/json',
								},
								body: {
									data: '={{$parameter["data"]}}',
									format: '={{$parameter["format"]}}',
									mode: '={{$parameter["mode"]}}',
									userID: '={{$parameter["userID"]}}',
								},
								json: true,
							},
						},
					},
				],
				default: 'paymentFraudDetection',
			},

			// --------------------  Management --------------------
			{
				displayName: 'Transaction Data',
				name: 'data',
				description: 'Transaction and customer data as JSON object',
				type: 'json',
				required: true,
				default: '{}',
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['paymentFraudDetection'],
					},
				},
			},
			{
				displayName: 'Text',
				name: 'text',
				description: 'The text to check for profanity',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['profanityDetection'],
					},
				},
			},
			{
				displayName: 'Score Only',
				name: 'scoreOnly',
				description: 'Return only the score and safety status (yes/no)',
				type: 'options',
				options: [
					{ name: 'No', value: 'no' },
					{ name: 'Yes', value: 'yes' },
				],
				default: 'no',
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['profanityDetection'],
					},
				},
			},
			{
				displayName: 'List Bad Words',
				name: 'listBadWords',
				description: 'List the bad words in the response (yes/no)',
				type: 'options',
				options: [
					{ name: 'No', value: 'no' },
					{ name: 'Yes', value: 'yes' },
				],
				default: 'no',
				displayOptions: {
					show: {
						resource: ['text'],
						operation: ['profanityDetection'],
					},
				},
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				description: 'The phone number to validate and score',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['phoneNumber'],
						operation: ['phoneScoring'],
					},
				},
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				description: 'The ISO 3166-1 alpha-2 country code (e.g. US, GB)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['phoneNumber'],
						operation: ['phoneScoring'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				description: 'The email address to validate and score',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'name@email.com',
				displayOptions: {
					show: {
						resource: ['emailAddress'],
						operation: ['emailScoring'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				description: 'The IP address to check for threats (IPv4 or IPv6)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['ipAddress'],
						operation: ['ipThreats'],
					},
				},
			},
			{
				displayName: 'Domain',
				name: 'domain',
				description: 'The fully qualified domain name (e.g. example.com)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['domain'],
						operation: ['domainLookup'],
					},
				},
			},
			{
				displayName: 'Country Code',
				name: 'CountryCode',
				description: 'The ISO 3166-1 alpha-2 country code (e.g. US, GB)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['country'],
						operation: ['countryLookup'],
					},
				},
			},
			{
				displayName: 'BIN/IIN',
				name: 'bin',
				description: 'The BIN/IIN of the card (min: 6 digits)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['iban'],
						operation: ['binLookup'],
					},
				},
			},
			{
				displayName: 'IBAN',
				name: 'iban',
				description: 'The IBAN to validate or lookup (e.g. BE71096123456769)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['iban'],
						operation: ['ibanLookup'],
					},
				},
			},
			{
				displayName: 'ASN',
				name: 'asn',
				description: 'The AS Number to lookup (e.g. AS6167 or 6167)',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['asn'],
						operation: ['asnLookup'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				description: 'IP address to lookup (leave empty for requester IP)',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['ipAddress'],
						operation: ['ipLookup'],
					},
				},
			},
			{
				displayName: 'Params',
				name: 'params',
				description: 'Specify required modules (e.g. security,timezone,currency)',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['country', 'ipAddress'],
						operation: ['get', 'ipLookup', 'countryLookup'],
					},
				},
			},
			{
				displayName: 'Format',
				name: 'format',
				description: 'Response format (JSON, XML, CSV, Newline)',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'JSON' },
					{ name: 'XML', value: 'XML' },
					{ name: 'CSV', value: 'CSV' },
					{ name: 'Newline', value: 'Newline' },
				],
				default: 'JSON',
				displayOptions: {
					show: {
						resource: [
							'payment',
							'text',
							'phoneNumber',
							'emailAddress',
							'ipAddress',
							'domain',
							'country',
							'iban',
							'asn',
						],
						operation: [
							'get',
							'ipLookup',
							'asnLookup',
							'ibanLookup',
							'binLookup',
							'countryLookup',
							'domainLookup',
							'ipThreats',
							'emailScoring',
							'phoneScoring',
							'profanityDetection',
							'paymentFraudDetection',
						],
					},
				},
			},
			{
				displayName: 'Language',
				name: 'lang',
				description: 'Response language',
				type: 'options',
				options: [
					{ name: 'Arabic', value: 'AR' },
					{ name: 'Chinese', value: 'ZH' },
					{ name: 'English', value: 'EN' },
					{ name: 'French', value: 'FR' },
					{ name: 'German', value: 'DE' },
					{ name: 'Japanese', value: 'JA' },
					{ name: 'Russian', value: 'RU' },
					{ name: 'Spanish', value: 'ES' },
				],
				default: 'EN',
				displayOptions: {
					show: {
						resource: ['ipAddress'],
						operation: ['get', 'ipLookup'],
					},
				},
			},
			{
				displayName: 'Mode',
				name: 'mode',
				description: 'Environment mode (live or test)',
				type: 'options',
				options: [
					{ name: 'Live', value: 'live' },
					{ name: 'Test', value: 'test' },
				],
				default: 'live',
				displayOptions: {
					show: {
						resource: [
							'payment',
							'phoneNumber',
							'emailAddress',
							'ipAddress',
							'domain',
							'country',
							'iban',
							'asn',
						],
						operation: [
							'get',
							'ipLookup',
							'asnLookup',
							'ibanLookup',
							'binLookup',
							'countryLookup',
							'domainLookup',
							'ipThreats',
							'emailScoring',
							'phoneScoring',
							'profanityDetection',
							'paymentFraudDetection',
						],
					},
				},
			},
			{
				displayName: 'User ID',
				name: 'userID',
				description: 'User identifier (email, phone, etc.)',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['payment', 'phoneNumber', 'emailAddress', 'ipAddress', 'iban'],
						operation: [
							'get',
							'ipLookup',
							'ibanLookup',
							'binLookup',
							'ipThreats',
							'emailScoring',
							'phoneScoring',
							'paymentFraudDetection',
						],
					},
				},
			},
		],
	};
}
