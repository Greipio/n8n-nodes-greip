import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function paymentFraudDetection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	// Get transaction data fields
	const transactionDataFields = this.getNodeParameter(
		'transactionData.fields',
		index,
		[],
	) as Array<{
		name: string;
		value: string;
	}>;

	// Get cart items data if available
	const cartItemsData = this.getNodeParameter('cartItemsData.fields', index, []) as Array<{
		name: string;
		value: string;
	}>;

	// Get additional fields
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
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

	return {
		json: response,
		pairedItem: { item: index },
	};
}