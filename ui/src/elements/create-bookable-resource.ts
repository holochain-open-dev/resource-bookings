import { html, LitElement } from 'lit';
import { query, property, state } from 'lit/decorators.js';
import { contextProvided } from '@holochain-open-dev/context';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { Dictionary } from '@holochain-open-dev/core-types';
import {
  TextField,
  Button,
  Card,
  IconButton,
  Fab,
} from '@scoped-elements/material-web';

import { sharedStyles } from './utils/shared-styles';
import { ResourceBookingsStore } from '../resource-bookings-store';
import { resourceStoreContext } from '../context';

/**
 * A custom element that fires event on value change.
 *
 * @element create-resource-booking
 * @fires resource-booking-created - Fired after the resourceBooking has been created. Detail will have this shape: { resourceBooking: { nickname, fields } }
 */
export class CreateBookableResource extends ScopedElementsMixin(LitElement) {
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
  name = '';

  async createBookableResource() {
    const output = await this.store.createBookableResource(this.name);

    this.dispatchEvent(
      new CustomEvent('resource-booking-created', {
        detail: {
          entryHash: output.entryHash,
          bookableResource: output.bookableResource,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <mwc-card>
        <div class="column" style="margin: 16px;">
          <span
            class="title"
            style="margin-bottom: 24px; align-self: flex-start"
            >Create Resource</span
          >
          <mwc-textfield
            required
            autoValidate
            @input=${(e: CustomEvent) =>
              (this.name = (e.target as TextField).value)}
            label="Name"
            style="margin-bottom: 8px"
            outlined
          ></mwc-textfield>
          <mwc-button
            label="Create Resource"
            .disabled=${!this.name || this.name.length === 0}
            raised
            @click=${() => this.createBookableResource()}
          ></mwc-button>
        </div>
      </mwc-card>
    `;
  }

  /**
   * @ignore
   */
  static get scopedElements() {
    return {
      'mwc-textfield': TextField,
      'mwc-button': Button,
      'mwc-card': Card,
    };
  }
  static get styles() {
    return [sharedStyles];
  }
}
