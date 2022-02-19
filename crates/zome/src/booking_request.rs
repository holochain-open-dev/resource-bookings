use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

#[hdk_entry(id = "booking_request", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookingRequest {
    pub booking_slot_hashes: Vec<EntryHashB64>,
    pub resource_user: AgentPubKeyB64,
    // TODO: is timestamp required?
}
