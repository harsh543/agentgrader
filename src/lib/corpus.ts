/** Seed corpus of known MCP tools — embedded into Aurora for similarity search. */
export interface CorpusTool {
  tool_name: string;
  app: string;
  schema: Record<string, unknown>;
}

export const CORPUS: CorpusTool[] = [
  {
    tool_name: "search_zendesk_contact",
    app: "zendesk",
    schema: {
      name: "search_zendesk_contact",
      description: "Search Zendesk users/contacts by email or name to find a requester id.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Email or name to search for." },
        },
        required: ["query"],
      },
    },
  },
  {
    tool_name: "create_hubspot_ticket",
    app: "hubspot",
    schema: {
      name: "create_hubspot_ticket",
      description: "Create a new support ticket in HubSpot Service Hub.",
      inputSchema: {
        type: "object",
        properties: {
          subject: { type: "string", description: "Ticket subject line." },
          content: { type: "string", description: "Ticket body." },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
          contactId: { type: "string", description: "Associated contact id." },
        },
        required: ["subject"],
      },
    },
  },
  {
    tool_name: "getOrder",
    app: "shopify",
    schema: {
      name: "getOrder",
      description: "Retrieve a Shopify order by its id.",
      inputSchema: {
        type: "object",
        properties: {
          orderId: { type: "string", description: "The Shopify order id." },
          includeLineItems: { type: "boolean", description: "Include line items." },
        },
        required: ["orderId"],
      },
    },
  },
  {
    tool_name: "create_stripe_refund",
    app: "stripe",
    schema: {
      name: "create_stripe_refund",
      description: "Issue a refund for a Stripe charge.",
      inputSchema: {
        type: "object",
        properties: {
          chargeId: { type: "string", description: "Charge to refund." },
          amount: { type: "integer", description: "Amount in cents." },
        },
        required: ["chargeId"],
      },
    },
  },
  {
    tool_name: "send_slack_message",
    app: "slack",
    schema: {
      name: "send_slack_message",
      description: "Post a message to a Slack channel.",
      inputSchema: {
        type: "object",
        properties: {
          channel: { type: "string", description: "Channel id or name." },
          text: { type: "string", description: "Message text." },
        },
        required: ["channel", "text"],
      },
    },
  },
  {
    tool_name: "update_salesforce_lead",
    app: "salesforce",
    schema: {
      name: "update_salesforce_lead",
      description: "Update fields on an existing Salesforce lead record.",
      inputSchema: {
        type: "object",
        properties: {
          leadId: { type: "string", description: "Lead record id." },
          status: { type: "string", description: "New lead status." },
        },
        required: ["leadId"],
      },
    },
  },
];
