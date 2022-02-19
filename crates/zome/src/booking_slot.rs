use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

use crate::utils::{try_get_and_convert, CreateEntryOutput};

#[hdk_entry(id = "time_range", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct TimeRange {
    pub start_time: Timestamp,
    pub end_time: Timestamp,
}

#[hdk_entry(id = "booking_slot", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookingSlot {
    pub resource_hash: EntryHashB64,
    pub time_range: TimeRange,
}

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct CreateBookableSlotInput {
    resource_hash: EntryHashB64,
    time_range: TimeRange,
}

#[hdk_extern]
pub fn create_booking_slot(slot: BookingSlot) -> ExternResult<CreateEntryOutput<BookingSlot>> {
    let booking_slot_hash = hash_entry(&slot)?;

    create_entry(&slot)?;

    create_link(
        slot.clone().resource_hash.into(),
        booking_slot_hash.clone(),
        LinkTag::new("pending"),
    )?;

    Ok(CreateEntryOutput {
        entry_hash: booking_slot_hash.into(),
        entry: slot,
    })
}

#[hdk_extern]
pub fn get_booking_slots(
    resource_hash: EntryHashB64,
) -> ExternResult<BTreeMap<EntryHashB64, BookingSlot>> {
    let links = get_links(resource_hash.into(), None)?;

    let mut slots: BTreeMap<EntryHashB64, BookingSlot> = BTreeMap::new();

    for link in links {
        let slot: BookingSlot = try_get_and_convert(link.target.clone())?;

        slots.insert(EntryHashB64::from(link.target), slot);
    }

    Ok(slots)
}
