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
  CreateEntryOutput,
  TimeRange,
} from './types';
import { writable, Writable, derived, Readable, get } from 'svelte/store';
import { defaultConfig, ResourceConfig } from './config';
import pickBy from 'lodash-es/pickBy';

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

  public myResources: Readable<Record<EntryHashB64, BookableResource>> =
    derived(this._bookingsStore, i =>
      pickBy(i.resources, resource => resource.author === this.myAgentPubKey)
    );
  public allResources: Readable<Record<EntryHashB64, BookableResource>> =
    derived(this._bookingsStore, i => i.resources);
  public allBookingSlots: Readable<Record<EntryHashB64, BookingSlot>> = derived(
    this._bookingsStore,
    i => i.bookingSlots
  );

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
  async fetchMyResources(): Promise<void> {
    const allResources = await this._service.getMyResources();

    this._bookingsStore.update(state => {
      state.resources = {
        ...state.resources,
        ...allResources,
      };
      return state;
    });
  }

  async createBookableResource(
    name: string
  ): Promise<CreateEntryOutput<BookableResource>> {
    const resource = await this._service.createBookableResource(name);

    this._bookingsStore.update(state => {
      state.resources = {
        ...state.resources,
        [resource.entryHash]: resource.entry,
      };
      return state;
    });

    return resource;
  }

  async createBookingSlot(
    resourceHash: EntryHashB64,
    timeRange: TimeRange
  ): Promise<CreateEntryOutput<BookingSlot>> {
    const slot = await this._service.createBookingSlot({
      resourceHash,
      timeRange,
    });

    this._bookingsStore.update(state => {
      state.bookingSlots = {
        ...state.bookingSlots,
        [slot.entryHash]: slot.entry,
      };
      return state;
    });

    return slot;
  }

  async requestToBookSlot(slotHash: EntryHashB64)  {
    
  }

  async fetchBookingSlots(resourceHash: EntryHashB64): Promise<void> {
    const slots = await this._service.getBookingSlots(resourceHash);

    this._bookingsStore.update(state => {
      state.bookingSlots = {
        ...state.bookingSlots,
        ...slots,
      };
      return state;
    });
  }
}
