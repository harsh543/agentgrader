export interface Example {
  id: string;
  label: string;
  schema: string;
}

export const ZENDESK_SCHEMA = `{
  "name": "create_zendesk_ticket",
  "description": "Create a new support ticket in Zendesk.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "subject": {
        "type": "string",
        "description": "Short summary of the issue."
      },
      "comment": {
        "type": "string",
        "description": "The first comment / body of the ticket."
      },
      "priority": {
        "type": "string",
        "enum": ["low", "normal", "high", "urgent"],
        "description": "Ticket priority."
      },
      "requester_id": {
        "type": "integer",
        "description": "The numeric ID of the requester."
      }
    },
    "required": ["subject", "comment", "requester_id"]
  }
}`;

export const UPDATE_CONTACT_SCHEMA = `{
  "name": "updateContact",
  "description": "Update fields on an existing CRM contact.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "contactId": { "type": "string", "description": "Contact record ID." },
      "email": { "type": "string", "description": "New email address." },
      "phone": { "type": "string", "description": "New phone number." },
      "lifecycleStage": { "type": "string", "description": "Pipeline stage." }
    },
    "required": ["contactId"]
  }
}`;

export const GET_ORDER_SCHEMA = `{
  "name": "getOrder",
  "description": "Retrieve a Shopify order by its ID.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "orderId": { "type": "string", "description": "The Shopify order ID." },
      "includeLineItems": { "type": "boolean", "description": "Include line items." }
    },
    "required": ["orderId"]
  }
}`;

export const EXAMPLES: Example[] = [
  { id: "zendesk", label: "create_zendesk_ticket", schema: ZENDESK_SCHEMA },
  { id: "contact", label: "updateContact", schema: UPDATE_CONTACT_SCHEMA },
  { id: "order", label: "getOrder", schema: GET_ORDER_SCHEMA },
];
