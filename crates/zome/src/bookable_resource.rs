use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

use crate::utils::{self, CreateEntryOutput};

pub const ALL_RESOURCES_ANCHOR: &str = "all_resources";

#[hdk_entry(id = "bookable_resource", visibility = "public")]
#[derive(Clone)]
#[serde(rename_all = "camelCase")]
pub struct BookableResource {
    pub name: String,
    pub created_at: Timestamp,
    pub author: AgentPubKeyB64,
}

impl BookableResource {
    pub fn new(name: String) -> ExternResult<Self> {
        Ok(BookableResource {
            name,
            created_at: sys_time()?,
            author: agent_info()?.agent_latest_pubkey.into(),
        })
    }
}

#[hdk_extern]
pub fn create_bookable_resource(
    resource_name: String,
) -> ExternResult<CreateEntryOutput<BookableResource>> {
    let bookable_resource = BookableResource::new(resource_name)?;

    create_entry(&bookable_resource.clone())?;

    let bookable_resource_hash = hash_entry(&bookable_resource.clone())?;

    let path = Path::from(ALL_RESOURCES_ANCHOR.clone());

    path.ensure()?;

    create_link(path.path_entry_hash()?, bookable_resource_hash.clone(), ())?;
    create_link(
        agent_info()?.agent_initial_pubkey.into(),
        bookable_resource_hash.clone(),
        (),
    )?;

    Ok(CreateEntryOutput {
        entry_hash: bookable_resource_hash.into(),
        entry: bookable_resource,
    })
}

#[hdk_extern]
pub fn get_my_resources(_: ()) -> ExternResult<BTreeMap<EntryHashB64, BookableResource>> {
    get_resources_from_base(EntryHash::from(agent_info()?.agent_initial_pubkey))
}

#[hdk_extern]
pub fn get_all_resources(_: ()) -> ExternResult<BTreeMap<EntryHashB64, BookableResource>> {
    let path = Path::from(ALL_RESOURCES_ANCHOR.clone());

    get_resources_from_base(path.path_entry_hash()?)
}

pub fn get_resources_from_base(
    entry_hash: EntryHash,
) -> ExternResult<BTreeMap<EntryHashB64, BookableResource>> {
    let mut bookable_resources: BTreeMap<EntryHashB64, BookableResource> = BTreeMap::new();

    let links = get_links(entry_hash, None)?;

    for link in links {
        let bookable_resource: BookableResource = utils::try_get_and_convert(link.target.clone())?;

        bookable_resources.insert(link.target.into(), bookable_resource);
    }

    Ok(bookable_resources)
}
