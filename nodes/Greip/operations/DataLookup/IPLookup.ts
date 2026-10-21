import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function ipLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const ip = this.getNodeParameter('ip', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		lang?: string;
		mode?: boolean;
		params?: string[];
		userID?: string;
	};

	const qs: Record<string, string> = {};

	if (additionalFields.lang) {
		qs.lang = additionalFields.lang;
	}
	if (additionalFields.params && additionalFields.params.length > 0) {
		qs.params = additionalFields.params.join(',');
	}
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `lookup/ip/${encodeURIComponent(ip)}`, qs, index);
}
