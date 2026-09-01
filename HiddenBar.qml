import QtQuick
import qs.Commons
import qs.Ui
import "HiddenBarModel.js" as HiddenBarModel

BarWidget {
  id: root
  moduleName: "hugog.hidden-bar"

  property var hiddenIds: []
  property string revealIcon: "\uf103"
  property int hideDelay: 600

  property bool revealed: false
  property bool managed: false

  function refreshConfig() {
    root.hiddenIds = HiddenBarModel.normalizeIds(root.setting("hiddenWidgets", []))
    root.revealIcon = HiddenBarModel.normalizeIcon(root.setting("revealIcon", "\uf103"))
    root.hideDelay = HiddenBarModel.normalizeHideDelay(root.setting("hideDelayMs", 600))
  }

  function apply() {
    return HiddenBarModel.applyVisibility(root.bar, root.hiddenIds, root.revealed)
  }

  function reveal() {
    if (!root.managed || root.revealed) return
    hideTimer.stop()
    root.revealed = true
    HiddenBarModel.applyVisibility(root.bar, root.hiddenIds, true)
  }

  function hide() {
    if (!root.managed || !root.revealed) return
    root.revealed = false
    HiddenBarModel.applyVisibility(root.bar, root.hiddenIds, false)
  }

  function sync() {
    if (root.hiddenIds.length === 0) {
      syncTimer.stop()
      return
    }
    var ok = root.apply()
    if (ok && !root.managed) {
      root.managed = true
      syncTimer.stop()
    }
    if (!ok) syncTimer.restart()
  }

  onSettingsChanged: refreshConfig()
  onHiddenIdsChanged: sync()
  Component.onCompleted: refreshConfig()

  Timer {
    id: syncTimer
    interval: 250
    repeat: true
    onTriggered: sync()
  }

  HoverHandler {
    onHoveredChanged: {
      if (hovered) {
        root.sync()
        root.reveal()
      } else {
        hideTimer.restart()
      }
    }
  }

  Timer {
    id: hideTimer
    interval: root.hideDelay
    onTriggered: root.hide()
  }

  visible: root.hiddenIds.length > 0
  implicitWidth: handle.implicitWidth
  implicitHeight: handle.implicitHeight

  WidgetButton {
    id: handle
    anchors.fill: parent
    bar: root.bar
    text: root.revealIcon
    fontSize: 12
    horizontalMargin: 4
    verticalPadding: 4
    keepSpace: true
    tooltipText: root.revealed ? "Hidden widgets shown" : (root.managed ? "Hold pointer to reveal" : "No hidden widgets configured")
  }
}