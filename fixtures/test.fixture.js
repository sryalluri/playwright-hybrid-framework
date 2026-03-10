import { test as base } from '@playwright/test';
import { apiFixtures } from './api.fixture.js';
import { uiFixtures } from './ui.fixture.js';

export const test = base.extend({
  ...apiFixtures,
  ...uiFixtures
});

export const expect = test.expect;