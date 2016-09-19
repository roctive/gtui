/* Packaged at 17:20 Sep 19, 2016. Version: None */
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(5);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	(function ($) {
	    var _gtui = {};

	    var _parseObj = function (sourceStr) {
	        var obj = {};
	        sourceStr = sourceStr.replace(/^\s*{/, '').replace(/}\s*$/, '').split(',');

	        for (var i = 0, length = sourceStr.length; i < length; i++) {
	            var _temp = sourceStr[i].split(':'),
	                _key = $.trim(_temp[0]).replace(/(^"\s*|^'\s*)/, '').replace(/(\s*"$|\s*'$)/, ''),
	                _value = $.trim(_temp[1]).replace(/(^"\s*|^'\s*)/, '').replace(/(\s*"$|\s*'$)/, '');

	            obj[_key] = _value
	        }
	        return obj;
	    };

	    $.extend(_gtui, {
	        utils: {
	            parseObj: _parseObj
	        }
	    });

	    window.gtui = _gtui;
	})(jQuery);

	__webpack_require__(2);

	__webpack_require__(3);
	__webpack_require__(4);

/***/ },
/* 2 */
/***/ function(module, exports) {

	(function ($) {
	    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
	        toBind = ('onwheel' in document || document.documentMode >= 9) ?
	                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
	        slice = Array.prototype.slice,
	        nullLowestDeltaTimeout, lowestDelta;

	    if ($.event.fixHooks) {
	        for (var i = toFix.length; i;) {
	            $.event.fixHooks[toFix[--i]] = $.event.mouseHooks;
	        }
	    }

	    var special = $.event.special.mousewheel = {
	        setup: function () {
	            if (this.addEventListener) {
	                for (var i = toBind.length; i;) {
	                    this.addEventListener(toBind[--i], handler, false);
	                }
	            } else {
	                this.onmousewheel = handler;
	            }
	            // Store the line height and page height for this particular element
	            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
	            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
	        },

	        teardown: function () {
	            if (this.removeEventListener) {
	                for (var i = toBind.length; i;) {
	                    this.removeEventListener(toBind[--i], handler, false);
	                }
	            } else {
	                this.onmousewheel = null;
	            }
	            // Clean up the data we added to the element
	            $.removeData(this, 'mousewheel-line-height');
	            $.removeData(this, 'mousewheel-page-height');
	        },

	        getLineHeight: function (elem) {
	            var $elem = $(elem),
	                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
	            if (!$parent.length) {
	                $parent = $('body');
	            }
	            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
	        },

	        getPageHeight: function (elem) {
	            return $(elem).height();
	        },

	        settings: {
	            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
	            normalizeOffset: true  // calls getBoundingClientRect for each event
	        }
	    };

	    $.fn.extend({
	        mousewheel: function (fn) {
	            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
	        },

	        unmousewheel: function (fn) {
	            return this.unbind('mousewheel', fn);
	        }
	    });


	    function handler(event) {
	        var orgEvent = event || window.event,
	            args = slice.call(arguments, 1),
	            delta = 0,
	            deltaX = 0,
	            deltaY = 0,
	            absDelta = 0,
	            offsetX = 0,
	            offsetY = 0;
	        event = $.event.fix(orgEvent);
	        event.type = 'mousewheel';

	        // Old school scrollwheel delta
	        if ('detail' in orgEvent) { deltaY = orgEvent.detail * -1; }
	        if ('wheelDelta' in orgEvent) { deltaY = orgEvent.wheelDelta; }
	        if ('wheelDeltaY' in orgEvent) { deltaY = orgEvent.wheelDeltaY; }
	        if ('wheelDeltaX' in orgEvent) { deltaX = orgEvent.wheelDeltaX * -1; }

	        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
	        if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
	            deltaX = deltaY * -1;
	            deltaY = 0;
	        }

	        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
	        delta = deltaY === 0 ? deltaX : deltaY;

	        // New school wheel delta (wheel event)
	        if ('deltaY' in orgEvent) {
	            deltaY = orgEvent.deltaY * -1;
	            delta = deltaY;
	        }
	        if ('deltaX' in orgEvent) {
	            deltaX = orgEvent.deltaX;
	            if (deltaY === 0) { delta = deltaX * -1; }
	        }

	        // No change actually happened, no reason to go any further
	        if (deltaY === 0 && deltaX === 0) { return; }

	        // Need to convert lines and pages to pixels if we aren't already in pixels
	        // There are three delta modes:
	        //   * deltaMode 0 is by pixels, nothing to do
	        //   * deltaMode 1 is by lines
	        //   * deltaMode 2 is by pages
	        if (orgEvent.deltaMode === 1) {
	            var lineHeight = $.data(this, 'mousewheel-line-height');
	            delta *= lineHeight;
	            deltaY *= lineHeight;
	            deltaX *= lineHeight;
	        } else if (orgEvent.deltaMode === 2) {
	            var pageHeight = $.data(this, 'mousewheel-page-height');
	            delta *= pageHeight;
	            deltaY *= pageHeight;
	            deltaX *= pageHeight;
	        }

	        // Store lowest absolute delta to normalize the delta values
	        absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

	        if (!lowestDelta || absDelta < lowestDelta) {
	            lowestDelta = absDelta;

	            // Adjust older deltas if necessary
	            if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
	                lowestDelta /= 40;
	            }
	        }

	        // Adjust older deltas if necessary
	        if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
	            // Divide all the things by 40!
	            delta /= 40;
	            deltaX /= 40;
	            deltaY /= 40;
	        }

	        // Get a whole, normalized value for the deltas
	        delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
	        deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
	        deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

	        // Normalise offsetX and offsetY properties
	        if (special.settings.normalizeOffset && this.getBoundingClientRect) {
	            var boundingRect = this.getBoundingClientRect();
	            offsetX = event.clientX - boundingRect.left;
	            offsetY = event.clientY - boundingRect.top;
	        }

	        // Add information to the event object
	        event.deltaX = deltaX;
	        event.deltaY = deltaY;
	        event.deltaFactor = lowestDelta;
	        event.offsetX = offsetX;
	        event.offsetY = offsetY;
	        // Go ahead and set deltaMode to 0 since we converted to pixels
	        // Although this is a little odd since we overwrite the deltaX/Y
	        // properties with normalized deltas.
	        event.deltaMode = 0;

	        // Add event and delta to the front of the arguments
	        args.unshift(event, delta, deltaX, deltaY);

	        // Clearout lowestDelta after sometime to better
	        // handle multiple device types that give different
	        // a different lowestDelta
	        // Ex: trackpad = 3 and mouse wheel = 120
	        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
	        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

	        return ($.event.dispatch || $.event.handle).apply(this, args);
	    }

	    function nullLowestDelta() {
	        lowestDelta = null;
	    }

	    function shouldAdjustOldDeltas(orgEvent, absDelta) {
	        // If this is an older event and the delta is divisable by 120,
	        // then we are assuming that the browser is treating this as an
	        // older mouse wheel event and that we should divide the deltas
	        // by 40 to try and get a more usable deltaFactor.
	        // Side note, this actually impacts the reported scroll distance
	        // in older browsers and can cause scrolling to be slower than native.
	        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
	        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
	    }
	})(jQuery);

/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * Table
	 */

	(function ($) {

	    $.extend(gtui, {
	        table: {
	            constant: {
	                TABLE_CONTAINER_CLASS: 'table-container',

	                TABLE_CLASS: 'table',
	                TABLE_BORDERED_CLASS: 'table-bordered',
	                TABLE_CELL_HORIZONTAL_BORDERED_CLASS: 'table-cell-horizontal-bordered',
	                TABLE_CELL_VERTICAL_BORDERED_CLASS: 'table-cell-vertical-bordered',

	                TABLE_STRIPED: 'table-striped',
	                TABLE_STRIPED_ODD: 'table-striped-odd',
	                TABLE_STRIPED_EVEN: 'table-striped-even',

	                ORIGIN_TABLE_CONTAINER_CLASS: 'table-content',
	                FROZEN_HEADER_TABLE_CONTAINER_CLASS: 'table-frozen-header',
	                FROZEN_COLUMNS_TABLE_CONTAINER_CLASS: 'table-frozen-columns',
	                FROZEN_COLUMNS_TABLE_HEADER_CONTAINER_CLASS: 'table-frozen-columns-header',

	                columnType: {
	                    TEXT: 0,
	                    CHECKBOX: 100,
	                    LINK: 200,
	                    BUTTON_GROUP: 300
	                }
	            }
	        }
	    });

	    $.widget("gtui.table", {
	        options: {
	            fillSpanClass: 'fill-span',

	            frozenColumnsCount: 3
	        },

	        _create: function () {
	            var _self = this,
	                _el = _self.element;

	            _self._getContainers();

	            _self._getTables();

	            _self.updateLayout();

	            _self._initEvents();
	        },
	        _getContainers: function () {
	            var _self = this,
	                _el = _self.element,
	                _constants = gtui.table.constant;

	            _self._originTableContainer = _el.children('.' + _constants.ORIGIN_TABLE_CONTAINER_CLASS);
	            _self._frozenHeaderContainer = _el.children('.' + _constants.FROZEN_HEADER_TABLE_CONTAINER_CLASS);
	            _self._frozenColumnsContainer = _el.children('.' + _constants.FROZEN_COLUMNS_TABLE_CONTAINER_CLASS);
	            _self._frozenColumnsHeaderContainer = _el.children('.' + _constants.FROZEN_COLUMNS_TABLE_HEADER_CONTAINER_CLASS);
	        },
	        _getTables: function () {
	            var _self = this;

	            _self._originTable = _self._originTableContainer.children('table');
	            _self._originTableHeaders = _self._originTable.find('> thead > tr > th');
	            _self._originTableRows = _self._originTable.find('> tbody > tr');
	            _self._frozenHeaderTable = _self._frozenHeaderContainer.children('table');
	            _self._frozenColumnsTable = _self._frozenColumnsContainer.children('table');
	            _self._frozenColumnsHeaderTable = _self._frozenColumnsHeaderContainer.children('table');
	        },
	        _initEvents: function () {
	            var _self = this,
	                _eventNamespace = _self.eventNamespace;
	            
	            // Do scroll when origin table is scrolled.
	            _self._originTableContainer
	                .off(_eventNamespace)
	                .on('scroll' + _eventNamespace, _self, function (e) {
	                    e.data._frozenHeaderContainer.scrollLeft(e.data._originTableContainer.scrollLeft());
	                    e.data._frozenColumnsContainer.scrollTop(e.data._originTableContainer.scrollTop());
	                })

	            // Reset layout when window is resized.
	            _self.element.on('resize' + _eventNamespace, _self, function (e) {
	                e.data.updateLayout();
	            });

	            // Scroll origin table when table holds the frozen columns is scrolled.
	            _self._frozenColumnsTable.on('mousewheel' + _eventNamespace, _self, function (e) {
	                _self._originTableContainer.scrollTop(_self._originTableContainer.scrollTop() + e.deltaY * -1);
	            });
	        },
	        _dealWithFrozenColumnsHeader: function () {
	            var _self = this,
	                    _oth = _self._originTableHeaders;

	            _self._frozenColumnsHeaderTable.find('> thead > tr > th').map(function (i, th) {
	                $(th).outerWidth(_oth[i].offsetWidth).outerHeight(_oth[i].offsetHeight);
	            });

	            _self._frozenColumnsHeaderContainer.outerWidth(_self._frozenColumnsContainer.width());
	        },
	        _dealWithFrozenColumns: function () {
	            var _self = this,
	                _oth = _self._originTableHeaders,
	                _otr = _self._originTableRows,
	                _width = 0;

	            _self._frozenColumnsTable.find('> thead > tr > th').map(function (i, th) {
	                if (i < _self._getFrozenColumnsCount()) {
	                    _width += _oth[i].offsetWidth;
	                    $(th).outerWidth(_oth[i].offsetWidth).outerHeight(_oth[i].offsetHeight);
	                }
	            });
	            _self._frozenColumnsTable.find('> tbody > tr').map(function (i, tr) {
	                $(tr).outerHeight(tr.offsetHeight);
	            });

	            _self._frozenColumnsContainer
	                .outerHeight(_self._originTableContainer[0].clientHeight +
	                    _self._originTable.find('thead').outerHeight())
	                .outerWidth(_width + 2);
	        },
	        _dealWithFrozenHeader: function () {
	            var _self = this,
	                _oth = _self._originTableHeaders;

	            _self._frozenHeaderTable.find('> thead > tr > th').map(function (i, th) {
	                $(th).outerWidth(_oth[i].offsetWidth).outerHeight(_oth[i].offsetHeight);
	            });

	            _self._frozenHeaderContainer.outerWidth(_self._originTableContainer[0].clientWidth);
	        },
	        _dealWithOriginHeader: function () {
	            var _marginTop = this._originTable.find('thead').outerHeight();
	            this._originTable.css({ 'margin-top': _marginTop * -1 });

	            this.element.css({ 'padding-top': _marginTop });

	            this._originTable.find('> tbody > tr').map(function (i, tr) {
	                $(tr).outerHeight(tr.offsetHeight);
	            });
	        },
	        _getFrozenColumnsCount: function () {
	            var count = parseInt(this.options.frozenColumnsCount);
	            return count ? count : 0;
	        },
	        _destroy: function () {

	        },

	        updateLayout: function () {
	            var _self = this;

	            _self._dealWithOriginHeader();
	            _self._dealWithFrozenHeader();
	            _self._dealWithFrozenColumns();
	            _self._dealWithFrozenColumnsHeader();
	        },
	        updateItemsSource: function () {
	            var _self = this;

	            _self._getTables();

	            _self.updateLayout();
	        }
	    });
	})(jQuery);

/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Table
	 */

	(function ($) {

	    $.widget("gtui.verticaltile", {
	        options: {
	            
	        },
	        _create: function () {
	            this._getValues();
	            this._updateHeight();

	            this._initEvents();
	        },
	        _getValues: function () {
	            var _self = this,
	                _el = _self.element;

	            var _top = _el.position().top,
	                _outerHeight = _el.outerHeight();

	            var _doc = document.documentElement,
	                _docScrollHeight = _doc.scrollHeight;

	            _self._elementTop = _top;
	            _self._elementOffsetBottom = _docScrollHeight - _top - _outerHeight;
	        },
	        _updateHeight: function (e) {
	            var _self = this,
	                _el = _self.element,
	                _window = window;

	            var _top = _self._elementTop,
	                _docHeight = document.documentElement.clientHeight,
	                _offsetBottom = _self._elementOffsetBottom;

	            if (_top >= _docHeight - _offsetBottom) { }
	            else {
	                _el.outerHeight(_docHeight - _offsetBottom - _top);
	                _self._docClientHeight = _docHeight;

	                _el.trigger('resize', e);
	            }
	        },
	        _initEvents: function () {
	            $(window)
	                .off('resize' + this.eventNamespace)
	                .on('resize' + this.eventNamespace, this, function (e) {
	                    if (e.data._docClientHeight !== document.documentElement.clientHeight)
	                        e.data._updateHeight(e);
	                });
	        },
	        _destory: function e() {
	            $(window).off('resize' + this.eventNamespace);
	        }
	    });
	})(jQuery);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	(function ($) {
	    if (window.angular) {
	        angular.module('gtui', []);
	    }
	})(jQuery);

	// Directives
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);

