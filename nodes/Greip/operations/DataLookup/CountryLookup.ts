import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function countryLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const countryCode = (this.getNodeParameter('countryCode', index) as string).toUpperCase();
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		params?: string[];
		mode?: boolean;
	};

	const qs: Record<string, string> = {};

	if (additionalFields.params && additionalFields.params.length > 0) {
		qs.params = additionalFields.params.join(',');
	}
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(
		this,
		`lookup/countries/${encodeURIComponent(countryCode)}`,
		qs,
		index,
	);
}
