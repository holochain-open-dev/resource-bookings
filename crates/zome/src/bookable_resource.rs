use std::collections::BTreeMap;

use hdk::prelude::holo_hash::*;
use hdk::prelude::*;

use crate::utils;

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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateBookableResourceOutput {
    entry_hash: EntryHashB64,
    bookable_resource: BookableResource,
}

pub fn create_bookable_resource(
    resource_name: String,
) -> ExternResult<CreateBookableResourceOutput> {
    let bookable_resource = BookableResource::new(resource_name)?;

    create_entry(&bookable_resource.clone())?;

    let bookable_resource_hash = hash_entry(&bookable_resource.clone())?;

    let path = Path::from(ALL_RESOURCES_ANCHOR.clone());

    path.ensure()?;

    create_link(path.path_entry_hash()?, bookable_resource_hash.clone(), ())?;

    Ok(CreateBookableResourceOutput {
        entry_hash: bookable_resource_hash.into(),
        bookable_resource,
    })
}

pub fn fetch_bookable_resources() -> ExternResult<BTreeMap<EntryHashB64, BookableResource>> {
    let mut bookable_resources: BTreeMap<EntryHashB64, BookableResource> = BTreeMap::new();

    let path = Path::from(ALL_RESOURCES_ANCHOR.clone());
    let links = get_links(path.path_entry_hash()?, None)?;

    for link in links {
        let bookable_resource: BookableResource = utils::try_get_and_convert(link.target.clone())?;

        bookable_resources.insert(link.target.into(), bookable_resource);
    }

    Ok(bookable_resources)
}
