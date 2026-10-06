// FOODHUB Week 6 — reusable view components.
// AI-assisted scaffolding was reviewed and adapted for the existing vanilla JS frontend.
// The components render state; app.js supplies the data and event behavior.

window.FoodHubComponents = (() => {
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));

  function loadingState(message = "Loading...") {
    return '<div class="state-view loading-state" role="status" aria-live="polite">' +
      '<span class="state-spinner" aria-hidden="true"></span>' +
      '<strong>' + escapeHtml(message) + '</strong>' +
      '<span>Please wait while FOODHUB loads the latest information.</span>' +
      '</div>';
  }

  function emptyState(title = "No records found.", message = "There is nothing to display yet.", icon = "📭") {
    return '<div class="state-view empty-state" role="status">' +
      '<div class="state-icon" aria-hidden="true">' + icon + '</div>' +
      '<strong>' + escapeHtml(title) + '</strong>' +
      '<span>' + escapeHtml(message) + '</span>' +
      '</div>';
  }

  function errorState(message = "Something went wrong. Please try again.") {
    return '<div class="state-view error-state" role="alert">' +
      '<div class="state-icon" aria-hidden="true">⚠️</div>' +
      '<strong>Unable to load this view</strong>' +
      '<span>' + escapeHtml(message) + '</span>' +
      '</div>';
  }

  function badge(status, label = status) {
    const map = {
      completed:"success", ready:"info", confirmed:"info", pending:"warning",
      cancelled:"danger", paid:"success", partial:"warning", unpaid:"warning"
    };
    const tone = map[String(status ?? "").toLowerCase()] || "info";
    return '<span class="badge ' + tone + '">' + escapeHtml(label) + '</span>';
  }

  function table(headers, rows, emptyTitle = "No records found.", emptyMessage = "There is nothing to display yet.") {
    if (!rows.length) return emptyState(emptyTitle, emptyMessage);
    return '<div class="table-card"><table><thead><tr>' +
      headers.map(header => '<th scope="col">' + escapeHtml(header) + '</th>').join("") +
      '</tr></thead><tbody>' + rows.join("") + '</tbody></table></div>';
  }

  function stat(icon, label, value, note) {
    return '<article class="stat"><small>' + escapeHtml(icon) + ' &nbsp; ' +
      escapeHtml(label) + '</small><strong>' + escapeHtml(value) +
      '</strong><i>' + escapeHtml(note) + '</i></article>';
  }

  return { escapeHtml, loadingState, emptyState, errorState, badge, table, stat };
})();