/***/ },
/* 6 */
/***/ function(module, exports) {

	(function ($) {
	    if (window.angular) {
	        var gta = angular.module('gtui'),

	            _dataConfigField = 'table-config',
	            _divHTML = '<div></div>',
	            _tbodyHTML = 'tbody',

	            getTableClass = function (config) {
	                var _tableClass = [gtui.table.constant.TABLE_CLASS];

	                if (config.tableBordered) {
	                    _tableClass.push(gtui.table.constant.TABLE_BORDERED_CLASS);
	                }
	                if (config.tableStriped) {
	                    _tableClass.push(gtui.table.constant.TABLE_STRIPED);
	                }

	                return _tableClass.join(' ');
	            },
	            getTemplate = function (el, config) {
	                // Template outer element
	                var _div = $(_divHTML).addClass(gtui.table.constant.TABLE_CONTAINER_CLASS),

	                    // tables
	                    _originTableTemplate = el.children('table'),
	                    _frozenHeaderTemplate,
	                    _frozenColumnsTemplate,
	                    _frozenColumnsHeaderTemplate,

	                    // table wrapers
	                    _originTableWrapper = $(_divHTML).addClass(gtui.table.constant.ORIGIN_TABLE_CONTAINER_CLASS),
	                    _frozenHeaderWrapper = $(_divHTML).addClass(gtui.table.constant.FROZEN_HEADER_TABLE_CONTAINER_CLASS),
	                    _frozenColumnsTableWrapper = $(_divHTML).addClass(gtui.table.constant.FROZEN_COLUMNS_TABLE_CONTAINER_CLASS),
	                    _frozenColumnsHeaderWrapper = $(_divHTML).addClass(gtui.table.constant.FROZEN_COLUMNS_TABLE_HEADER_CONTAINER_CLASS),
	                        
	                    _frozenColumnsCount = parseInt(config.frozenColumnsCount);

	                // Deal with frozenColumnsCount.
	                _frozenColumnsCount = _frozenColumnsCount ? _frozenColumnsCount : 0;

	                var _tableClass = getTableClass(config);

	                // Add classes to original table template.
	                _originTableTemplate.addClass(_tableClass);

	                // Generate table which holds the frozen headers on top of this table-ish component based on the original table.
	                _frozenHeaderTemplate = _originTableTemplate.clone();
	                _frozenHeaderTemplate.children(_tbodyHTML).remove();

	                // Generate table which holds the frozen columns on left of this table-ish component based on the original table.
	                _frozenColumnsTemplate = _originTableTemplate.clone();
	                
	                // Deal with table that holds the frozen columns: Hide the non-frozen columns with ng-class attribute.
	                var _th = _frozenColumnsTemplate.find('> thead > tr > th');
	                if (_th.length === 1 && _th.attr('ng-repeat')) {
	                    _th.attr('ng-if', '$index < ' + _frozenColumnsCount);
	                }
	                var _td = _frozenColumnsTemplate.find('> tbody > tr > td');
	                if (_td.length === 1 && _td.attr('ng-repeat')) {
	                    _td.attr('ng-if', '$index < ' + _frozenColumnsCount);
	                }

	                // Generate the table holds the headers of the table holds the frozen columns.
	                // This table is fixed on top, and fixed on left.
	                _frozenColumnsHeaderTemplate = _frozenColumnsTemplate.clone();
	                _frozenColumnsHeaderTemplate.children(_tbodyHTML).remove();
	                
	                _div.append(_originTableWrapper.append(_originTableTemplate))
	                    .append(_frozenHeaderWrapper.append(_frozenHeaderTemplate))
	                    .append(_frozenColumnsTableWrapper.append(_frozenColumnsTemplate))
	                    .append(_frozenColumnsHeaderWrapper.append(_frozenColumnsHeaderTemplate));

	                return _div;
	            };

	        gta.directive('gtuiTable', function ($compile, $timeout) {
	            return {
	                restrict: "EA",
	                scope: false,
	                template: function (element, attrs) {
	                    var _tableBordered = attrs.tableBordered,
	                        _frozenCols = attrs.frozenCols,
	                        _tableClass = [gtui.table.constant.TABLE_CLASS],
	                        _template = [];

	                    // Deal with data-config
	                    if (!attrs.config) {
	                        console.error('gtui-table: "data-config" attribute is missing.');
	                        return _divHTML;
	                    }
	                    else {
	                        var _config = gtui.utils.parseObj(attrs.config);
	                        element.data(_dataConfigField, _config)
	                    }

	                    return getTemplate(element, _config).prop("outerHTML");
	                },
	                replace: true,
	                transclude: false,
	                link: function (scope, element, attrs) {
	                    var _frozenCols = parseInt(attrs.frozenColumnsCount),
	                        _config = element.data(_dataConfigField);

	                    _frozenCols = _frozenCols ? _frozenCols : 0;

	                    if (_config.vm) {
	                        scope[_config.vm].metaTable = element;
	                    }
	                    else {
	                        scope.metaTable = element;
	                    }

	                    $(document).ready(function () {
	                        element.table({
	                            frozenColumnsCount: _config.frozenColumnsCount
	                        });
	                    });
	                }
	            };
	        });
	    }
	})(jQuery);

/***/ },
/* 7 */
/***/ function(module, exports) {

	(function ($) {
	    if (window.angular) {
	        var gta = angular.module('gtui');

	        gta.directive('gtuiTableHead', function ($compile, $timeout) {
	            return {
	                restrict: "EA",
	                scope: false,
	                template: function (element, attrs) {
	                    var _template = [],
	                        _config = gtui.utils.parseObj(element.closest('.table-container').attr('data-config'));

	                    _template.push('<thead>');
	                    _template.push('  <tr ng-repeat="row in ' + _config.as + '.' + _config.columnsField + '">');
	                    _template.push('    <th ng-repeat="item in row.' + _config.columnsField +
	                        '" colspan="{{item.' + _config.colspanField +
	                        '}}" rowspan="{{item.' + _config.rowspanField +
	                        '}}">{{item.' + _config.colDisplayField + '}}</th>');
	                    _template.push('  </tr>');
	                    _template.push('</thead>');

	                    return _template.join('');
	                },
	                replace: true,
	                transclude: false,
	                link: function (scope, element, attrs) {
	                    
	                }
	            };
	        });
	    }
	})(jQuery);

/***/ },
/* 8 */
/***/ function(module, exports) {

	(function ($) {
	    if (window.angular) {
	        var gta = angular.module('gtui'),
	            inputCellTemplate = function (config) {

	            };

	        gta.directive('gtuiTableBody', function ($compile, $timeout) {
	            return {
	                restrict: "EA",
	                scope: false,
	                template: function (element, attrs) {
	                    var _template = [],
	                        _config = gtui.utils.parseObj(element.closest('.table-container').attr('data-config'));

	                    _template.push('<tbody>');
	                    _template.push('  <tr ng-repeat="row in ' + _config.as + '.' + _config.itemsSourceField + '">');
	                    _template.push('    <td ng-repeat="cell in ' + _config.as + '.' + _config.rowsField + '">');
	                    _template.push('     ' + inputCellTemplate(_config));
	                    _template.push('    </td>');
	                    _template.push('  </tr>');
	                    _template.push('</tbody>');

	                    return _template.join('');
	                },
	                replace: true,
	                transclude: false,
	                link: function (scope, element, attrs) {
	                    
	                }
	            };
	        });
	    }
	})(jQuery);

/***/ },
/* 9 */
/***/ function(module, exports) {

	(function ($) {
	    if (window.angular) {
	        var gta = angular.module('gtui');

	        gta.directive('gtuiVerticalTile', function ($compile, $timeout) {
	            return {
	                restrict: "EA",
	                template: '',
	                link: function (scope, element, attrs) {
	                    $(document).ready(function () {
	                        element.verticaltile();
	                    });
	                }
	            };
	        });
	    }
	})(jQuery);

/***/ }
/******/ ]);