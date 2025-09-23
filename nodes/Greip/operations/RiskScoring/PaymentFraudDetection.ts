import { IExecuteFunctions, IHttpRequestOptions, INodeExecutionData } from 'n8n-workflow';

export async function paymentFraudDetection(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const transactionDataFields = this.getNodeParameter(
		'transactionData.fields',
		index,
		[],
	) as Array<{
		name: string;
		value?: string;
		customer2faValue?: boolean;
		cvvResultValue?: boolean;
		isDigitalProductsValue?: boolean;
		actionValue?: string;
		paymentTypeValue?: string;
	}>;

	const cartItemsData = this.getNodeParameter('cartItems.cartItem', index, []) as Array<{
		itemFields: {
			field: Array<{
				name: string;
				value: string;
			}>;
		};
	}>;

	const includeCartItems = this.getNodeParameter('includeCartItems', index, false) as boolean;

	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const data: { [key: string]: any } = {};

	for (const field of transactionDataFields) {
		if (field.name) {
			if (field.name === 'customer_2fa' && field.customer2faValue !== undefined) {
				data[field.name] = field.customer2faValue;
			} else if (field.name === 'cvv_result' && field.cvvResultValue !== undefined) {
				data[field.name] = field.cvvResultValue;
			} else if (field.name === 'isDigitalProducts' && field.isDigitalProductsValue !== undefined) {
				data[field.name] = field.isDigitalProductsValue;
			} else if (field.name === 'action' && field.actionValue !== undefined) {
				data[field.name] = field.actionValue;
			} else if (field.name === 'payment_type' && field.paymentTypeValue !== undefined) {
				data[field.name] = field.paymentTypeValue;
			} else if (field.value) {
				data[field.name] = field.value;
			}
		}
	}

	if (includeCartItems && cartItemsData && cartItemsData.length > 0) {
		const cartItemsArray: Array<{ [key: string]: any }> = [];

		for (const cartItemEntry of cartItemsData) {
			const cartItem: { [key: string]: any } = {};

			if (cartItemEntry.itemFields && cartItemEntry.itemFields.field) {
				for (const field of cartItemEntry.itemFields.field) {
					if (field.name && field.value) {
						cartItem[field.name] = field.value;
					}
				}
			}

			if (Object.keys(cartItem).length > 0) {
				cartItemsArray.push(cartItem);
			}
		}

		if (cartItemsArray.length > 0) {
			data.cart_items = cartItemsArray;
		}
	}

	// Build request body
	const requestBody: { [key: string]: any } = {
		data: data,
	};

	if (typeof additionalFields.mode === 'boolean') {
		if (additionalFields.mode) {
			requestBody.mode = 'test';
		}
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
