import {
	INodeTypeBaseDescription,
	VersionedNodeType,
} from 'n8n-workflow';

import { GreipV1 } from './GreipV1.node';
import { GreipV2 } from './GreipV2.node';

const baseDescription: INodeTypeBaseDescription = {
	displayName: 'Greip',
	name: 'greip',
	icon: { light: 'file:Greip.svg', dark: 'file:Greip.dark.svg' },
	group: ['transform'],
	defaultVersion: 2,
	description:
		'Get fraud prevention, threat intelligence, and risk scoring data from Greip. Version 1 uses the legacy Greip API; version 2 uses Greip API v2.',
	usableAsTool: true,
};

export class Greip extends VersionedNodeType {
	constructor() {
		super(
			{
				1: new GreipV1(),
				2: new GreipV2(),
			},
			baseDescription,
		);
	}
}
