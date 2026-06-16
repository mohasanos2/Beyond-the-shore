/**
 * BookingRouter — Unified booking navigation module
 * Single source of truth for all booking-related routing.
 * Used by: index.html, trip.html, booking.html
 */
window.BookingRouter = (function () {

  /**
   * Navigate to booking.html, optionally pre-selecting a trip.
   * @param {string} [tripId] - Optional trip ID to pre-select
   */
  function goToBooking(tripId) {
    const url = 'booking.html' + (tripId ? '?bookid=' + encodeURIComponent(tripId) : '');
    window.location.href = url;
  }

  /**
   * Navigate to trip detail page.
   * @param {string} tripId
   */
  function goToTrip(tripId) {
    window.location.href = '/trips/' + encodeURIComponent(tripId);
  }

  /**
   * Read bookid from current URL query string.
   * @returns {string|null}
   */
  function getBookId() {
    return new URLSearchParams(window.location.search).get('bookid');
  }

  /**
   * Read trip id from current URL query string.
   * @returns {string|null}
   */
  function getTripId() {
    return new URLSearchParams(window.location.search).get('id');
  }

  return { goToBooking, goToTrip, getBookId, getTripId };
})();
