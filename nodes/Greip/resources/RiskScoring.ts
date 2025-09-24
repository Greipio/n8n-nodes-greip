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
	{
		displayName: 'Include Cart Items',
		name: 'includeCartItems',
		type: 'boolean',
		default: false,
		description: 'Whether to provide cart items data',
		displayOptions: {
			show: {
				resource: ['riskScoring'],
				operation: ['paymentFraudDetection'],
			},
		},
	},
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
						displayName: 'Action Value',
						name: 'actionValue',
						type: 'options',
						default: 'purchase',
						description: 'The action your customer is trying to implement',
						options: [
							{
								name: 'Purchase',
								value: 'purchase',
								description: 'Customer is making a purchase',
							},
							{
								name: 'Deposit',
								value: 'deposit',
								description: 'Customer is making a deposit',
							},
							{
								name: 'Withdrawal',
								value: 'withdrawal',
								description: 'Customer is making a withdrawal',
							},
						],
						displayOptions: {
							show: {
								name: ['action'],
							},
						},
					},
					{
						displayName: 'Billing City',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The billing city name of the customer',
						displayOptions: {
							show: {
								name: ['billing_city'],
							},
						},
					},
					{
						displayName: 'Billing Country',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'The billing country code (ISO 3166-1 alpha-2)',
						displayOptions: {
							show: {
								name: ['billing_country'],
							},
						},
					},
					{
						displayName: 'Billing Latitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '40.7128',
						description: "The latitude of the customer's billing address (GPS Coordinates)",
						displayOptions: {
							show: {
								name: ['billing_latitude'],
							},
						},
					},
					{
						displayName: 'Billing Longitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '-74.0060',
						description: "The longitude of the customer's billing address (GPS Coordinates)",
						displayOptions: {
							show: {
								name: ['billing_longitude'],
							},
						},
					},
					{
						displayName: 'Billing Region',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The billing region name of the customer',
						displayOptions: {
							show: {
								name: ['billing_region'],
							},
						},
					},
					{
						displayName: 'Billing Street',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '123 Main Street',
						description: 'The billing "address 1" of the customer',
						displayOptions: {
							show: {
								name: ['billing_street'],
							},
						},
					},
					{
						displayName: 'Billing Street 2',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Apt 4B',
						description: 'The billing "address 2" of the customer',
						displayOptions: {
							show: {
								name: ['billing_street2'],
							},
						},
					},
					{
						displayName: 'Billing ZIP',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '10001',
						description: "The zip code of the customer's billing address",
						displayOptions: {
							show: {
								name: ['billing_zip'],
							},
						},
					},
					{
						displayName: 'Card Expiry',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '12/25',
						description: 'The expiry date of the customer debit/credit card',
						displayOptions: {
							show: {
								name: ['card_expiry'],
							},
						},
					},
					{
						displayName: 'Card Name',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'John Doe',
						description: 'The name on the card (Cardholder Name)',
						displayOptions: {
							show: {
								name: ['card_name'],
							},
						},
					},
					{
						displayName: 'Card Number',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '4111111111111111',
						description: 'The card number (min: 6 digits)',
						displayOptions: {
							show: {
								name: ['card_number'],
							},
						},
					},
					{
						displayName: 'Coupon',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'SAVE20',
						description: 'The promo code used by the customer to complete the checkout',
						displayOptions: {
							show: {
								name: ['coupon'],
							},
						},
					},
					{
						displayName: 'Customer 2FA Status',
						name: 'customer2faValue',
						type: 'boolean',
						default: false,
						description: 'Whether 2FA is enabled for the customer',
						displayOptions: {
							show: {
								name: ['customer_2fa'],
							},
						},
					},
					{
						displayName: 'Customer Balance',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '250.50',
						description: 'If you offer a Wallet feature, pass the user balance to this parameter',
						displayOptions: {
							show: {
								name: ['customer_balance'],
							},
						},
					},
					{
						displayName: 'Customer City',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The name of the city where the customer live',
						displayOptions: {
							show: {
								name: ['customer_city'],
							},
						},
					},
					{
						displayName: 'Customer Country',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'US',
						description:
							'The ISO 3166-1 alpha-2 code format of the country where the customer live',
						displayOptions: {
							show: {
								name: ['customer_country'],
							},
						},
					},
					{
						displayName: 'Customer Date of Birth',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '1985-12-27',
						description: "The customer's date of birth",
						displayOptions: {
							show: {
								name: ['customer_dob'],
							},
						},
					},
					{
						displayName: 'Customer Device ID',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'ABC123DEF456',
						description: 'The device identification code of the customer',
						displayOptions: {
							show: {
								name: ['customer_device_id'],
							},
						},
					},
					{
						displayName: 'Customer Email',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'customer@example.com',
						description: 'The email address of the customer',
						displayOptions: {
							show: {
								name: ['customer_email'],
							},
						},
					},
					{
						displayName: 'Customer First Name',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'John',
						description: 'The first name of the customer',
						displayOptions: {
							show: {
								name: ['customer_firstname'],
							},
						},
					},
					{
						displayName: 'Customer ID',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '12345',
						description: 'The identification number of the customer in your system',
						displayOptions: {
							show: {
								name: ['customer_id'],
							},
						},
					},
					{
						displayName: 'Customer IP',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '192.168.1.1',
						description: 'The IP address of the customer',
						displayOptions: {
							show: {
								name: ['customer_ip'],
							},
						},
					},
					{
						displayName: 'Customer Last Name',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Doe',
						description: 'The last name of the customer (Family Name)',
						displayOptions: {
							show: {
								name: ['customer_lastname'],
							},
						},
					},
					{
						displayName: 'Customer Latitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '40.7128',
						description: 'The customer latitude on the map (GPS Coordinates)',
						displayOptions: {
							show: {
								name: ['customer_latitude'],
							},
						},
					},
					{
						displayName: 'Customer Longitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '-74.0060',
						description: 'The customer longitude on the map (GPS Coordinates)',
						displayOptions: {
							show: {
								name: ['customer_longitude'],
							},
						},
					},
					{
						displayName: 'Customer Phone',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '+1234567890',
						description: 'The phone number of the customer (international format)',
						displayOptions: {
							show: {
								name: ['customer_phone'],
							},
						},
					},
					{
						displayName: 'Customer Place of Birth',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The Place of Birth of the customer',
						displayOptions: {
							show: {
								name: ['customer_pob'],
							},
						},
					},
					{
						displayName: 'Customer Region',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The name of the region where the customer live',
						displayOptions: {
							show: {
								name: ['customer_region'],
							},
						},
					},
					{
						displayName: 'Customer Registration Date',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '1672531200',
						description: 'The registration date of the customer (UNIX Timestamp)',
						displayOptions: {
							show: {
								name: ['customer_registration_date'],
							},
						},
					},
					{
						displayName: 'Customer Street',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '123 Main Street',
						description: 'The "address line 1" of the customer',
						displayOptions: {
							show: {
								name: ['customer_street'],
							},
						},
					},
					{
						displayName: 'Customer Street 2',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Apt 4B',
						description: 'The "address line 2" of the customer',
						displayOptions: {
							show: {
								name: ['customer_street2'],
							},
						},
					},
					{
						displayName: 'Customer User Agent',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
						description: 'Pass the User Agent of the customer to this parameter',
						displayOptions: {
							show: {
								name: ['customer_useragent'],
							},
						},
					},
					{
						displayName: 'Customer ZIP',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '10001',
						description: 'The name of the zip code of customer location',
						displayOptions: {
							show: {
								name: ['customer_zip'],
							},
						},
					},
					{
						displayName: 'CVV Verification Result',
						name: 'cvvResultValue',
						type: 'boolean',
						default: false,
						description: 'Whether CVV/CSV verification passed',
						displayOptions: {
							show: {
								name: ['cvv_result'],
							},
						},
					},
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
								description: 'The action your customer try to implement',
							},
							{
								name: 'Billing City',
								value: 'billing_city',
								description: 'The billing city name of the customer',
								placeholder: 'New York',
							},
							{
								name: 'Billing Country',
								value: 'billing_country',
								description: 'The billing country code (ISO 3166-1 alpha-2)',
								placeholder: 'US',
							},
							{
								name: 'Billing Latitude',
								value: 'billing_latitude',
								description: "The latitude of the customer's billing address (GPS Coordinates)",
								placeholder: '40.7128',
							},
							{
								name: 'Billing Longitude',
								value: 'billing_longitude',
								description: "The longitude of the customer's billing address (GPS Coordinates)",
								placeholder: '-74.0060',
							},
							{
								name: 'Billing Region',
								value: 'billing_region',
								description: 'The billing region name of the customer',
								placeholder: 'New York',
							},
							{
								name: 'Billing Street',
								value: 'billing_street',
								description: 'The billing "address 1" of the customer',
								placeholder: '123 Main Street',
							},
							{
								name: 'Billing Street 2',
								value: 'billing_street2',
								description: 'The billing "address 2" of the customer',
								placeholder: 'Apt 4B',
							},
							{
								name: 'Billing ZIP',
								value: 'billing_zip',
								description: "The zip code of the customer's billing address",
								placeholder: '10001',
							},
							{
								name: 'Card Expiry',
								value: 'card_expiry',
								description: 'The expiry date of the customer debit/credit card',
								placeholder: '12/25',
							},
							{
								name: 'Card Name',
								value: 'card_name',
								description: 'The name on the card (Cardholder Name)',
								placeholder: 'John Doe',
							},
							{
								name: 'Card Number',
								value: 'card_number',
								description: 'The card number (min: 6 digits)',
								placeholder: '4111111111111111',
							},
							{
								name: 'Coupon',
								value: 'coupon',
								description: 'The promo code used by the customer to complete the checkout',
								placeholder: 'SAVE20',
							},
							{
								name: 'Customer 2FA',
								value: 'customer_2fa',
								description: 'Set this to true if the customer has 2FA enabled in his/her account',
							},
							{
								name: 'Customer Balance',
								value: 'customer_balance',
								description:
									'If you offer a Wallet feature, pass the user balance to this parameter',
								placeholder: '250.50',
							},
							{
								name: 'Customer City',
								value: 'customer_city',
								description: 'The name of the city where the customer live',
								placeholder: 'New York',
							},
							{
								name: 'Customer Country',
								value: 'customer_country',
								description:
									'The ISO 3166-1 alpha-2 code format of the country where the customer live',
								placeholder: 'US',
							},
							{
								name: 'Customer Date of Birth',
								value: 'customer_dob',
								description: "The customer's date of birth",
								placeholder: '1985-12-27',
							},
							{
								name: 'Customer Device ID',
								value: 'customer_device_id',
								description: 'The device identification code of the customer',
								placeholder: 'ABC123DEF456',
							},
							{
								name: 'Customer Email',
								value: 'customer_email',
								description: 'The email address of the customer',
								placeholder: 'customer@example.com',
							},
							{
								name: 'Customer First Name',
								value: 'customer_firstname',
								description: 'The first name of the customer',
								placeholder: 'John',
							},
							{
								name: 'Customer ID',
								value: 'customer_id',
								description: 'The identification number of the customer in your system',
								placeholder: '12345',
							},
							{
								name: 'Customer IP',
								value: 'customer_ip',
								description: 'The IP address of the customer',
								placeholder: '192.168.1.1',
							},
							{
								name: 'Customer Last Name',
								value: 'customer_lastname',
								description: 'The last name of the customer (Family Name)',
								placeholder: 'Doe',
							},
							{
								name: 'Customer Latitude',
								value: 'customer_latitude',
								description: 'The customer latitude on the map (GPS Coordinates)',
								placeholder: '40.7128',
							},
							{
								name: 'Customer Longitude',
								value: 'customer_longitude',
								description: 'The customer longitude on the map (GPS Coordinates)',
								placeholder: '-74.0060',
							},
							{
								name: 'Customer Phone',
								value: 'customer_phone',
								description: 'The phone number of the customer (international format)',
								placeholder: '+1234567890',
							},
							{
								name: 'Customer Place of Birth',
								value: 'customer_pob',
								description: 'The Place of Birth of the customer',
								placeholder: 'New York',
							},
							{
								name: 'Customer Region',
								value: 'customer_region',
								description: 'The name of the region where the customer live',
								placeholder: 'New York',
							},
							{
								name: 'Customer Registration Date',
								value: 'customer_registration_date',
								description: 'The registration date of the customer (UNIX Timestamp)',
								placeholder: '1672531200',
							},
							{
								name: 'Customer Street',
								value: 'customer_street',
								description: 'The "address line 1" of the customer',
								placeholder: '123 Main Street',
							},
							{
								name: 'Customer Street 2',
								value: 'customer_street2',
								description: 'The "address line 2" of the customer',
								placeholder: 'Apt 4B',
							},
							{
								name: 'Customer User Agent',
								value: 'customer_useragent',
								description: 'Pass the User Agent of the customer to this parameter',
								placeholder: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
							},
							{
								name: 'Customer ZIP',
								value: 'customer_zip',
								description: 'The name of the zip code of customer location',
								placeholder: '10001',
							},
							{
								name: 'CVV Result',
								value: 'cvv_result',
								description:
									'Set this to true if the customer passed the CVV/CSV verification process',
							},
							{
								name: 'Has Digital Products',
								value: 'isDigitalProducts',
								description: 'Set this to true if the customer is purchasing a digital product',
							},
							{
								name: 'Merchant ID',
								value: 'merchant_id',
								description:
									'If your a service provider with "sub-websites" (like Shopify), provide a unique identification code',
								placeholder: '12330098',
							},
							{
								name: 'Payment Type',
								value: 'payment_type',
								description: 'The payment method used to complete this transaction',
							},
							{
								name: 'Shipment ID',
								value: 'shipment_id',
								description: 'The identification code of the shipment',
								placeholder: 'SHP123456',
							},
							{
								name: 'Shipping City',
								value: 'shipping_city',
								description: 'The shipping city name of the customer',
								placeholder: 'New York',
							},
							{
								name: 'Shipping Country',
								value: 'shipping_country',
								description:
									'The shipping country code of the customer (in ISO 3166-1 alpha-2 format)',
								placeholder: 'US',
							},
							{
								name: 'Shipping Latitude',
								value: 'shipping_latitude',
								description: "The latitude of the customer's shipping address (GPS Coordinates)",
								placeholder: '40.7128',
							},
							{
								name: 'Shipping Longitude',
								value: 'shipping_longitude',
								description: "The longitude of the customer's shipping address (GPS Coordinates)",
								placeholder: '-74.0060',
							},
							{
								name: 'Shipping Region',
								value: 'shipping_region',
								description: 'The shipping region name of the customer',
								placeholder: 'New York',
							},
							{
								name: 'Shipping Street',
								value: 'shipping_street',
								description: 'The shipping "address 1" of the customer',
								placeholder: '123 Main Street',
							},
							{
								name: 'Shipping Street 2',
								value: 'shipping_street2',
								description: 'The shipping "address 2" of the customer',
								placeholder: 'Apt 4B',
							},
							{
								name: 'Shipping ZIP',
								value: 'shipping_zip',
								description: "The zip code of the customer's shipping address",
								placeholder: '10001',
							},
							{
								name: 'Transaction Amount',
								value: 'transaction_amount',
								description: 'The total amount of the transaction',
								placeholder: '99.99',
							},
							{
								name: 'Transaction Currency',
								value: 'transaction_currency',
								description: 'The currency in which the customer pay with',
								placeholder: 'USD',
							},
							{
								name: 'Transaction ID',
								value: 'transaction_id',
								description: 'The identification code of the transaction in your system',
								placeholder: 'TXN123456',
							},
							{
								name: 'Website Domain',
								value: 'website_domain',
								description: 'The domain name of the website the customer trying to purchase from',
								placeholder: 'example.com',
							},
							{
								name: 'Website Name',
								value: 'website_name',
								description: 'The name of the website the customer trying to purchase from',
								placeholder: 'Nike Store',
							},
						],
					},
					{
						displayName: 'Is Digital Product',
						name: 'isDigitalProductsValue',
						type: 'boolean',
						default: false,
						description: 'Whether this is a digital product',
						displayOptions: {
							show: {
								name: ['isDigitalProducts'],
							},
						},
					},
					{
						displayName: 'Merchant ID',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '12330098',
						description:
							'If your a service provider with "sub-websites" (like Shopify), provide a unique identification code',
						displayOptions: {
							show: {
								name: ['merchant_id'],
							},
						},
					},
					{
						displayName: 'Payment Type Value',
						name: 'paymentTypeValue',
						type: 'options',
						default: 'cards',
						description: 'The payment method used to complete this transaction',
						options: [
							{
								name: 'Apple Pay',
								value: 'applepay',
								description: 'Apple Pay payment method',
							},
							{
								name: 'Bank Transfer',
								value: 'bank',
								description: 'Bank transfer or direct debit',
							},
							{
								name: 'Cards',
								value: 'cards',
								description: 'Credit/debit cards',
							},
							{
								name: 'Cards (Mada)',
								value: 'cards_mada',
								description: 'Mada cards (Saudi Arabia)',
							},
							{
								name: 'Cash on Delivery',
								value: 'cod',
								description: 'Cash on delivery payment',
							},
							{
								name: 'Cryptocurrency',
								value: 'crypto',
								description: 'Cryptocurrency payment',
							},
							{
								name: 'Digital Wallet',
								value: 'wallet',
								description: 'Digital wallet payment',
							},
							{
								name: 'STC Pay',
								value: 'stcpay',
								description: 'STC Pay digital wallet',
							},
						],
						displayOptions: {
							show: {
								name: ['payment_type'],
							},
						},
					},
					{
						displayName: 'Shipment ID',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'SHP123456',
						description: 'The identification code of the shipment',
						displayOptions: {
							show: {
								name: ['shipment_id'],
							},
						},
					},
					{
						displayName: 'Shipping City',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The shipping city name of the customer',
						displayOptions: {
							show: {
								name: ['shipping_city'],
							},
						},
					},
					{
						displayName: 'Shipping Country',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'US',
						description: 'The shipping country code of the customer (in ISO 3166-1 alpha-2 format)',
						displayOptions: {
							show: {
								name: ['shipping_country'],
							},
						},
					},
					{
						displayName: 'Shipping Latitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '40.7128',
						description: "The latitude of the customer's shipping address (GPS Coordinates)",
						displayOptions: {
							show: {
								name: ['shipping_latitude'],
							},
						},
					},
					{
						displayName: 'Shipping Longitude',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '-74.0060',
						description: "The longitude of the customer's shipping address (GPS Coordinates)",
						displayOptions: {
							show: {
								name: ['shipping_longitude'],
							},
						},
					},
					{
						displayName: 'Shipping Region',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'New York',
						description: 'The shipping region name of the customer',
						displayOptions: {
							show: {
								name: ['shipping_region'],
							},
						},
					},
					{
						displayName: 'Shipping Street',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '123 Main Street',
						description: 'The shipping "address 1" of the customer',
						displayOptions: {
							show: {
								name: ['shipping_street'],
							},
						},
					},
					{
						displayName: 'Shipping Street 2',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Apt 4B',
						description: 'The shipping "address 2" of the customer',
						displayOptions: {
							show: {
								name: ['shipping_street2'],
							},
						},
					},
					{
						displayName: 'Shipping ZIP',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '10001',
						description: "The zip code of the customer's shipping address",
						displayOptions: {
							show: {
								name: ['shipping_zip'],
							},
						},
					},
					{
						displayName: 'Transaction Amount',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '99.99',
						description: 'The total amount of the transaction',
						displayOptions: {
							show: {
								name: ['transaction_amount'],
							},
						},
					},
					{
						displayName: 'Transaction Currency',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'USD',
						description: 'The currency in which the customer pay with',
						displayOptions: {
							show: {
								name: ['transaction_currency'],
							},
						},
					},
					{
						displayName: 'Transaction ID',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'TXN123456',
						description: 'The identification code of the transaction in your system',
						displayOptions: {
							show: {
								name: ['transaction_id'],
							},
						},
					},
					{
						displayName: 'Website Domain',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'domain.com',
						description: 'The domain name of the website the customer trying to purchase from',
						displayOptions: {
							show: {
								name: ['website_domain'],
							},
						},
					},
					{
						displayName: 'Website Name',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: 'Nike Store, California',
						description: 'The name of the website the customer trying to purchase from',
						displayOptions: {
							show: {
								name: ['website_name'],
							},
						},
					},
				],
			},
		],
	},
	// Cart Items Data
	{
		displayName: 'Cart Items',
		name: 'cartItems',
		type: 'fixedCollection',
		default: {},
		description: 'Add cart items to be included in the payment fraud detection',
		placeholder: 'Add Cart Item',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['riskScoring'],
				operation: ['paymentFraudDetection'],
				includeCartItems: [true],
			},
		},
		options: [
			{
				displayName: 'Cart Item',
				name: 'cartItem',
				values: [
					{
						displayName: 'Item Fields',
						name: 'itemFields',
						type: 'fixedCollection',
						default: {},
						description: 'Define the fields for this cart item',
						placeholder: 'Add Item Field',
						typeOptions: {
							multipleValues: true,
						},
						options: [
							{
								displayName: 'Field',
								name: 'field',
								values: [
									{
										displayName: 'Field Name',
										name: 'name',
										type: 'options',
										default: 'item_id',
										description: 'Select the cart item field',
										options: [
											{
												name: 'Item Category ID',
												value: 'item_category_id',
												description: 'Product category identifier',
											},
											{
												name: 'Item ID',
												value: 'item_id',
												description: 'Product/item identification',
											},
											{ name: 'Item Name', value: 'item_name', description: 'Product/item name' },
											{
												name: 'Item Price',
												value: 'item_price',
												description: 'Price per item (float/number)',
											},
											{
												name: 'Item Quantity',
												value: 'item_quantity',
												description: 'Quantity of the item (integer)',
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
										displayOptions: {
											hide: {
												name: [
													'item_category_id',
													'item_id',
													'item_name',
													'item_price',
													'item_quantity',
												],
											},
										},
									},
									{
										displayName: 'Item Category ID',
										name: 'value',
										type: 'string',
										default: '',
										placeholder: 'CAT001',
										description: 'Category ID of the item',
										displayOptions: {
											show: {
												name: ['item_category_id'],
											},
										},
									},
									{
										displayName: 'Item ID',
										name: 'value',
										type: 'string',
										default: '',
										placeholder: '123',
										description: 'Unique identifier for the item',
										displayOptions: {
											show: {
												name: ['item_id'],
											},
										},
									},
									{
										displayName: 'Item Name',
										name: 'value',
										type: 'string',
										default: '',
										placeholder: 'Product Name',
										description: 'Name of the item',
										displayOptions: {
											show: {
												name: ['item_name'],
											},
										},
									},
									{
										displayName: 'Item Price',
										name: 'value',
										type: 'string',
										default: '',
										placeholder: '29.99',
										description: 'Price of the item',
										displayOptions: {
											show: {
												name: ['item_price'],
											},
										},
									},
									{
										displayName: 'Item Quantity',
										name: 'value',
										type: 'string',
										default: '',
										placeholder: '2',
										description: 'Quantity of the item',
										displayOptions: {
											show: {
												name: ['item_quantity'],
											},
										},
									},
								],
							},
						],
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
				description: 'Whether to list the profane words in the response',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Score Only',
				name: 'scoreOnly',
				description: 'Whether to return only the scoring of the text',
				type: 'boolean',
				default: false,
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
