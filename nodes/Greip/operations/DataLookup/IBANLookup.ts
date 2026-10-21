import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function ibanLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const iban = this.getNodeParameter('iban', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: Record<string, string> = {};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `lookup/iban/${encodeURIComponent(iban)}`, qs, index);
}
