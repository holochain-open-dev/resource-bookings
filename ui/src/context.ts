import { Context, createContext } from '@holochain-open-dev/context';
import { ResourceBookingsStore } from './resource-bookings-store';

export const resourceStoreContext: Context<ResourceBookingsStore> = createContext(
  'hc_zome_bookable_resources/store'
);
