use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

mod bookable_resource;
mod booking;
mod booking_request;
mod booking_slot;
mod utils;

use bookable_resource::*;
use booking::*;
use booking_request::*;
use booking_slot::*;

entry_defs![
    PathEntry::entry_def(),
    BookableResource::entry_def(),
    Booking::entry_def(),
    BookingSlot::entry_def(),
    BookingRequest::entry_def()
];


#[hdk_extern]
pub fn get_booking_requests(
    _slot_hash: EntryHashB64,
) -> ExternResult<Vec<BTreeMap<EntryHashB64, BookingRequest>>> {
    todo!()
}

// Booking request management
#[hdk_extern]
pub fn create_booking_request(_booking_slot: EntryHashB64) -> ExternResult<EntryHashB64> {
    todo!()
}

#[hdk_extern]
pub fn decline_booking_request(_booking_request_hash: EntryHashB64) -> ExternResult<()> {
    todo!()
}

#[hdk_extern]
pub fn cancel_booking_request(_booking_request_hash: EntryHashB64) -> ExternResult<()> {
    todo!()
}

#[hdk_extern]
pub fn accept_booking_request(_booking_request_hash: EntryHashB64) -> ExternResult<()> {
    todo!()
}

#[hdk_extern]
pub fn get_bookings_slots(
    _resource_hash: EntryHashB64,
) -> ExternResult<BTreeMap<EntryHashB64, BookingSlot>> {
    todo!()
}
