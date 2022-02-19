import { CellClient } from '@holochain-open-dev/cell-client';
import {
  AgentPubKeyB64,
  Dictionary,
  EntryHashB64,
  serializeHash,
} from '@holochain-open-dev/core-types';
import merge from 'lodash-es/merge';

import { ResourceBookingsService } from './resource-bookings-service';
import {
  BookableResource,
  Booking,
  BookingRequest,
  BookingSlot,
  CreateBookableResourceOutput,
} from './types';
import { writable, Writable, derived, Readable, get } from 'svelte/store';
import { defaultConfig, ResourceConfig } from './config';

export interface ResourceBookingsState {
  resources: Record<EntryHashB64, BookableResource>;
  bookingSlots: Record<EntryHashB64, BookingSlot>;
  bookingRequests: Record<EntryHashB64, BookingRequest>;
  bookings: Record<EntryHashB64, Booking>;
}

export class ResourceBookingsStore {
  /** Private */
  private _service: ResourceBookingsService;
  private _bookingsStore: Writable<ResourceBookingsState> = writable({
    resources: {},
    bookingRequests: {},
    bookingSlots: {},
    bookings: {},
  });

  /** Static info */
  public myAgentPubKey: AgentPubKeyB64;

  /** Readable stores */

  // Store containing all the resource that have been fetched
  // The key is the agentPubKey of the agent
  public allResources: Readable<Record<EntryHashB64, BookableResource>> =
    derived(this._bookingsStore, i => i.resources);

  config: ResourceConfig;

  constructor(
    protected cellClient: CellClient,
    config: Partial<ResourceConfig> = {}
  ) {
    this.config = merge(defaultConfig, config);
    this._service = new ResourceBookingsService(
      cellClient,
      this.config.zomeName
    );
    this.myAgentPubKey = serializeHash(cellClient.cellId[1]);
  }

  /** Actions */

  /**
   * Fetches all the resources in the DHT
   *
   * You can subscribe to `allResources` to get updated with all the resource when this call is done
   *
   * Warning! Can be very slow
   */
  async fetchAllResources(): Promise<void> {
    const allResources = await this._service.getAllResources();

    this._bookingsStore.update(state => {
      state.resources = {
        ...state.resources,
        ...allResources,
      };
      return state;
    });
  }

  async createBookableResource(name: string): Promise<CreateBookableResourceOutput> {
    const resource = await this._service.createBookableResource(name);

    this._bookingsStore.update(state => {
      state.resources = {
        ...state.resources,
        [resource.entryHash]: resource.bookableResource,
      };
      return state;
    });

    return resource;
  }
}
