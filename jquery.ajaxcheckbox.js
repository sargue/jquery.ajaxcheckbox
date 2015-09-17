// jquery.ajaxcheckbox, (c) Sergi Baila, MIT LICENSE
// see https://github.com/sargue/jquery.ajaxcheckbox
(function ($) {
    'use strict';

    function getClass(bool, settings) {
        return bool ? settings.checkedClass : settings.uncheckedClass;
    }

    function getSettings(options, data) {
        return $.extend(
            {},
            $.fn.ajaxcheckbox.defaults,
            options,
            data
        );
    }

    function isNormalState(el, settings) {
        return el.hasClass(settings.checkedClass) ||
            el.hasClass(settings.uncheckedClass);
    }

    $.fn.ajaxcheckbox = function (options) {
        var clickHandler, isChecked;
        
        clickHandler = function () {
            var $this = $(this),
                settings = getSettings(options, $this.data()),
                params;

            function onDone(data) {
                // success callback, default null so it won't enter the block
                if (settings.success) {
                    data = settings.success(data);
                }

                $this.removeClass(settings.updatingClass);
                if (typeof data !== 'boolean') {
                    $this
                        .addClass(settings.errorClass)
                        .trigger("error.ajaxcheckbox");
                } else {
                    $this
                        .addClass(getClass(data, settings))
                        .data("value", data)
                        .trigger("change", data);
                }
            }

            function onFail() {
                $this
                    .removeClass(settings.updatingClass)
                    .addClass(settings.errorClass)
                    .trigger("error.ajaxcheckbox");
            }

            if (isNormalState($this, settings)) {
                params = $.extend(settings.extraParams,
                    {
                        action: settings.action || "ipe-" + settings.name,
                        id    : settings.id,
                        name  : settings.name,
                        value : $this.hasClass(settings.uncheckedClass)
                    });
                $this
                    .removeClass(settings.checkedClass)
                    .removeClass(settings.uncheckedClass)
                    .data("value", null)
                    .addClass(settings.updatingClass);
                $.post(settings.url, params).done(onDone).fail(onFail);
            }
        };

        // public method
        isChecked = function () {
            // we use the data value field, if exists
            var $this = $(this),
                value = $this.data("value"),
                settings;

            if (value !== null) {
                return value;
            }

            /** If there is not a "value" on the dataset the control hasn't
             been updated and had not an initial value, so our last resort
             is check the CSS class it has. */
            settings = getSettings(options, $this.data());
            if (isNormalState($this, settings)) {
                return $this.hasClass(settings.checkedClass);
            }
            return null;
        };

        if (options === 'isChecked') {
            return isChecked.apply($(this), $.makeArray(arguments).slice(1));
        }

        // jQuery chaining
        return this.each(function () {
            var $this = $(this),
                settings = getSettings(options, $this.data());
            if (settings.selector === null) {
                if (settings.value !== null) {
                    $this
                        .removeClass(settings.checkedClass)
                        .removeClass(settings.uncheckedClass)
                        .addClass(getClass(settings.value, settings));
                }
            }

            $this.on("click", settings.selector, clickHandler);
            return this;
        });
    };

    $.fn.ajaxcheckbox.defaults = {
        /**
         * Value of parameter 'id' sent to the server on the Ajax request.
         *
         * @property id
         * @type string|number
         * @default null
         */
        id: null,

        /**
         * Value of parameter 'action' sent to the server on the Ajax request.
         *
         * If null this parameter is computed as "ipe-" + the value of the 
         * parameter 'name'.
         *
         * @property action
         * @type string
         * @default null
         */
        action: null,

        /**
         * The Ajax request URL.
         *
         * @property url
         * @type string
         * @default null
         */
        url: null,

        /**
         * Value of parameter 'name' sent to the server on the Ajax request.
         *
         * @property name
         * @type string
         * @default null
         */
        name: null,

        /**
         * Additional parameters sent on each request.
         *
         * @property extraParams
         * @type object
         * @default {}
         */
        extraParams: {},

        /**
         * Initial value to set upon control initialization. Cannot be used
         * with delegation (selector option).
         *
         * @property value
         * @type boolean
         * @default null
         */
        value: null,

        /**
         * You can use a selector to apply the behaviour by delegation.
         * See http://api.jquery.com/on/
         * Useful on dynamically created or updated elements. Note that you
         * can't set a initial value (value option).
         *
         *  @property selector
         *  @type string
         *  @default null
         *  @example
         *  <div id="user">
         *      <span data-id="5" data-name="activo" data-action="ipeActivo"
         *          class="ajaxcheckbox fa fa-check-square-o"></span>
         *      <span data-id="5" data-name="visible" data-action="ipeBooleano"
         *          class="ajaxcheckbox fa fa-check-square-o"></span>
         *  </div>
         *
         *  &lt;script&gt;
         *  $('#user').ajaxcheckbox({
         *     selector: '.ajaxcheckbox',
         *     url: '/crud',
         *     pk: 1
         * });
         *  &lt;/script&gt;
         **/
        selector: null,

        /**
         * Success callback. Called upon receiving succesful response from server (status code = 200).
         * It is called before updating the control. The server response must be a valid JSON response.
         * <p/>
         * The callback function receives the response as the first argument.
         * <p/>
         * The funcion should return the boolean value that should be updated on the control.
         * <p/>
         * A common usage scenario is when you detect, server-side, that the value can't be changed.
         * You want to keep the original value and, probably, display a message to the user. See the
         * example below.
         *
         *  @property sucess
         *  @type function
         *  @default null
         *  @example
         *  $("#user").ajaxcheckbox({
         *      success: function(response) {
         *          if (!response.ok) {
         *              showUserMessage(response.msg);
         *          }
         *          return response.checkValue;
         *      }
         *  });
         */
        success: null,

        /**
         * CSS class name for the checked state.
         *
         * @property checkedClass
         * @type string
         * @default "fa-check-square-o"
         */
        checkedClass: "fa-check-square-o",

        /**
         * CSS class name for the unchecked state.
         *
         * @property uncheckedClass
         * @type string
         * @default "fa-square-o"
         */
        uncheckedClass: "fa-square-o",

        /**
         * CSS class name for the updating state (while the Ajax call is on).
         *
         * @property updatingClass
         * @type string
         * @default "fa-exchange"
         */
        updatingClass: "fa-exchange",

        /**
         * CSS class name for the error state.
         *
         * @property errorClass
         * @type string
         * @default "fa-exclamation-triangle"
         */
        errorClass: "fa-exclamation-triangle"
    };
}(window.jQuery));