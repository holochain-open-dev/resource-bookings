use crate::booking_slot::BookingSlot;
use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

#[hdk_entry(id = "booking", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct Booking {
    pub slots: Vec<BookingSlot>,
    pub resource_user: AgentPubKeyB64,
}

#[hdk_extern]
pub fn get_booking(_slot_hash: EntryHashB64) -> ExternResult<Option<Booking>> {
    Ok(None)
}


fn _booked_tag() -> LinkTag {
    LinkTag::new("booked")
}
