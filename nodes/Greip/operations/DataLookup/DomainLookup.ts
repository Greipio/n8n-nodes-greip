import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function domainLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const domain = this.getNodeParameter('domain', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
	};

	const qs: Record<string, string> = {};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `lookup/domains/${encodeURIComponent(domain)}`, qs, index);
}
