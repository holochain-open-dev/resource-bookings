import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';

import { StoreSubscriber } from 'lit-svelte-stores';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { contextProvided } from '@holochain-open-dev/context';
import {
  CircularProgress,
  ListItem,
  List,
} from '@scoped-elements/material-web';
import { ResourceTimeline } from '@scoped-elements/fullcalendar';

import { sharedStyles } from './utils/shared-styles';
import { ResourceBookingsStore } from '../resource-bookings-store';
import { resourceStoreContext } from '../context';

/**
 * @element list-resource-bookings
 * @fires agent-selected - Fired when the user selects an agent from the list. Detail will have this shape: { agentPubKey: 'uhCAkSEspAJks5Q8863Jg1RJhuJHJpFWzwDJkxVjVSk9JueU' }
 */
export class ResourceBookingsTimeline extends ScopedElementsMixin(LitElement) {
  /** Dependencies */

  /**
   * `ResourceStore` that is requested via context.
   * Only set this property if you want to override the store requested via context.
   */
  @contextProvided({ context: resourceStoreContext })
  @property({ type: Object })
  store!: ResourceBookingsStore;

  /** Private properties */

  @state()
  private _loading = true;

  private _allResources = new StoreSubscriber(
    this,
    () => this.store?.allResources
  );

  async firstUpdated() {
    await this.store.fetchAllResources();
    this._loading = false;
  }

  get resources() {
    return Object.entries(this._allResources.value).map(([entryHash, resource]) => ({
      id: entryHash,
      title: resource.name,
    }));
  }

  render() {
    if (this._loading)
      return html`<div class="fill center-content">
        <mwc-circular-progress indeterminate></mwc-circular-progress>
      </div>`;

    return html`
      <resource-timeline .resources=${this.resources} style="flex: 1"></resource-timeline>
    `;
  }

  static styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
      }
    `,
  ];

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'resource-timeline': ResourceTimeline,
      'mwc-circular-progress': CircularProgress,
    };
  }
}
