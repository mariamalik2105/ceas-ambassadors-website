document.addEventListener('DOMContentLoaded', function() {
  const startTimeEl = document.getElementById("startTimeInput");
  const endTimeEl = document.getElementById("endTimeInput");
  const callTimeEl = document.getElementById("callTimeInput");

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
    altInputClass: "form-control form-control-sm",
    altFormat: "F j, Y - h:i K",
    dateFormat: "Y-m-d H:i",
    time_24hr: false
  };

  const configEnd = {
    enableTime: true,
    altInput: true,
    altInputClass: "form-control form-control-sm",
    altFormat: "F j, Y - h:i K",
    dateFormat: "Y-m-d H:i",
    time_24hr: false
  };

  const configCall = {
    enableTime: true,
    altInput: true,
    altInputClass: "form-control form-control-sm",
    altFormat: "F j, Y - h:i K",
    dateFormat: "Y-m-d H:i",
    time_24hr: false
  };

  if (!startTimeEl.value || startTimeEl.value === "") {
    configStart.defaultDate = nextMonday;
  }
  if (!endTimeEl.value || endTimeEl.value === "") {
    configEnd.defaultDate = nextMondayEnd;
  }
  if (!callTimeEl.value || callTimeEl.value === "") {
    configCall.defaultDate = nextMondayCall;
  }

  const callTimePicker = flatpickr(callTimeEl, configCall);
  const endTimePicker = flatpickr(endTimeEl, configEnd);

  configStart.onChange = function(selectedDates, dateStr, instance) {
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
});
