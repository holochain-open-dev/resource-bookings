import { css, html, LitElement } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { DateSelectArg, EventInput } from '@fullcalendar/core';

import { StoreSubscriber } from 'lit-svelte-stores';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { contextProvided } from '@holochain-open-dev/context';
import {
  CircularProgress,
  ListItem,
  List,
  MenuSurface,
  Button,
} from '@scoped-elements/material-web';
import {
  ResourceTimeGrid,
  ResourceTimeline,
} from '@scoped-elements/fullcalendar';

import { sharedStyles } from './utils/shared-styles';
import { ResourceBookingsStore } from '../resource-bookings-store';
import { resourceStoreContext } from '../context';
import { EntryHashB64 } from '@holochain-open-dev/core-types';

/**
 * @element list-resource-bookings
 * @fires agent-selected - Fired when the user selects an agent from the list. Detail will have this shape: { agentPubKey: 'uhCAkSEspAJks5Q8863Jg1RJhuJHJpFWzwDJkxVjVSk9JueU' }
 */
export class ManageResources extends ScopedElementsMixin(LitElement) {
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

  @query('#create-slot-menu')
  _createSlotMenu!: MenuSurface;

  @query('#timeline')
  _timeline!: ResourceTimeline;

  private myResources = new StoreSubscriber(
    this,
    () => this.store?.myResources
  );
  private _allSlots = new StoreSubscriber(
    this,
    () => this.store?.allBookingSlots
  );

  @state()
  _selectedSlot: DateSelectArg | undefined;

  get selectedResourceId(): EntryHashB64 | undefined {
    return this._selectedSlot?.resource?.id;
  }

  get selectedResourceName(): string | undefined {
    if (!this.selectedResourceId) return undefined;
    return this.myResources.value[this.selectedResourceId].name;
  }

  async firstUpdated() {
    await this.store.fetchMyResources();
    const myResourcesHashes = Object.keys(this.myResources.value);

    const promises = myResourcesHashes.map(h =>
      this.store.fetchBookingSlots(h)
    );

    await Promise.all(promises);

    this._loading = false;
  }

  get resources() {
    return Object.entries(this.myResources.value).map(
      ([entryHash, resource]) => ({
        id: entryHash,
        title: resource.name,
      })
    );
  }

  get bookingSlots(): EventInput[] {
    return Object.entries(this._allSlots.value).map(([entryHash, slot]) => ({
      id: entryHash,
      resourceId: slot.resourceHash,
      start: slot.timeRange.startTime,
      end: slot.timeRange.endTime,
    }));
  }

  renderCreateSlot() {
    return html` <mwc-menu-surface
      id="create-slot-menu"
      absolute
      corner="TOP_END"
    >
      <div style="padding: 16px;" class="column">
        <span
          >Do you want to create a bookable slot for resource
          ${this.selectedResourceName} from
          ${this._selectedSlot?.start.toLocaleString()} to
          ${this._selectedSlot?.end.toLocaleString()}?</span
        >
        <mwc-button
          style="margin-top: 8px"
          label="Create Slot"
          @click=${() => {
            this.store.createBookingSlot(this.selectedResourceId!, {
              startTime: this._selectedSlot?.start.getTime() as number,
              endTime: this._selectedSlot?.end.getTime() as number,
            });
            this._createSlotMenu.close();
            this._selectedSlot = undefined;
            this._timeline.unselect();
          }}
        ></mwc-button>
      </div>
    </mwc-menu-surface>`;
  }

  render() {
    return html`
      ${this.renderCreateSlot()}
      ${this._loading
        ? html`<div class="fill center-content">
            <mwc-circular-progress indeterminate></mwc-circular-progress>
          </div>`
        : html` <resource-time-grid
            initial-view="resourceTimeGridDay"
            id="timeline"
            .resources=${this.resources}
            .events=${this.bookingSlots}
            style="flex: 1"
            @slot-selected=${(e: CustomEvent) => {
              this._selectedSlot = e.detail.info;
              this._createSlotMenu.anchor = e.detail.element;
              this._createSlotMenu.show();
            }}
          ></resource-time-grid>`}
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
      'resource-time-grid': ResourceTimeGrid,
      'mwc-circular-progress': CircularProgress,
      'mwc-menu-surface': MenuSurface,
      'mwc-button': Button,
    };
  }
}
