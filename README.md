# jquery.ajaxCheckbox

This is a jQuery plugin that creates a checkbox-like control which
propagates state immediately using an Ajax call.

## How it works

Instead of a classic `<input>` checkbox we use different icons on a element
(usually a span) to show the state. The state is expressed through
different CSS classes.

There are four different states: checked, unchecked, updating and error

The default implementation uses FontAwesome icons. The control swaps
css classes of the element on each state change.

## Usage

### Local usage

Just load `jquery.ajaxcheckbox.js` after loading jQuery.

#### CDN

You can use [RawGit](https://rawgit.com/)'s excellent CDN support and put this directly on your HTML.

```html
<script src="https://cdn.rawgit.com/sargue/jquery.ajaxcheckbox/master/jquery.ajaxcheckbox.js"></script>
```

### Direct usage

Notice that we don't need to indicate any initial CSS class as the element has an initial value 
expressed inside the HTML5 data attribute `data-value`.

HTML:

```html
<span data-id="5" data-name="activo" data-value="true"
      data-url="/crud" class="ajaxcheckbox fa"></span>
```

Javascript:

```javascript
$(".ajaxcheckbox").ajaxcheckbox();
```

### Usage by delegation

Remember: when using delegation we need to manually set the initial value CSS class (in the example
`fa-check-square-o`).

HTML:

```html
<div id="user">
    <span data-id="5" data-name="activo"
        class="ajaxcheckbox fa fa-check-square-o"></span>
    <span data-id="5" data-name="visible"
        class="ajaxcheckbox fa fa-check-square-o"></span>
</div>
```

Javascript:

```javascript
$('#user').ajaxcheckbox({
   selector: '.ajaxcheckbox',
   url: '/crud',
   pk: 1
});
```

## Configuration

The default options are under `$.fn.ajaxcheckbox.defaults`

Options can be defined upon invocation of the plugin or via data-* attributes.
The latter have preference. So, for each setting there are three places to
look at (in this order): data attribute (HTML), invocation settings (JS), global settings (JS)

Property | Type | Default | Description
---------|------|---------|------------
id | string | null | Value of parameter 'id' sent to the server on the Ajax request.
url | string | null | The Ajax request URL.
name | string | null | Value of parameter 'name' sent to the server on the Ajax request.
extraParams | object | {} | Additional parameters sent on each request.
value | boolean | null | Initial value to set upon control initialization. Cannot be used with delegation (selector option).
selector | string | null | You can use a selector to apply the behaviour by delegation. See http://api.jquery.com/on/ for reference. Useful on dynamically created or updated elements. Note that you can't set a initial value (value option).
checkedClass | string | "fa-check-square-o" | CSS class name for the checked state.
uncheckedClass | string | "fa-square-o" | CSS class name for the unchecked state.
updatingClass | string | "fa-exchange" | CSS class name for the updating state (while the Ajax call is on).
errorClass | string | "fa-exclamation-triangle" | CSS class name for the error state.
success | function | null | Success callback. Called upon receiving succesful response from server (status code = 200).

## Ajax request

The Ajax request is a POST with this basic parameters: id, name, action, value

The first three parameters are taken from the settings, the last one is the
boolean value of the checkbox.

The POST request expects a JSON response with a primitive boolean indicating
the final status of the checkbox. Alternatively, if you are using the success callback, you can
send a full JSON object which will be processed by your success callback.

## Methods

There is currently only one public method: `isChecked`

It returns the current state of the control or `null` if the state is not
checked or unchecked (i.e. updating, error).

```javascript
$("#myCheckbox").ajaxcheckbox('isChecked') // -> boolean
```

## Events: listened

The control responds to the `click` event on the element to change state and
send a request to the server.

## Events: triggered

The widget triggers some events:

* `change`: the standard event is triggered on change upon a succesful ajax 
request (actually on the `onDone` ajax handler)
* `error.ajaxcheckbox`: a custom event to signal that an error has ocurred

## TODO

* unit testing (qunit)
* demos (jsfiddle)
* more docs (github.io)
* grunt build with minified version