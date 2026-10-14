/**
 * Tests for automatic member rotation logic
 */
/* eslint-disable no-undef */
process.env.NODE_ENV = 'test';

const assert = require('assert');
const {
  getCurrentRotationTerm,
  getTermsElapsed,
  getCoopStartTerm,
  getUpdatedRotation,
} = require('../utils/rotation');

describe('Rotation utility tests', () => {
  it('determines spring, summer, and fall terms correctly', () => {
    assert.strictEqual(
      getCurrentRotationTerm(new Date(2026, 1, 15)),
      'spring-2026',
    );

    assert.strictEqual(
      getCurrentRotationTerm(new Date(2026, 5, 15)),
      'summer-2026',
    );

    assert.strictEqual(
      getCurrentRotationTerm(new Date(2026, 9, 15)),
      'fall-2026',
    );
  });

  it('calculates elapsed semesters correctly', () => {
    assert.strictEqual(
      getTermsElapsed('summer-2026', 'fall-2026'),
      1,
    );

    assert.strictEqual(
      getTermsElapsed('fall-2026', 'spring-2027'),
      1,
    );

    assert.strictEqual(
      getTermsElapsed('fall-2026', 'summer-2027'),
      2,
    );
  });

  it('calculates normal co-op start from graduation year', () => {
    assert.strictEqual(
      getCoopStartTerm(2027),
      'fall-2023',
    );

    assert.strictEqual(
      getCoopStartTerm(2031),
      'fall-2027',
    );
  });

  it('flips rotation after one semester', () => {
    const member = {
      grad_year: 2027,
      on_coop: false,
      rotation_term: 'summer-2026',
    };

    const result = getUpdatedRotation(
      member,
      new Date(2026, 9, 15),
    );

    assert.strictEqual(result.onCoop, true);
    assert.strictEqual(result.rotationTerm, 'fall-2026');
  });

  it('does not flip twice when already recorded for current semester', () => {
    const member = {
      grad_year: 2027,
      on_coop: true,
      rotation_term: 'fall-2026',
    };

    const result = getUpdatedRotation(
      member,
      new Date(2026, 9, 15),
    );

    assert.strictEqual(result.onCoop, true);
    assert.strictEqual(result.rotationTerm, 'fall-2026');
  });

  it('keeps a freshman in class before normal co-op rotation begins', () => {
    const member = {
      grad_year: 2031,
      on_coop: true,
      rotation_term: 'summer-2026',
    };

    const result = getUpdatedRotation(
      member,
      new Date(2026, 9, 15),
    );

    assert.strictEqual(result.onCoop, false);
    assert.strictEqual(result.rotationTerm, 'fall-2026');
  });

  it('preserves a freshman manual override during the current semester', () => {
    const member = {
      grad_year: 2031,
      on_coop: true,
      rotation_term: 'fall-2026',
    };

    const result = getUpdatedRotation(
      member,
      new Date(2026, 9, 15),
    );

    assert.strictEqual(result.onCoop, true);
    assert.strictEqual(result.rotationTerm, 'fall-2026');
  });
});