use crate::entries::booking_slot::BookingSlot;
use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

#[hdk_entry(id = "booking", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct Booking {
    pub slots: Vec<BookingSlot>,
    pub resource_user: AgentPubKeyB64,
}
