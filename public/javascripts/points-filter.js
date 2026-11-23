'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const exportButton = document.getElementById('exportPointsCsv');
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

  const exportVisibleRowsToCsv = () => {
    const visibleRows = Array.from(
      tbody.querySelectorAll('.points-member-row')
    ).filter((row) => {
      return row.style.display !== 'none';
    });

    if (visibleRows.length === 0) {
      return;
    }

    const headers = [
      'Name',
      'Email',
      'Major',
      'Status',
      'Certified',
      'Meetings',
      'Points',
      'Not Needed',
      'Excused',
      'No Show',
    ];

    const csvRows = [headers];

    visibleRows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td')).map((cell) => {
        return cell.textContent.trim();
      });

      csvRows.push(cells);
    });

    const csvContent = csvRows.map((row) => {
      return row.map((value) => {
        const escapedValue = value.replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',');
    }).join('\n');

    const blob = new Blob(
      [`\uFEFF${csvContent}`],
      { type: 'text/csv;charset=utf-8;' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    let semester = 'Spring';

    if (month >= 4 && month <= 6) {
      semester = 'Summer';
    } else if (month >= 7) {
      semester = 'Fall';
    }

    link.href = url;
    link.download = `CEAS-Ambassadors-Points-${semester}-${year}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  minPointsInput.addEventListener('input', applyFilters);
  maxPointsInput.addEventListener('input', applyFilters);
  pointsSort.addEventListener('change', applyFilters);

  if (exportButton) {
    exportButton.addEventListener('click', exportVisibleRowsToCsv);
  }

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