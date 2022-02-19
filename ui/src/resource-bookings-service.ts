import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHashB64 } from '@holochain-open-dev/core-types';
import {
  BookableResource,
  BookingRequest,
  BookingRequestDetails,
  BookingSlot,
  CreateEntryOutput,
} from './types';

export class ResourceBookingsService {
  constructor(
    public cellClient: CellClient,
    public zomeName = 'resource_bookings'
  ) {}

  /**
   * Get my resourceBooking, if it has been created
   * @returns my resourceBooking
   */
  async createBookableResource(
    name: string
  ): Promise<CreateEntryOutput<BookableResource>> {
    return this.callZome('create_bookable_resource', name);
  }

  async getAllResources(): Promise<Record<EntryHashB64, BookableResource>> {
    return this.callZome('get_all_resources', null);
  }

  async getMyResources(): Promise<Record<EntryHashB64, BookableResource>> {
    return this.callZome('get_my_resources', null);
  }

  async createBookingSlot(
    slot: BookingSlot
  ): Promise<CreateEntryOutput<BookingSlot>> {
    return this.callZome('create_booking_slot', slot);
  }

  async getBookingSlots(
    resourceHash: EntryHashB64
  ): Promise<Record<EntryHashB64, BookingSlot>> {
    return this.callZome('get_booking_slots', resourceHash);
  }

  async createBookingRequest(
    slotHashes: EntryHashB64[]
  ): Promise<CreateEntryOutput<BookingRequest>> {
    return this.callZome('create_booking_request', slotHashes);
  }

  async getBookingRequests(
    slotHash: EntryHashB64
  ): Promise<Record<EntryHashB64, BookingRequestDetails>> {
    return this.callZome('get_booking_requests', slotHash);
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
