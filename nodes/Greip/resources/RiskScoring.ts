import { INodeProperties } from 'n8n-workflow';

export const riskScoringOperations: INodeProperties[] = [
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
			},
			{
				name: 'IP Scoring',
				value: 'ipThreats',
				action: 'IP Scoring',
				description: 'Get threat intelligence and risk scoring for an IP address',
			},
			{
				name: 'Payment Fraud Detection',
				value: 'paymentFraudDetection',
				action: 'Payment fraud detection',
				description: 'Detect and score payment fraud risk for a transaction',
				displayOptions: { show: { resource: ['riskScoring'] } },
			},
			{
				name: 'Phone Scoring',
				value: 'phoneScoring',
				action: 'Phone number scoring',
				description: 'Score any phone number and retrieve its risk evaluation metrics',
			},
			{
				name: 'Profanity Detection',
				value: 'profanityDetection',
				action: 'Profanity detection',
				description: 'Detect offensive or inappropriate language in a given text',
			},
		],
		default: 'ipThreats',
	},
];

export const riskScoringFields: INodeProperties[] = [
	// Text field for profanity detection
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
	// Phone Number field
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
	// Country Code for phone scoring
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
	// Email field
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
	// IP Address for scoring
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
];

export const riskScoringTransactionData: INodeProperties[] = [
	// Transaction Data for Payment Fraud Detection
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
						displayOptions: {
							hide: {
								name: ['isDigitalProducts', 'cvv_result', 'customer_2fa'],
							},
						},
					},
					{
						displayName: 'Is Digital Product',
						name: 'value',
						type: 'boolean',
						default: false,
						description: 'Set to true for digital products, false otherwise',
						displayOptions: {
							show: {
								name: ['isDigitalProducts'],
							},
						},
					},
					{
						displayName: 'CVV Verification Result',
						name: 'value',
						type: 'boolean',
						default: false,
						description: 'Set to true if CVV/CSV verification passed, false otherwise',
						displayOptions: {
							show: {
								name: ['cvv_result'],
							},
						},
					},
					{
						displayName: 'Customer 2FA Status',
						name: 'value',
						type: 'boolean',
						default: false,
						description: 'Set to true if 2FA is enabled for customer, false otherwise',
						displayOptions: {
							show: {
								name: ['customer_2fa'],
							},
						},
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
				resource: ['riskScoring'],
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
];

export const riskScoringAdditionalFields: INodeProperties[] = [
	// Additional Fields for IP Scoring
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
			},
			{
				displayName: 'User ID',
				name: 'userID',
				description: 'User identifier, used to link requests to a specific user in Greip dashboard',
				placeholder: 'email@example.com, phone, ID, etc.',
				type: 'string',
				default: '',
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
			},
			{
				displayName: 'User ID',
				name: 'userID',
				description: 'User identifier, used to link requests to a specific user in Greip dashboard',
				placeholder: 'email@example.com, phone, ID, etc.',
				type: 'string',
				default: '',
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
			},
			{
				displayName: 'User ID',
				name: 'userID',
				description: 'User identifier, used to link requests to a specific user in Greip dashboard',
				placeholder: 'email@example.com, phone, ID, etc.',
				type: 'string',
				default: '',
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
				description: 'User identifier, used to link requests to a specific user in Greip dashboard',
				placeholder: 'email@example.com, phone, ID, etc.',
				type: 'string',
				default: '',
			},
		],
	},
];
