import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function asnLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const asn = this.getNodeParameter('asn', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
	};

	const qs: Record<string, string> = {};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `lookup/asn/${encodeURIComponent(asn)}`, qs, index);
}
