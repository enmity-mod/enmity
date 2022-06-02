# 2.0.0

- Rewrote the entirety of Enmity for performance & comfortability
- Redesigned all of Enmity's UI to be more consistent with Discord's
- Added image backgrounds option for themes usable by providing the following keys:

<br />

```json
{
    "background": {
        "blur": 1,
        "url": "https://domain.com/image.png",
        "alpha": 0.5
    },
}
```
- Removed almost **ALL** discord tracking, this should improve app speeds by up to 30x
- Removed crash reports and any other things that may indicate you are using a client modification (just incase)
- In-app addon installer when long pressing on a message inside the themes/plugins channels

<br />

# Preview
<img src="https://media.wtf/69919483" height="300" />

- Added many utilities for plugin developers
- Added **plugin settings**
- Deprecated all legacy APIs in favour of the new common modules that can be accessed from `enmity/metro/common`
- Added a robust Settings API for plugins to utilize. This also contains state management functions for automatically updating components when a setting is changed.
- Improved Commands API to automatically handle the commands section and many other things. You should now only need to pass a `name`, `description` and an `execute` function which will handle the command execution
- Exposed Native API for getting information about one's device
- Enmity should now crash less if startup fails
- Added a general settings tab where a debug websocket can be configured for easier development.
- Added extra metadata to addons such as `author`, `description` and `version`
- Changed the addon cards to a more familiar, clean, sleek and more compact layout.

The plugin template has been updated to reflect all of these changes, and so has the API.

Installing the API has changed, you may now install it directly from npm by doing `npm i enmity`
