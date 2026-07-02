/* eslint-env browser */
/* global flatpickr */

document.addEventListener('DOMContentLoaded', () => {
  const startTimeEl = document.getElementById('startTimeInput');
  const endTimeEl = document.getElementById('endTimeInput');
  const callTimeEl = document.getElementById('callTimeInput');

  const now = new Date();
  const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(13, 0, 0, 0);

  const nextMondayEnd = new Date(nextMonday);
  nextMondayEnd.setHours(14, 0, 0, 0);

  const nextMondayCall = new Date(nextMonday);
  nextMondayCall.setMinutes(nextMondayCall.getMinutes() - 10);

  const configStart = {
    enableTime: true,
    altInput: true,
    altInputClass: 'form-control form-control-sm',
    altFormat: 'F j, Y - h:i K',
    dateFormat: 'Y-m-d H:i',
    time_24hr: false,
  };

  const configEnd = {
    enableTime: true,
    altInput: true,
    altInputClass: 'form-control form-control-sm',
    altFormat: 'F j, Y - h:i K',
    dateFormat: 'Y-m-d H:i',
    time_24hr: false,
  };

  const configCall = {
    enableTime: true,
    altInput: true,
    altInputClass: 'form-control form-control-sm',
    altFormat: 'F j, Y - h:i K',
    dateFormat: 'Y-m-d H:i',
    time_24hr: false,
  };

  if (!startTimeEl.value || startTimeEl.value === '') {
    configStart.defaultDate = nextMonday;
  }
  if (!endTimeEl.value || endTimeEl.value === '') {
    configEnd.defaultDate = nextMondayEnd;
  }
  if (!callTimeEl.value || callTimeEl.value === '') {
    configCall.defaultDate = nextMondayCall;
  }

  const callTimePicker = flatpickr(callTimeEl, configCall);
  const endTimePicker = flatpickr(endTimeEl, configEnd);

  configStart.onChange = (selectedDates) => {
    if (selectedDates[0]) {
      if (callTimePicker) {
        const callTime = new Date(selectedDates[0].getTime() - 10 * 60 * 1000);
        callTimePicker.setDate(callTime, true);
      }
      if (endTimePicker) {
        const endTime = new Date(selectedDates[0].getTime() + 60 * 60 * 1000);
        endTimePicker.setDate(endTime, true);
      }
    }
  };

  flatpickr(startTimeEl, configStart);

  const duplicateCountInput = document.getElementById('duplicateCountInput');
  const duplicateFieldsContainer = document.getElementById('duplicateFieldsContainer');
  const titleEl = document.querySelector('input[name="title"]');
  const locationEl = document.querySelector('input[name="location"]');

  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    const parsed = Date.parse(dateVal);
    if (Number.isNaN(parsed)) return dateVal;
    const dateObj = new Date(parsed);
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (duplicateCountInput && duplicateFieldsContainer) {
    let lastTitle = titleEl ? titleEl.value : '';
    let lastLocation = locationEl ? locationEl.value : '';

    if (titleEl) {
      titleEl.addEventListener('input', () => {
        const currentTitle = titleEl.value;
        const inputs = document.querySelectorAll('.duplicate-title-input');
        for (let i = 0; i < inputs.length; i += 1) {
          if (inputs[i].value === lastTitle || inputs[i].value === '') {
            inputs[i].value = currentTitle;
            const cardEl = inputs[i].closest('.duplicate-card');
            if (cardEl) {
              const headerTitleEl = cardEl.querySelector('.duplicate-header-title');
              const startInput = cardEl.querySelector('.duplicate-start');
              const currentDate = formatDate(startInput.value);
              headerTitleEl.textContent = `${currentTitle} – ${currentDate} (Event ${i + 2})`;
            }
          }
        }
        lastTitle = currentTitle;
      });
    }

    if (locationEl) {
      locationEl.addEventListener('input', () => {
        const currentLocation = locationEl.value;
        const inputs = document.querySelectorAll('.duplicate-location-input');
        for (let i = 0; i < inputs.length; i += 1) {
          if (inputs[i].value === lastLocation || inputs[i].value === '') {
            inputs[i].value = currentLocation;
          }
        }
        lastLocation = currentLocation;
      });
    }

    const updateDuplicateFields = () => {
      const count = Math.max(0, Math.min(50, parseInt(duplicateCountInput.value, 10) || 0));
      const currentCards = duplicateFieldsContainer.querySelectorAll('.duplicate-card');
      const currentCount = currentCards.length;

      if (count > currentCount) {
        const mainTitle = titleEl ? titleEl.value : '';
        const mainLocation = locationEl ? locationEl.value : '';
        const mainStartVal = startTimeEl ? startTimeEl.value : '';
        const mainEndVal = endTimeEl ? endTimeEl.value : '';
        const mainCallVal = callTimeEl ? callTimeEl.value : '';

        for (let i = currentCount; i < count; i += 1) {
          const card = document.createElement('div');
          card.className = 'card my-3 duplicate-card';
          const initialDateStr = formatDate(mainStartVal);
          card.innerHTML = `
            <div class="card-header bg-light">
              <strong class="duplicate-header-title">${mainTitle} – ${initialDateStr} (Event ${i + 2})</strong>
            </div>
            <div class="card-body">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label>Event Title:</label>
                  <input type="text" class="form-control form-control-sm duplicate-title-input" name="duplicate_title" placeholder="Event Title" value="${mainTitle}">
                </div>
                <div class="form-group col-md-6">
                  <label>Location:</label>
                  <input type="text" class="form-control form-control-sm duplicate-location-input" name="duplicate_location" placeholder="Location" value="${mainLocation}">
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label>Start Time:</label>
                  <input type="text" class="form-control form-control-sm duplicate-start" name="duplicate_startTime" placeholder="Start Time">
                </div>
                <div class="form-group col-md-4">
                  <label>End Time:</label>
                  <input type="text" class="form-control form-control-sm duplicate-end" name="duplicate_endTime" placeholder="End Time">
                </div>
                <div class="form-group col-md-4">
                  <label>Call Time:</label>
                  <input type="text" class="form-control form-control-sm duplicate-call" name="duplicate_callTime" placeholder="Call Time">
                </div>
              </div>
            </div>
          `;
          duplicateFieldsContainer.appendChild(card);

          const startEl = card.querySelector('.duplicate-start');
          const endEl = card.querySelector('.duplicate-end');
          const callEl = card.querySelector('.duplicate-call');
          const headerTitleEl = card.querySelector('.duplicate-header-title');
          const titleInput = card.querySelector('.duplicate-title-input');

          const updateHeader = () => {
            const currentTitle = titleInput.value || 'Event';
            const currentDate = formatDate(startEl.value);
            headerTitleEl.textContent = `${currentTitle} – ${currentDate} (Event ${i + 2})`;
          };

          titleInput.addEventListener('input', updateHeader);

          const callPicker = flatpickr(callEl, {
            enableTime: true,
            altInput: true,
            altInputClass: 'form-control form-control-sm',
            altFormat: 'F j, Y - h:i K',
            dateFormat: 'Y-m-d H:i',
            time_24hr: false,
            defaultDate: mainCallVal,
          });

          const endPicker = flatpickr(endEl, {
            enableTime: true,
            altInput: true,
            altInputClass: 'form-control form-control-sm',
            altFormat: 'F j, Y - h:i K',
            dateFormat: 'Y-m-d H:i',
            time_24hr: false,
            defaultDate: mainEndVal,
          });

          flatpickr(startEl, {
            enableTime: true,
            altInput: true,
            altInputClass: 'form-control form-control-sm',
            altFormat: 'F j, Y - h:i K',
            dateFormat: 'Y-m-d H:i',
            time_24hr: false,
            defaultDate: mainStartVal,
            onChange: (selectedDates) => {
              if (selectedDates[0]) {
                callPicker.setDate(new Date(selectedDates[0].getTime() - 10 * 60 * 1000), true);
                endPicker.setDate(new Date(selectedDates[0].getTime() + 60 * 60 * 1000), true);
              }
              updateHeader();
            },
          });
        }
      } else if (count < currentCount) {
        for (let i = currentCount - 1; i >= count; i -= 1) {
          currentCards[i].remove();
        }
      }
    };

    duplicateCountInput.addEventListener('change', updateDuplicateFields);
    duplicateCountInput.addEventListener('input', updateDuplicateFields);
  }
});
