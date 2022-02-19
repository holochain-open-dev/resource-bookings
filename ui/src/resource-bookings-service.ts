import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { BookableResource, BookingSlot, CreateEntryOutput, BookingRequest } from './types';

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

  async cancelBookingRequest(
    request: BookingRequest
  ): Promise<CreateEntryOutput<BookingSlot>> {
    return this.callZome('delete_booking_request', request);
  }

  async getBookingSlots(
    resourceHash: EntryHashB64
  ): Promise<Record<EntryHashB64, BookingSlot>> {
    return this.callZome('get_booking_slots', resourceHash);
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
