# Hidden Bar

Bar widget for Omarchy that hides chosen bar widgets and reveals them on
hover — like the macOS *hidden bar* / Bartender app.

## What it does

Place the widget in your bar layout and list the ids of the widgets you want
to tuck away. By default those widgets are hidden. Move your pointer over the
`»` handle and they slide back in; move away and they hide again after a short
delay.

## Install

Install the plugin from git (no configuration is overwritten):

```bash
omarchy plugin add https://github.com/Westy47/omarchy-hidden-bar.git --enable
```

Then add the hidden-bar entry to the desired section of `~/.config/omarchy/shell.json`
and list the widgets to hide directly on the entry (flat keys, the same way the
clock stores `format`):

```json
{
  "id": "westy47.hidden-bar",
  "hiddenWidgets": ["omarchy.bluetooth", "omarchy.network"],
  "revealIcon": "\uf103",
  "hideDelayMs": 600
}
```

Place the hidden-bar handle at the start of the group of widgets you want to
hide in the layout; the revealed widgets appear after it.

The shell hot-reloads `shell.json` on save. If a change doesn't apply, run
`omarchy-shell shell rescanPlugins` or `omarchy restart shell`.

## Remove

```bash
omarchy plugin disable westy47.hidden-bar
omarchy plugin remove westy47.hidden-bar
```

Then remove the `westy47.hidden-bar` entry from `~/.config/omarchy/shell.json`
and restart the shell: `omarchy restart shell`.

## Settings

| Key             | Type    | Default | Meaning                                             |
|-----------------|---------|---------|-----------------------------------------------------|
| `hiddenWidgets` | list    | `[]`    | Ids of bar widgets to collapse (e.g. `omarchy.tray`)|
| `revealIcon`    | string  | `»`     | Glyph shown on the reveal handle                    |
| `hideDelayMs`   | integer | `600`   | Delay before hiding again after the pointer leaves  |

## How it works

The widget reads its `hiddenWidgets` settings and, while the pointer is over
the handle, sets each target widget's `activeItem.visible` to `true`; on
leave it sets them `false`. Omarchy's `Bar.qml` collapses a slot to zero size
when its `activeItem.visible` is `false`, so hidden widgets take no space.

## Notes and limitations

- Configured widgets should be ones that are effectively always present. Since
  this plugin writes `visible` directly, it deactivates any self-hiding logic a
  target widget may have (e.g. a widget that hides when its app quits). For
  such widgets, combine this with their own hide rule rather than relying on it.
- Only ids listed in `hiddenWidgets` are ever touched; all other widgets behave
  normally.
- `allowMultiple` is true: you can use several hidden-bar handles (one per
  zone) if you want compact, controllable groups.

## Validate

```bash
node ~/.config/omarchy/plugins/westy47.hidden-bar/tests/model.test.js
omarchy plugin validate ~/.config/omarchy/plugins/westy47.hidden-bar
```
