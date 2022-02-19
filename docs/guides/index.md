# Guides

The resource zome and its accompanying frontend module are designed to implement and export useful functionality around personal resource-booking information about the agents in a Holochain DHT.

The only field that this module assumes

Existing functionalities:

- Creating a resource-booking.
- Updating a resource-booking.
- Searching agents by nickname.
- Getting the resource-booking for a list of agents.

Future functionality will include:

- Configurable resource-booking fields.
- BookableResource detail frontend element.

> In the future, when the personas & resource application is fully developed, this module will switch to storing data in it, and will serve only as a bridge to get that private data. We hope to maintain the modules and their interfaces as similar as they are now, and that the migration friction is low.

Get started with adding the module into your Holochain app by reading the [Setting Up section](./setting-up/adding-the-zome.md).
