use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

use crate::utils::CreateEntryOutput;

#[hdk_entry(id = "booking_request", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookingRequest {
    pub booking_slot_hashes: Vec<EntryHashB64>,
    pub resource_user: AgentPubKeyB64,
    // TODO: is timestamp required?
}

#[hdk_extern]
pub fn create_booking_request(
    booking_slot_hashes: Vec<EntryHashB64>,
) -> ExternResult<CreateEntryOutput<BookingRequest>> {
    let request = BookingRequest {
        booking_slot_hashes: booking_slot_hashes.clone(),
        resource_user: agent_info()?.agent_initial_pubkey.into(),
    };

    create_entry(&request)?;

    let hash = hash_entry(&request)?;

    for slot_hash in booking_slot_hashes {
        create_link(slot_hash.into(), hash.clone(), LinkTag::new("pending"))?;
    }

    Ok(CreateEntryOutput {
        entry_hash: hash.into(),
        entry: request,
    })
}

#[derive(Serialize, Debug, Deserialize)]
pub enum RequestStatus {
    Pending,
    Rejected,
    Booked,
}

#[derive(Serialize, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BookingRequestDetails {
    booking_request: BookingRequest,
    request_status: RequestStatus,
}

#[hdk_extern]
pub fn get_booking_requests_details(
    slot_hash: EntryHashB64,
) -> ExternResult<BTreeMap<EntryHashB64, BookingRequestDetails>> {
    // get_links_details(slot_hash)

    // all the links with “pending” LinkTag -> request pending
    // all the deleted links -> request rejected
    // all the links with “booked” -> request booked
    // get everything
    // if an entry is undefined -> it means the request was canceled, filter out
}

#[hdk_extern]
pub fn cancel_booking_request(booking_request_header_hash: HeaderHashB64) -> ExternResult<()> {
    delete_entry(booking_request_header_hash.into())?;
    Ok(())
}
