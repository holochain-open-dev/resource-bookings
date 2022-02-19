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

