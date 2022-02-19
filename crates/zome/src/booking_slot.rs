use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

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


pub fn create_booking_slot(resource_hash: EntryHashB64, time_range: TimeRange) -> ExternResult<()> {
    create_entry()?;
}