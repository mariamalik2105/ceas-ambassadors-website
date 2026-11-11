'use strict';

const getCurrentRotationTerm = (date = new Date()) => {
  const month = date.getMonth();
  const year = date.getFullYear();

  // January through April
  if (month >= 0 && month <= 3) {
    return `spring-${year}`;
  }

  // May through July
  if (month >= 4 && month <= 6) {
    return `summer-${year}`;
  }

  // August through December
  return `fall-${year}`;
};

const getTermIndex = (term) => {
  if (!term) {
    return null;
  }

  const match = term.match(/^(spring|summer|fall)-(\d{4})$/);

  if (!match) {
    return null;
  }

  const semester = match[1];
  const year = Number(match[2]);

  let semesterNumber;

  if (semester === 'spring') {
    semesterNumber = 0;
  } else if (semester === 'summer') {
    semesterNumber = 1;
  } else {
    semesterNumber = 2;
  }

  return (year * 3) + semesterNumber;
};

const getTermsElapsed = (fromTerm, toTerm) => {
  const fromIndex = getTermIndex(fromTerm);
  const toIndex = getTermIndex(toTerm);

  if (fromIndex === null || toIndex === null) {
    return 0;
  }

  return Math.max(0, toIndex - fromIndex);
};

const getCoopStartTerm = (gradYear) => {
  if (!gradYear) {
    return null;
  }

  const startYear = Number(gradYear) - 5;

  return `fall-${startYear + 1}`;
};

const getUpdatedRotation = (member, date = new Date()) => {
  const currentTerm = getCurrentRotationTerm(date);
  // If this member is already recorded for the current semester,
  // preserve their status. This also protects manual overrides.
  if (member.rotation_term === currentTerm) {
    return {
      onCoop: member.on_coop,
      rotationTerm: currentTerm,
    };
  }

  // New/legacy member with no tracked term:
  // preserve their current status and begin tracking now.
  if (!member.rotation_term) {
    return {
      onCoop: member.on_coop,
      rotationTerm: currentTerm,
    };
  }

  const coopStartTerm = getCoopStartTerm(member.grad_year);

  // Before sophomore fall, students remain in class automatically.
  if (
    coopStartTerm
    && getTermIndex(currentTerm) < getTermIndex(coopStartTerm)
  ) {
    return {
      onCoop: false,
      rotationTerm: currentTerm,
    };
  }

  const termsElapsed = getTermsElapsed(
    member.rotation_term,
    currentTerm,
  );

  // An odd number of semesters means the rotation flips.
  const shouldFlip = termsElapsed % 2 === 1;

  return {
    onCoop: shouldFlip ? !member.on_coop : member.on_coop,
    rotationTerm: currentTerm,
  };
};

module.exports = {
  getCurrentRotationTerm,
  getTermIndex,
  getTermsElapsed,
  getCoopStartTerm,
  getUpdatedRotation,
};