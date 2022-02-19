import { html, fixture, expect } from '@open-wc/testing';
import { setupApolloClientMock } from './mocks';
import { HodCreateBookableResourceForm } from '../dist';
import { setupApolloClientElement } from '@holochain-open-dev/common';

describe('HodCreateBookableResourceForm', () => {
  it('create resource-booking has a placeholder', async () => {
    const client = await setupApolloClientMock();

    customElements.define(
      'hod-create-resource-booking-form',
      setupApolloClientElement(HodCreateBookableResourceForm, client)
    );

    const el = await fixture(
      html` <hod-create-resource-booking-form></hod-create-resource-booking-form> `
    );

    expect(el.shadowRoot.innerHTML).to.include('CREATE PROFILE');
  });
});
