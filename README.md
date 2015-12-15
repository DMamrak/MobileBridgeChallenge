MobileBridge File Manager challenge
===================================

### Prerequisites

This app uses require.js for ADM and it's plugin "text" for external template loading via `XHR`. Although this app is pure frontend, in order to run it you need either host it somewhere and access `index.html` via http or run a server locally. If you have Node.js installed, I'd recommend [this](https://www.npmjs.com/package/http-server) tiny http server, which is really easy to install and use.

The app is precompiled, you don't need `npm`, `bower` or `grunt` in order to run it.

### Layout

The app layout is somewhat different from the mockup provided, according to the BootStrap UI components look and common sense: some unused controls were removed, some moved to better place, some added or renamed.

### Third party libraries

There are several third party libraries used in this app:
- [require](http://requirejs.org/) for asynchronous modules definition.
- [text](https://github.com/requirejs/text) for loading external templates.
- [jQuery](https://jquery.com/) for DOM manipulations.
- [Uunderscore](http://underscorejs.org/) for data processing (as `Backbone` depends on it).
- [BackBone](http://backbonejs.org/) as a main library.
- [BackBone.localStorage](https://github.com/jeromegn/Backbone.localStorage) as a wrapper around native localStorage object.
- [BackBone.Obscura](https://github.com/jmorrell/backbone.obscura) for easy collection filtering.
- [BootStrap](http://getbootstrap.com/) as a UI framework.
- [BootStrap validator](https://github.com/1000hz/bootstrap-validator) - tiny plugin for bootstrap form validation.

### Structure

App consists of several asynchronously defined loosely coupled (well, almost loosely) modules:
- Data model `FileModel`
- Collections `Files` (containig list of `FileModel` models) and `Proxy` (wrapper around the `Files` collection for convenient data filtering without affecting the original collection)
- Several views for each separate widget of the app: `FileView` for sigle file, `ListView` for files list, `ActionsView` for selected files actions and `EditorView` for file editor window.
- Top level view `AppView` to rule them all.
- `app.js` - entry point where modules are configured and the entire app takes off.

### Search

Search mechanism may be somewhat unintuitive, so let me explain it in details:
- If there's no wildcard symbol `*` search uses "contains" logic, to see if the search criteria is a substring of file name.
- if there's a wildcard at the beginning of the string (like `*.txt`), search uses "ends with" logic and return all files, which names end with `.txt`
- if there's a wildcard at the end of string (like `readme.*`), search uses "starts with" logic and return all `readme` files with any extension.
- wildcard (one or more) inside search string makes search use both "starts with" and "ends with" logic.
- two wildcards at the beginning and the endig of string make search fall back to the main "contains" logic.