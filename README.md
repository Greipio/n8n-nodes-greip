# n8n Nodes - Greip Integration

This is an n8n community node that integrates with the Greip API, allowing users to interact with Greip's services directly from n8n workflows.

[Greip](https://greip.io) is a platform that provides various services for fraud detection, proxy detection, content moderation, and more.

## Table of contents

## Installation (self-hosted)

To install the Greip community node directly from the n8n Editor UI:

1. Open your n8n instance.
2. Go to Settings > Community Nodes
3. Select Install.
4. Enter the npm package name: n8n-nodes-greip to install the latest version.
5. Agree to the risks of using community nodes and select Install.
6. The node is now available to use in your workflows.

## Installation (n8n Cloud)

If you're using n8n Cloud, installing community nodes is even simpler:

1. Go to the Canvas and open the nodes panel.
2. Search for Greip in the community node registry.
3. Click Install node to add the Greip node to your instance.

> On n8n cloud users can choose not to show verified community nodes. Instance owners can toggle this in the Cloud Admin Panel. To install the Greip node, make sure the installation of verified community nodes is enabled.

## Operations

This node supports a wide range of Greip operations, organized by resource type:

### Data Lookup

- ASN Lookup: Retrieve Autonomous System Number information and prefixes by AS number.
- BIN Lookup: Get Bank Identification Number details.
- IP Lookup: Retrieve information about an IP address, including location, ASN, security threats, and more.
- Country Lookup: Get details about a country using its ISO code.
- Domain Lookup: Fetch information about a domain, including its registration details and associated threats.
- IBAN Lookup: Retrieve International Bank Account Number information.

### Risk Scoring

- Email Scoring: Assess the risk associated with an email address.
- IP Scoring: Evaluate the risk level of an IP address.
- Phone Scoring: Determine the risk score of a phone number.
- Payment Fraud Detection: Analyze payment details for potential fraud.
- Profanity Detection: Check text for offensive language and profanity.

## AI Tools

All Greip node operations can be combined with n8n's AI tools to create powerful workflows. For example, you can use AI to generate personalized marketing messages and then use the Greip Email Scoring operation to ensure the email addresses are valid and low-risk.

## Credentials

To use the Greip node, you need to set up your Greip API credentials in n8n:

1. Go to Settings > Credentials in n8n.
2. Click on New Credential and select Greip API from the list.
3. Enter your Greip API Key, which you can obtain from your Greip account dashboard.
4. Save the credentials.

## Compatibility

This node has been tested with n8n version `1.112.3`.

## Resources

- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Greip API Documentation](https://docs.greip.io/knowledge-base/integrations/n8n)

## Troubleshooting

### Common issues

1. Authentication errors
   - Ensure that your Greip API Key is correct and has the necessary permissions.
   - Check for any typos or formatting issues in the API Key.
2. Resource Not Found
   - Verify that the resource you are trying to access exists and that you have the correct identifiers.
   - Ensure you have access to the resource based on your Greip account plan.
3. Operation failures
   - Double-check the parameters you are passing to the operation.
   - Verify resource limits (memory, timeout)

### Getting help

If you encounter any issues or need assistance with the Greip node, consider the following options:

1. Check our [N8N integration guide](https://docs.greip.io/knowledge-base/integrations/n8n)
2. Review the [n8n Community Nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
3. Open an issue in the [GitHub repository](https://github.com/Greipio/n8n-nodes-greip)
