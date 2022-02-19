import { AgentPubKeyB64, EntryHashB64 } from '@holochain-open-dev/core-types';
import { Timestamp } from '@holochain/client';

export interface BookableResource {
  name: string;
  createdAt: Timestamp; // Careful with the ms conversion
  author: AgentPubKeyB64;
}

export interface BookingRequest {
  bookingSlotHashes: Array<EntryHashB64>;
  resourceUser: AgentPubKeyB64;
}

export interface TimeRange {
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface BookingSlot {
  resourceHash: EntryHashB64;
  timeRange: TimeRange;
}

export interface Booking {
  slots: Array<BookingSlot>;
  resourceUser: AgentPubKeyB64;
}

export interface CreateBookableResourceOutput {
  entryHash: EntryHashB64;
  bookableResource: BookableResource;
}
