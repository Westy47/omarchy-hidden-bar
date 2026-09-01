const assert = require("node:assert")
const Model = require("../HiddenBarModel.js")

// QML sometimes hands widgets array-like values where Array.isArray is false,
// so the model must accept anything with a length it can iterate.
function qmlArrayLike(items) {
  const o = { length: items.length }
  for (let i = 0; i < items.length; i++) o[i] = items[i]
  return o
}

assert.deepEqual(Model.normalizeIds(null), [])
assert.deepEqual(Model.normalizeIds([]), [])
assert.deepEqual(Model.normalizeIds([" omarchy.bluetooth ", "", "omarchy.network", "omarchy.bluetooth"]), ["omarchy.bluetooth", "omarchy.network"])
assert.deepEqual(Model.normalizeIds(qmlArrayLike(["omarchy.audio", "omarchy.power"])), ["omarchy.audio", "omarchy.power"])

assert.equal(Model.normalizeIcon(""), "\uf103")
assert.equal(Model.normalizeIcon("x"), "x")

assert.equal(Model.normalizeHideDelay(0), 0)
assert.equal(Model.normalizeHideDelay("abc"), 600)
assert.equal(Model.normalizeHideDelay(-5), 600)
assert.equal(Model.normalizeHideDelay(5000), 3000)

function fakeBar(ids) {
  const byId = {}
  for (const id of ids) byId[id] = [{ visible: true }]
  return {
    moduleWidgets(id) { return byId[id] || [] }
  }
}

// Not all ids present: returns false so the caller keeps polling.
assert.equal(Model.applyVisibility(fakeBar(["omarchy.bluetooth"]), ["omarchy.bluetooth", "omarchy.network"], true), false)

// All ids present: hides/unhides and returns true.
const bar = fakeBar(["omarchy.bluetooth", "omarchy.network", "omarchy.audio"])
assert.equal(Model.applyVisibility(bar, ["omarchy.bluetooth", "omarchy.network", "omarchy.audio"], false), true)
assert.equal(bar.moduleWidgets("omarchy.bluetooth")[0].visible, false)
assert.equal(bar.moduleWidgets("omarchy.audio")[0].visible, false)

assert.equal(Model.applyVisibility(bar, ["omarchy.bluetooth", "omarchy.network", "omarchy.audio"], true), true)
assert.equal(bar.moduleWidgets("omarchy.bluetooth")[0].visible, true)

assert.equal(Model.applyVisibility(null, ["omarchy.bluetooth"], true), false)
assert.equal(Model.applyVisibility(bar, [], true), false)

console.log("HiddenBarModel tests passed")