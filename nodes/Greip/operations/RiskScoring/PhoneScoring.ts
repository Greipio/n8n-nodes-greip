import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

import { applyCommonQueryParams, greipApiGet } from '../../helpers/api';

export async function phoneScoring(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const phone = this.getNodeParameter('phone', index) as string;
	const countryCode = (this.getNodeParameter('countryCode', index) as string).toUpperCase();
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as {
		mode?: boolean;
		userID?: string;
	};

	const qs: Record<string, string> = {
		country_code: countryCode,
	};
	applyCommonQueryParams(qs, additionalFields);

	return greipApiGet(this, `score/phone/${encodeURIComponent(phone)}`, qs, index);
}
