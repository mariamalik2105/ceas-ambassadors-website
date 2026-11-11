'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const minPointsInput = document.getElementById('minPoints');
  const maxPointsInput = document.getElementById('maxPoints');
  const pointsSort = document.getElementById('pointsSort');
  const clearButton = document.getElementById('clearPointsFilters');
  const table = document.getElementById('pointsTable');
  const noResults = document.getElementById('noPointsResults');

  if (!table) {
    return;
  }

  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('.points-member-row'));
  const originalOrder = rows.slice();

  const applyFilters = () => {
    const minPoints = minPointsInput.value === ''
      ? null
      : Number(minPointsInput.value);

    const maxPoints = maxPointsInput.value === ''
      ? null
      : Number(maxPointsInput.value);

    let visibleRows = rows.filter((row) => {
      const points = Number(row.dataset.points);

      const meetsMinimum = minPoints === null || points >= minPoints;
      const meetsMaximum = maxPoints === null || points <= maxPoints;

      const isVisible = meetsMinimum && meetsMaximum;

      row.style.display = isVisible ? '' : 'none';

      return isVisible;
    });

    if (pointsSort.value === 'high-low') {
      visibleRows.sort((a, b) => {
        return Number(b.dataset.points) - Number(a.dataset.points);
      });
    } else if (pointsSort.value === 'low-high') {
      visibleRows.sort((a, b) => {
        return Number(a.dataset.points) - Number(b.dataset.points);
      });
    } else {
      visibleRows = originalOrder.filter((row) => {
        return row.style.display !== 'none';
      });
    }

    visibleRows.forEach((row) => {
      tbody.appendChild(row);
    });

    noResults.style.display = visibleRows.length === 0
      ? 'block'
      : 'none';
  };

  minPointsInput.addEventListener('input', applyFilters);
  maxPointsInput.addEventListener('input', applyFilters);
  pointsSort.addEventListener('change', applyFilters);

  clearButton.addEventListener('click', () => {
    minPointsInput.value = '';
    maxPointsInput.value = '';
    pointsSort.value = 'default';

    originalOrder.forEach((row) => {
      row.style.display = '';
      tbody.appendChild(row);
    });

    noResults.style.display = 'none';
  });
});