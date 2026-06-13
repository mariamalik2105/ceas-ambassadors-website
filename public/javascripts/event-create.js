document.addEventListener('DOMContentLoaded', function() {
  const startTimeEl = document.getElementById("startTimeInput");
  const endTimeEl = document.getElementById("endTimeInput");

  const now = new Date();
  const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);
  nextMonday.setHours(13, 0, 0, 0);

  const nextMondayEnd = new Date(nextMonday);
  nextMondayEnd.setHours(14, 0, 0, 0);

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

  if (!startTimeEl.value || startTimeEl.value === "") {
    configStart.defaultDate = nextMonday;
  }
  if (!endTimeEl.value || endTimeEl.value === "") {
    configEnd.defaultDate = nextMondayEnd;
  }

  flatpickr(startTimeEl, configStart);
  flatpickr(endTimeEl, configEnd);
});
