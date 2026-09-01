// QML passes some arrays into widgets as sequence types where Array.isArray
// is unreliable, so count by length instead.
function arrayLikeCount(raw) {
  if (!raw) return 0
  var n = typeof raw.length === "number" ? raw.length : 0
  return n > 0 ? n : 0
}

function normalizeIds(raw) {
  var n = arrayLikeCount(raw)
  var out = []
  for (var i = 0; i < n; i++) {
    var id = String(raw[i] || "").trim()
    if (id && out.indexOf(id) === -1) out.push(id)
  }
  return out
}

function normalizeIcon(raw) {
  var icon = String(raw || "").trim()
  if (!icon) return "\uf103"
  return icon
}

function normalizeHideDelay(raw) {
  var ms = parseInt(raw, 10)
  if (isNaN(ms) || ms < 0) return 600
  return Math.min(ms, 3000)
}

// Apply reveal/hide to every live instance of the given widget ids by setting
// their activeItem.visible. Only ids we are configured to manage are touched.
// Returns true only when every configured id had at least one live instance,
// so callers can tell "applied to the whole hidden list" from "hid nothing".
function applyVisibility(bar, ids, visible) {
  if (!bar || typeof bar.moduleWidgets !== "function") return false
  var reachedAll = arrayLikeCount(ids) > 0
  for (var i = 0; i < ids.length; i++) {
    var items = bar.moduleWidgets(ids[i])
    var reached = arrayLikeCount(items) > 0
    if (!reached) reachedAll = false
    for (var j = 0; j < items.length; j++) {
      if (items[j]) items[j].visible = visible
    }
  }
  return reachedAll
}

if (typeof module !== "undefined") {
  module.exports = {
    normalizeIds: normalizeIds,
    normalizeIcon: normalizeIcon,
    normalizeHideDelay: normalizeHideDelay,
    applyVisibility: applyVisibility
  }
}
