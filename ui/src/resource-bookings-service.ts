import { CellClient } from '@holochain-open-dev/cell-client';
import { EntryHashB64 } from '@holochain-open-dev/core-types';
import { BookableResource, CreateBookableResourceOutput } from './types';

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
  ): Promise<CreateBookableResourceOutput> {
    return this.callZome('create_bookable_resource', name);
  }

  async getAllResources(): Promise<Record<EntryHashB64, BookableResource>> {
    return this.callZome('get_all_resources', null);
  }

  private callZome(fn_name: string, payload: any) {
    return this.cellClient.callZome(this.zomeName, fn_name, payload);
  }
}
