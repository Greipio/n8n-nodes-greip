import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function ipScoring(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const ip = this.getNodeParameter('ip', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: Record<string, string> = {};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `score/ip/${encodeURIComponent(ip)}`, qs, index);
}
