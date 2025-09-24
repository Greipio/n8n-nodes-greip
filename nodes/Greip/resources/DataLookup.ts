import { INodeProperties } from 'n8n-workflow';

export const dataLookupOperations: INodeProperties[] = [
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
			},
			{
				name: 'BIN Lookup',
				value: 'binLookup',
				action: 'BIN Lookup',
				description: 'Retrieve comprehensive information associated with a debit or credit card',
			},
			{
				name: 'Country Lookup',
				value: 'countryLookup',
				action: 'Country lookup',
				description: 'Retrieve detailed information about a given country',
			},
			{
				name: 'Domain Lookup',
				value: 'domainLookup',
				action: 'Domain lookup',
				description:
					'Lookup any domain name and retrieve associated data and risk evaluation metrics',
			},
			{
				name: 'IBAN Lookup',
				value: 'ibanLookup',
				action: 'IBAN Lookup',
				description:
					'Validate a given IBAN and obtain essential information about the issuing country',
			},
			{
				name: 'IP Lookup',
				value: 'ipLookup',
				action: 'IP Lookup',
				description: 'Retrieve comprehensive information about a given IP address',
			},
		],
		default: 'ipLookup',
	},
];

export const dataLookupFields: INodeProperties[] = [
	// Domain field
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
	// Country Code field
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
	// BIN field
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
	// IBAN field
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
	// ASN field
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
	// IP Address field
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
];

export const dataLookupAdditionalFields: INodeProperties[] = [
	// Additional Fields for IP Lookup
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
				displayName: 'Params',
				name: 'params',
				description: 'Specify required modules',
				type: 'multiOptions',
				options: [
					{ name: 'Security', value: 'security' },
					{ name: 'Currency', value: 'currency' },
					{ name: 'Timezone', value: 'timezone' },
					{ name: 'Location', value: 'location' },
				],
				default: [],
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
				description: 'Specify required modules',
				type: 'multiOptions',
				options: [
					{ name: 'Language', value: 'language' },
					{ name: 'Flag', value: 'flag' },
					{ name: 'Currency', value: 'currency' },
					{ name: 'Timezone', value: 'timezone' },
				],
				default: [],
			},
			{
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
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
				displayName: 'Development Environment',
				name: 'mode',
				description:
					'Whether to use test mode (mode=test). Disable in production for real data lookup/scoring.',
				type: 'boolean',
				default: false,
			},
		],
	},
];
