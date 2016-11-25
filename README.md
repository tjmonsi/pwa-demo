# 

## Table of Contents

1. Description
2. Project Structure
3. How to install
4. How to run


--------------------------------------------------------------------------------------------

## Description



It uses Little Qairoes' boilerplate project template is a starting point for building apps using the REACH
template. 

This template, along with `polymer-cli` toolchain, demostrates the use of
"PRPL pattern". This pattern allows fast first delivery and interaction with the 
the content at the initial route requested by the user.

PRPL pattern, in a nutshell, is:
* **Push** components required for the initial route
* **Render** initial route ASAP
* **Pre-cache** components for remaining routes
* **Lazy-load** and progressively upgrade next routes on-demend


--------------------------------------------------------------------------------------------

## Project Structure

The project development structure consists of this...

```
/
|--bower_components/
|
|--images/
|   |--manifest/
|   |--favicon.ico
|
|--pages/
|
|--src/
|   |--pwa-demo-app.html
|
|--web-components/
|
|--test/
|
|--bower.json
|
|--index.html
|
|--manifest.json
|
|--polymer.json
|
|--service-worker.js
|
|--sw-precache-config.js

```

* **bower_components/** is where reusable custom elements and/or libraries
    are fetched via bower (or put in bower.json) will go
* **images/** is where we put all our static image assets. It includes the following
    folders and files (files inside are configurable): 
    * **manifest/** holds icon branding for the website. See 
        https://goo.gl/OOhYW5 for details. (Files inside are configurable).
    * **favicon.ico** is the icon that we see at the tab (configurable/replacable)
* **pages/** is where all your custom-made page elements will go
* **src/** is where your application-specific root-element will go
    * **pwa-demo-app.html** is the main core element called in the index.html that
        renders the pages.
* **web-components/** is where reusable custom elements that are not published or just for this project will go
* **test/** holds all integrated test cases for continuous integration and making sure
    that changes in the app doesn't break the app. (files inside are configurable)
* **bower.json** is a configurable file that holds all direct dependencies of the
    project.
* **index.html** is the main entry point of the application.
    (we need to talk about how to configure the loader)
* **manifest.json** is a configurable file to make the webapp look like a mobile app.
    See https://goo.gl/OOhYW5 for details.
* **polymer.json** is a configurable file that holds all options for entry points
    and fragments for building the reach polymer app using the `polymer build` command.
* **service-worker.js** is a default file to be used for building. It will be populated
    once the `polymer build` command has been called
* **sw-precache-config.js** is a configurable file that configures how the service-worker.js
    will be built. See https://github.com/GoogleChrome/sw-precache


--------------------------------------------------------------------------------------------

## How to Install

### Prerequisites



Install [polymer-cli](https://github.com/Polymer/polymer-cli):

    npm install -g polymer-cli

TODO: Talk about how to build this boilerplate here later on using 
https://github.com/PolymerElements/generator-polymer-init-custom-build. This will
be use gulp more extensively


--------------------------------------------------------------------------------------------

## How to run

### Running Dev

#### on local machine
This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app

    polymer serve


### Building/compiling dev project to production (running vulcanization and minify)
This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

- this creates two folders
    - build/bundled - vulcanizes and minifies all files. Much faster in loading
        than unbundled version when HTTP/2.0 is turned off
    - build/unbundled - retains the structure of dev but minifies all css and 
        javascript files. Useful if deployed in HTTP/2.0 ready server/CDN

### Preview production build in local dev

These set of commands serves the minified version of the app at `http://localhost:8080`

#### Running production build/bundled in local dev
runs the generated production build using fragment bundling

    polymer serve build/bundled


#### Running production build/unbundled in local dev
runs the unbundled state, as it would be served by a push-compatible server

    polymer serve build/unbundled


--------------------------------------------------------------------------------------------

## Run tests

This command will run
[Web Component Tester](https://github.com/Polymer/web-component-tester) against the
browsers currently installed on your machine.

    polymer test
    
    
--------------------------------------------------------------------------------------------
