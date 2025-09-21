import {
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	INodeExecutionData,
	IHttpRequestOptions,
} from 'n8n-workflow';

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
		requestDefaults: {
			baseURL: 'https://greipapi.com',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: '=Bearer {{$credentials.greipApi.apiKey}}',
			},
		},
		properties: [
			// ----------------------------------
			//         Resources
			// ----------------------------------
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
			// Consolidated operations by category
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['dataLookup'] } },
				options: [
					{
						name: 'ASN Lookup',
						value: 'asnLookup',
						action: 'ASN Lookup',
						description: 'Lookup Autonomous System Number (ASN) data',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/asn',
								qs: {
									asn: '={{$parameter["asn"]}}',
								},
							},
						},
					},
					{
						name: 'BIN Lookup',
						value: 'binLookup',
						action: 'BIN Lookup',
						description:
							'Retrieve comprehensive information associated with a debit or credit card',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/bin',
								qs: {
									bin: '={{$parameter["bin"]}}',
								},
							},
						},
					},
					{
						name: 'Country Lookup',
						value: 'countryLookup',
						action: 'Country lookup',
						description: 'Retrieve detailed information about a given country',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/country',
								qs: {
									CountryCode: '={{$parameter["CountryCode"]}}',
								},
							},
						},
					},
					{
						name: 'Domain Lookup',
						value: 'domainLookup',
						action: 'Domain lookup',
						description:
							'Lookup any domain name and retrieve associated data and risk evaluation metrics',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/domain',
								qs: {
									domain: '={{$parameter["domain"]}}',
								},
							},
						},
					},
					{
						name: 'IBAN Lookup',
						value: 'ibanLookup',
						action: 'IBAN Lookup',
						description:
							'Validate a given IBAN and obtain essential information about the issuing country',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/iban',
								qs: {
									iban: '={{$parameter["iban"]}}',
								},
							},
						},
					},
					{
						name: 'IP Lookup',
						value: 'ipLookup',
						action: 'IP Lookup',
						description: 'Retrieve comprehensive information about a given IP address',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/ip',
								qs: {
									ip: '={{$parameter["ip"]}}',
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
				displayOptions: { show: { resource: ['riskScoring'] } },
				options: [
					{
						name: 'Email Scoring',
						value: 'emailScoring',
						action: 'Email scoring',
						description: 'Score any email address and retrieve its risk evaluation metrics',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/email',
								qs: {
									email: '={{$parameter["email"]}}',
								},
							},
						},
					},
					{
						name: 'IP Scoring',
						value: 'ipThreats',
						action: 'IP Scoring',
						description: 'Get threat intelligence and risk scoring for an IP address',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/lookup/ip/threats',
								qs: {
									ip: '={{$parameter["ip"]}}',
								},
							},
						},
					},
					{
						name: 'Payment Fraud Detection',
						value: 'paymentFraudDetection',
						action: 'Payment fraud detection',
						description: 'Detect and score payment fraud risk for a transaction',
						displayOptions: { show: { resource: ['payment'] } },
					},
					{
						name: 'Phone Scoring',
						value: 'phoneScoring',
						action: 'Phone number scoring',
						description: 'Score any phone number and retrieve its risk evaluation metrics',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/phone',
								qs: {
									phone: '={{$parameter["phone"]}}',
									countryCode: '={{$parameter["countryCode"]}}',
								},
							},
						},
					},
					{
						name: 'Profanity Detection',
						value: 'profanityDetection',
						action: 'Profanity detection',
						description: 'Detect offensive or inappropriate language in a given text',
						routing: {
							request: {
								baseURL: 'https://greipapi.com',
								method: 'GET',
								url: '/scoring/profanity',
								qs: {
									text: '={{$parameter["text"]}}',
								},
							},
						},
					},
				],
				default: 'ipThreats',
			},

			// --------------------  Management --------------------
			{
				displayName: 'Transaction Data',
				name: 'transactionData',
				type: 'fixedCollection',
				default: {},
				description: 'Transaction, shipment and customer data',
				placeholder: 'Add Field',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['paymentFraudDetection'],
					},
				},
				options: [
					{
						displayName: 'Fields',
						name: 'fields',
						values: [
							{
								displayName: 'Field Name',
								name: 'name',
								type: 'options',
								default: 'action',
								description: 'Select the field to send to Greip API',
								options: [
									{
										name: 'Action',
										value: 'action',
										description: 'Accepts: purchase, deposit, or withdrawal',
									},
									{
										name: 'Website Domain',
										value: 'website_domain',
										description: 'Example: domain.com',
									},
									{
										name: 'Website Name',
										value: 'website_name',
										description: 'Example: Nike Store, California',
									},
									{
										name: 'Merchant ID',
										value: 'merchant_id',
										description: 'Unique ID for sub-websites (Shopify style)',
									},
									{
										name: 'Shipment ID',
										value: 'shipment_id',
										description: 'Shipment identification code',
									},
									{
										name: 'Transaction ID',
										value: 'transaction_id',
										description: 'Transaction ID in your system',
									},
									{
										name: 'Transaction Amount',
										value: 'transaction_amount',
										description: 'Total transaction amount (number/float)',
									},
									{
										name: 'Transaction Currency',
										value: 'transaction_currency',
										description: 'Currency code (e.g. GBP, USD, EUR)',
									},
									{
										name: 'Cart Items',
										value: 'cart_items',
										description: 'Array of cart items (JSON format)',
									},
									{ name: 'Item ID', value: 'item_id', description: 'Product/item identification' },
									{ name: 'Item Name', value: 'item_name', description: 'Product/item name' },
									{
										name: 'Item Quantity',
										value: 'item_quantity',
										description: 'Quantity of the item (integer)',
									},
									{
										name: 'Item Price',
										value: 'item_price',
										description: 'Price per item (float/number)',
									},
									{
										name: 'Item Category ID',
										value: 'item_category_id',
										description: 'Product category identifier',
									},
									{
										name: 'Is Digital Products',
										value: 'isDigitalProducts',
										description: 'Boolean: true for digital products',
									},
									{ name: 'Coupon', value: 'coupon', description: 'Promo code used for checkout' },
									{
										name: 'Customer ID',
										value: 'customer_id',
										description: 'Customer ID in your system',
									},
									{
										name: 'Customer First Name',
										value: 'customer_firstname',
										description: 'Customer first name',
									},
									{
										name: 'Customer Last Name',
										value: 'customer_lastname',
										description: 'Customer family name',
									},
									{
										name: 'Customer Place of Birth',
										value: 'customer_pob',
										description: 'Customer place of birth',
									},
									{ name: 'Customer IP', value: 'customer_ip', description: 'Customer IP address' },
									{
										name: 'Customer Country',
										value: 'customer_country',
										description: 'ISO 3166-1 alpha-2 country code',
									},
									{
										name: 'Customer Region',
										value: 'customer_region',
										description: 'Customer region/state name',
									},
									{
										name: 'Customer City',
										value: 'customer_city',
										description: 'Customer city name',
									},
									{
										name: 'Customer ZIP',
										value: 'customer_zip',
										description: 'Customer ZIP/postal code',
									},
									{
										name: 'Customer Street',
										value: 'customer_street',
										description: 'Customer address line 1',
									},
									{
										name: 'Customer Street 2',
										value: 'customer_street2',
										description: 'Customer address line 2',
									},
									{
										name: 'Customer Latitude',
										value: 'customer_latitude',
										description: 'GPS latitude (float)',
									},
									{
										name: 'Customer Longitude',
										value: 'customer_longitude',
										description: 'GPS longitude (float)',
									},
									{
										name: 'Customer Device ID',
										value: 'customer_device_id',
										description: 'Device identification code',
									},
									{
										name: 'Customer Phone',
										value: 'customer_phone',
										description: 'Phone number (international format)',
									},
									{
										name: 'Customer Registration Date',
										value: 'customer_registration_date',
										description: 'Registration date (UNIX timestamp)',
									},
									{
										name: 'Customer Balance',
										value: 'customer_balance',
										description: 'Wallet balance (if applicable)',
									},
									{
										name: 'Customer Date of Birth',
										value: 'customer_dob',
										description: 'Date of birth (YYYY-MM-DD format)',
									},
									{
										name: 'Customer Email',
										value: 'customer_email',
										description: 'Customer email address',
									},
									{
										name: 'Customer 2FA',
										value: 'customer_2fa',
										description: 'Boolean: true if 2FA enabled',
									},
									{
										name: 'Customer User Agent',
										value: 'customer_useragent',
										description: 'Browser user agent string',
									},
									{
										name: 'Shipping Country',
										value: 'shipping_country',
										description: 'Shipping country (ISO 3166-1 alpha-2)',
									},
									{
										name: 'Shipping Region',
										value: 'shipping_region',
										description: 'Shipping region/state name',
									},
									{
										name: 'Shipping City',
										value: 'shipping_city',
										description: 'Shipping city name',
									},
									{
										name: 'Shipping ZIP',
										value: 'shipping_zip',
										description: 'Shipping ZIP/postal code',
									},
									{
										name: 'Shipping Street',
										value: 'shipping_street',
										description: 'Shipping address line 1',
									},
									{
										name: 'Shipping Street 2',
										value: 'shipping_street2',
										description: 'Shipping address line 2',
									},
									{
										name: 'Shipping Latitude',
										value: 'shipping_latitude',
										description: 'Shipping GPS latitude (float)',
									},
									{
										name: 'Shipping Longitude',
										value: 'shipping_longitude',
										description: 'Shipping GPS longitude (float)',
									},
									{
										name: 'Billing Country',
										value: 'billing_country',
										description: 'Billing country (ISO 3166-1 alpha-2)',
									},
									{
										name: 'Billing Region',
										value: 'billing_region',
										description: 'Billing region/state name',
									},
									{ name: 'Billing City', value: 'billing_city', description: 'Billing city name' },
									{
										name: 'Billing ZIP',
										value: 'billing_zip',
										description: 'Billing ZIP/postal code',
									},
									{
										name: 'Billing Street',
										value: 'billing_street',
										description: 'Billing address line 1',
									},
									{
										name: 'Billing Street 2',
										value: 'billing_street2',
										description: 'Billing address line 2',
									},
									{
										name: 'Billing Latitude',
										value: 'billing_latitude',
										description: 'Billing GPS latitude (float)',
									},
									{
										name: 'Billing Longitude',
										value: 'billing_longitude',
										description: 'Billing GPS longitude (float)',
									},
									{
										name: 'Payment Type',
										value: 'payment_type',
										description:
											'Accepts: cards, cards_mada, applepay, stcpay, bank, crypto, wallet, cod',
									},
									{ name: 'Card Name', value: 'card_name', description: 'Cardholder name on card' },
									{
										name: 'Card Number',
										value: 'card_number',
										description: 'Card number (minimum 6 digits)',
									},
									{
										name: 'Card Expiry',
										value: 'card_expiry',
										description: 'Card expiry date (MM/YY format, e.g. 12/25)',
									},
									{
										name: 'CVV Result',
										value: 'cvv_result',
										description: 'Boolean: true if CVV/CSV verification passed',
									},
								],
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'Enter field value',
								description: 'The value for this field',
							},
						],
					},
				],
			},
			// Cart Items Data - appears when "Cart Items" is selected in Transaction Data
			{
				displayName: 'Cart Items Data',
				name: 'cartItemsData',
				type: 'fixedCollection',
				default: {},
				description:
					'Define the cart items structure when "Cart Items" is selected in Transaction Data above',
				placeholder: 'Add Cart Item Field',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						resource: ['payment'],
						operation: ['paymentFraudDetection'],
					},
				},
				options: [
					{
						displayName: 'Cart Item Fields',
						name: 'fields',
						values: [
							{
								displayName: 'Field Name',
								name: 'name',
								type: 'options',
								default: 'item_id',
								description: 'Select the cart item field',
								options: [
									{ name: 'Item ID', value: 'item_id', description: 'Product/item identification' },
									{ name: 'Item Name', value: 'item_name', description: 'Product/item name' },
									{
										name: 'Item Quantity',
										value: 'item_quantity',
										description: 'Quantity of the item (integer)',
									},
									{
										name: 'Item Price',
										value: 'item_price',
										description: 'Price per item (float/number)',
									},
									{
										name: 'Item Category ID',
										value: 'item_category_id',
										description: 'Product category identifier',
									},
									{
										name: 'Is Digital Products',
										value: 'isDigitalProducts',
										description: 'Boolean: true for digital products',
									},
								],
							},
							{
								displayName: 'Field Value',
								name: 'value',
								type: 'string',
								default: '',
								placeholder: 'Enter field value',
								description: 'The value for this cart item field',
							},
						],
					},
				],
			},
			{
				displayName: 'Text',
				name: 'text',
				description: 'The text to check for profanity',
				placeholder: 'Enter text here...',
				type: 'string',
				required: true,
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['profanityDetection'],
					},
				},
			},

			{
				displayName: 'Phone Number',
				name: 'phone',
				description: 'The phone number to validate and score (in international format)',
				placeholder: '+96612345678',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['phoneScoring'],
					},
				},
			},
			{
				displayName: 'Country Code',
				name: 'countryCode',
				description: 'The ISO 3166-1 alpha-2 country code',
				placeholder: 'US',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['phoneScoring'],
					},
				},
			},
			{
				displayName: 'Email',
				name: 'email',
				description: 'The email address to validate and score',
				placeholder: 'name@email.com',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['emailScoring'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				description: 'The IP address to check for threats (IPv4 or IPv6)',
				placeholder: '1.1.1.1',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['ipThreats'],
					},
				},
			},
			{
				displayName: 'Domain',
				name: 'domain',
				description: 'The fully qualified domain name',
				placeholder: 'example.com',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['domainLookup'],
					},
				},
			},
			{
				displayName: 'Country Code',
				name: 'CountryCode',
				description: 'The ISO 3166-1 alpha-2 country code',
				placeholder: 'US',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['countryLookup'],
					},
				},
			},
			{
				displayName: 'BIN/IIN',
				name: 'bin',
				description: 'The BIN/IIN of the card (first 6-11 digits)',
				placeholder: '424242',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['binLookup'],
					},
				},
			},
			{
				displayName: 'IBAN',
				name: 'iban',
				description: 'The IBAN to validate or lookup',
				placeholder: 'AL35202111090000000001234567',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['ibanLookup'],
					},
				},
			},
			{
				displayName: 'ASN',
				name: 'asn',
				description: 'The AS Number to lookup',
				placeholder: 'AS9112',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['asnLookup'],
					},
				},
			},
			{
				displayName: 'IP Address',
				name: 'ip',
				description: 'IP address to lookup',
				placeholder: '1.1.1.1',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['ipLookup'],
					},
				},
			},

			// ----------------------------------
			//      Additional Fields
			// ----------------------------------
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['ipLookup'],
					},
				},
				options: [
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
						routing: {
							request: {
								qs: {
									lang: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Params',
						name: 'params',
						description: 'Specify required modules (e.g. security,timezone,currency)',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									params: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['ipThreats'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for ASN Lookup
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['asnLookup'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for IBAN Lookup
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['ibanLookup'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for BIN Lookup
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['binLookup'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Country Lookup
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['countryLookup'],
					},
				},
				options: [
					{
						displayName: 'Params',
						name: 'params',
						description: 'Specify required modules (e.g. security,timezone,currency)',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									params: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Domain Lookup
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['dataLookup'],
						operation: ['domainLookup'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Email Scoring
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['emailScoring'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Phone Scoring
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['phoneScoring'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
						routing: {
							request: {
								qs: {
									userID: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Profanity Detection
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['profanityDetection'],
					},
				},
				options: [
					{
						displayName: 'List Profane Words',
						name: 'listBadWords',
						description: 'List the profane words in the response',
						type: 'options',
						options: [
							{ name: 'Yes', value: 'yes' },
							{ name: 'No', value: 'no' },
						],
						default: 'no',
						routing: {
							request: {
								qs: {
									listBadWords: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
						routing: {
							request: {
								qs: {
									mode: '={{$value}}',
								},
							},
						},
					},
					{
						displayName: 'Score Only',
						name: 'scoreOnly',
						description: 'Return only the scoring of the text',
						type: 'options',
						options: [
							{ name: 'Yes', value: 'yes' },
							{ name: 'No', value: 'no' },
						],
						default: 'yes',
						routing: {
							request: {
								qs: {
									scoreOnly: '={{$value}}',
								},
							},
						},
					},
				],
			},

			// Additional Fields for Payment Fraud Detection
			{
				displayName: 'Additional Fields',
				name: 'additionalFields',
				type: 'collection',
				default: {},
				placeholder: 'Add Field',
				displayOptions: {
					show: {
						resource: ['riskScoring'],
						operation: ['paymentFraudDetection'],
					},
				},
				options: [
					{
						displayName: 'Mode',
						name: 'mode',
						description: 'Environment mode',
						hint: 'Enable this option to protect your account credits while testing the integration',
						type: 'options',
						options: [
							{ name: 'Live', value: 'live' },
							{ name: 'Test', value: 'test' },
						],
						default: 'live',
					},
					{
						displayName: 'User ID',
						name: 'userID',
						description:
							'User identifier, used to link requests to a specific user in Greip dashboard',
						placeholder: 'email@example.com, phone, ID, etc.',
						type: 'string',
						default: '',
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Only handle payment fraud detection through execute function
				if (resource === 'payment' && operation === 'paymentFraudDetection') {
					// Get transaction data fields
					const transactionDataFields = this.getNodeParameter(
						'transactionData.fields',
						i,
						[],
					) as Array<{
						name: string;
						value: string;
					}>;

					// Get cart items data if available
					const cartItemsData = this.getNodeParameter('cartItemsData.fields', i, []) as Array<{
						name: string;
						value: string;
					}>;

					// Get additional fields
					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
						mode?: string;
						userID?: string;
					};

					// Build the data object from fields
					const data: { [key: string]: any } = {};

					// Check if cart_items is selected in transaction data
					let hasCartItems = false;

					// Process transaction data fields
					for (const field of transactionDataFields) {
						if (field.name && field.value) {
							if (field.name === 'cart_items') {
								hasCartItems = true;
								// Don't add cart_items value directly, we'll build it from cartItemsData
							} else {
								data[field.name] = field.value;
							}
						}
					}

					// Build cart_items object if cart_items was selected and cart items data exists
					if (hasCartItems && cartItemsData && cartItemsData.length > 0) {
						const cartItems: { [key: string]: any } = {};
						for (const field of cartItemsData) {
							if (field.name && field.value) {
								cartItems[field.name] = field.value;
							}
						}
						if (Object.keys(cartItems).length > 0) {
							data.cart_items = cartItems;
						}
					}

					// Build request body
					const requestBody: { [key: string]: any } = {
						data: data,
					};

					if (additionalFields.mode) {
						requestBody.mode = additionalFields.mode;
					}
					if (additionalFields.userID) {
						requestBody.userID = additionalFields.userID;
					}

					const credentials = await this.getCredentials('greipApi');

					const options: IHttpRequestOptions = {
						method: 'POST',
						url: 'https://greipapi.com/scoring/payment',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
							Authorization: `Bearer ${credentials.apiKey}`,
						},
						body: requestBody,
						json: true,
					};

					const response = await this.helpers.httpRequest(options);

					returnData.push({
						json: response,
						pairedItem: { item: i },
					});
				} else {
					throw new Error(
						`Operation ${operation} for resource ${resource} should be handled by routing`,
					);
				}
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
