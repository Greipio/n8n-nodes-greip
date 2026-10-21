import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function binLookup(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const bin = this.getNodeParameter('bin', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: Record<string, string> = {};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `lookup/bin/${encodeURIComponent(bin)}`, qs, index);
}
