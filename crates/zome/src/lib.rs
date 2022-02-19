use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

mod bookable_resource;
mod bookable_request;
mod bookable_slot;
mod utils;

use bookable_resource::*;
use bookable_slot::*;
use bookable_request::*;

entry_defs![
    PathEntry::entry_def(),
    BookableResource::entry_def(),
    Booking::entry_def(),
    BookingSlot::entry_def(),
    BookingRequest::entry_def()
];

/// Creates the bookable_resource for the agent executing this call.
#[hdk_extern]
pub fn create_bookable_resource(resource_name: String) -> ExternResult<CreateBookableResourceOutput> {
    handlers::create_bookable_resource(resource_name)
}

#[hdk_extern]
pub fn get_all_resources(_: ()) -> ExternResult<BTreeMap<EntryHashB64, BookableResource>> {
    handlers::fetch_bookable_resources()
}

#[hdk_extern]
pub fn create_bookable_slot(
    _input: CreateBookableSlotInput,
) -> ExternResult<BTreeMap<EntryHashB64, BookingSlot>> {
    todo!()
}

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
