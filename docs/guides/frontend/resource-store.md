# Frontend Docs >> ResourceStore ||20

The `ResourceStore` is a JS class that contains `svelte` stores, to which you can subscribe to get reactive updates in your elements.

```js
import { ResourceStore } from "@holochain-open-dev/resource";

const config = {
  avatarMode: "identicon",
  additionalFields: ["Location", "Bio"], // Custom app level resource-booking fields
};
const store = new ResourceStore(cellClient, config);
```

> Learn how to setup the `CellClient` object [here](https://www.npmjs.com/package/@holochain-open-dev/cell-client).

The config for the `ResourceStore` has these options:

```ts
export interface ResourceConfig {
  zomeName: string; // default: 'resource'
  avatarMode: "identicon" | "avatar"; // default: 'avatar'
  additionalFields: string[]; // default: []
  minNicknameLength: number; // default: 3
}
```

Learn more about the stores and how to integrate them in different frameworks [here](https://holochain-open-dev.github.io/reusable-modules/frontend/using/#stores).
