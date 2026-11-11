'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('memberSearch');
  const memberCards = document.querySelectorAll('.member-card');
  const noMembersFound = document.getElementById('noMembersFound');

  if (!searchInput) {
    return;
  }

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visibleMembers = 0;

    memberCards.forEach((card) => {
      const nameElement = card.querySelector('.member-name');
      const majorElement = card.querySelector('.major');

      const name = nameElement
        ? nameElement.textContent.trim().toLowerCase()
        : '';

      const major = majorElement
        ? majorElement.textContent.trim().toLowerCase()
        : '';

      const matchesSearch = (
        name.includes(searchTerm)
        || major.includes(searchTerm)
      );

      if (matchesSearch) {
        card.style.display = 'flex';
        visibleMembers += 1;
      } else {
        card.style.display = 'none';
      }
    });

    if (visibleMembers === 0) {
      noMembersFound.style.display = 'block';
    } else {
      noMembersFound.style.display = 'none';
    }
  });
});