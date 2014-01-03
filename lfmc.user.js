// ==UserScript==
// @name        LFMC
// @namespace   http://barrenfrozenwasteland.com
// @include     http://www.lovefilm.com/*
// @include     https://www.lovefilm.com/*
// @match     http://www.lovefilm.com/*
// @match     https://www.lovefilm.com/*
// @version     1
// @grant       GM_addStyle
// @grant    GM_getResourceText
// @require http://yui.yahooapis.com/combo?3.14.1/yui-base/yui-base-min.js&3.14.1/oop/oop-min.js&3.14.1/event-custom-base/event-custom-base-min.js&3.14.1/features/features-min.js&3.14.1/dom-core/dom-core-min.js&3.14.1/dom-base/dom-base-min.js&3.14.1/selector-native/selector-native-min.js&3.14.1/selector/selector-min.js&3.14.1/node-core/node-core-min.js&3.14.1/color-base/color-base-min.js&3.14.1/dom-style/dom-style-min.js&3.14.1/node-base/node-base-min.js&3.14.1/event-base/event-base-min.js&3.14.1/event-delegate/event-delegate-min.js&3.14.1/node-event-delegate/node-event-delegate-min.js&3.14.1/pluginhost-base/pluginhost-base-min.js&3.14.1/pluginhost-config/pluginhost-config-min.js&3.14.1/node-pluginhost/node-pluginhost-min.js&3.14.1/dom-screen/dom-screen-min.js&3.14.1/node-screen/node-screen-min.js&3.14.1/node-style/node-style-min.js&3.14.1/attribute-core/attribute-core-min.js&3.14.1/event-custom-complex/event-custom-complex-min.js&3.14.1/attribute-observable/attribute-observable-min.js
// @require http://yui.yahooapis.com/combo?3.14.1/attribute-extras/attribute-extras-min.js&3.14.1/attribute-base/attribute-base-min.js&3.14.1/attribute-complex/attribute-complex-min.js&3.14.1/base-core/base-core-min.js&3.14.1/base-observable/base-observable-min.js&3.14.1/base-base/base-base-min.js&3.14.1/base-pluginhost/base-pluginhost-min.js&3.14.1/classnamemanager/classnamemanager-min.js&3.14.1/event-synthetic/event-synthetic-min.js&3.14.1/event-focus/event-focus-min.js&3.14.1/widget-base/widget-base-min.js&3.14.1/widget-htmlparser/widget-htmlparser-min.js&3.14.1/widget-skin/widget-skin-min.js&3.14.1/widget-uievents/widget-uievents-min.js&3.14.1/arraylist/arraylist-min.js&3.14.1/base-build/base-build-min.js&3.14.1/widget-parent/widget-parent-min.js&3.14.1/widget-child/widget-child-min.js&3.14.1/tabview-base/tabview-base-min.js&3.14.1/plugin/plugin-min.js&3.14.1/event-simulate/event-simulate-min.js&3.14.1/async-queue/async-queue-min.js&3.14.1/gesture-simulate/gesture-simulate-min.js
// @require http://yui.yahooapis.com/combo?3.14.1/node-event-simulate/node-event-simulate-min.js&3.14.1/event-key/event-key-min.js&3.14.1/node-focusmanager/node-focusmanager-min.js&3.14.1/tabview/tabview-min.js&3.14.1/array-extras/array-extras-min.js&3.14.1/history-base/history-base-min.js&3.14.1/yui-later/yui-later-min.js&3.14.1/history-html5/history-html5-min.js&3.14.1/history-hash/history-hash-min.js&3.14.1/history-hash-ie/history-hash-ie-min.js&3.14.1/router/router-min.js&3.14.1/pjax-base/pjax-base-min.js&3.14.1/querystring-stringify-simple/querystring-stringify-simple-min.js&3.14.1/io-base/io-base-min.js&3.14.1/pjax-content/pjax-content-min.js&3.14.1/pjax/pjax-min.js&3.14.1/querystring-parse/querystring-parse-min.js&3.14.1/querystring-stringify/querystring-stringify-min.js
// @resource yuiskin http://yui.yahooapis.com/combo?3.14.1/widget-base/assets/skins/night/widget-base.css&3.14.1/tabview/assets/skins/night/tabview.css
// ==/UserScript==

YUI().use('node', 'tabview', 'querystring', 'pjax', function(Y) {
    var LFI = {
        mainmenu: {},
        links: {},
        usernav: {},
        searchform: {},
        filterlists:{},
        maincontent: {},
        glowsection: {},
        pjax: {},

        init: function() {
            this.mainmenu = Y.one('.main-navigation.primary-navigation');
            this.links = this.mainmenu.all('li');
            //this.forceRedirect();
            this.usernav = Y.one('#lf-widget-1');
            this.searchform = Y.one('.site-search');
            this.filterlists = Y.one('#lf-widget-3');
            this.maincontent = Y.one('#main-content');
            this.glowsection = Y.one('.section.glow');
            this.addStyles();
            this.fixLayout();
            this.forceSearch();

            // Work out which page we're on and apply appropriate interface
            if (this.glowsection.hasClass('overview')) {
                this.initOverview();
            } else if (this.glowsection.hasClass('listview')) {
                this.forceGridview();
            } else if (this.glowsection.hasClass('gridview')) {
                this.initGridview();
            }

        },

        /**
         * Force the site to the Instant section
         */
        forceRedirect: function() {
            var links = this.links;
            links.shift();
            var instantlink = links.shift();
            if (!instantlink.hasClass('current')) {
                window.location = instantlink.one('a').get('href');
            }
        },

        /**
         * Add YUI skin and custom CSS
         */
        addStyles: function() {
            GM_addStyle(GM_getResourceText('yuiskin'));
            var style = 'div.search-category-wrapper, #lf-widget-1, #lf-main-navigation, .page-footer, .list_grid_view, .itemsperpage {display:none;}';
            style += '.page {width:98%}';
            style += 'form.site-search, #lf-search-keywords-1, form.site-search .btn {height:auto}';
            style += '#lf-search-keywords-1, form.site-search .btn {font-size: 3em}';
            style += 'body {font-size: 1.5em}';
            style += 'a.watchlist-length {float:right; font-size: 3em; margin-left: 1em; margin-right: -4em; line-height: 1em; padding: 0.2em;}';
            GM_addStyle(style);
            Y.one('body').addClass('yui3-skin-night');
        },

        /*
         * Force search to be limited to instant
         */
        forceSearch: function() {
            var searchmode = this.searchform.one('#lf-search-categories');
            searchmode.all('option').each(function(o) {
                if (o.get('label') === "Instant") {
                    o.set('selected', 'selected');
                }
            });
        },

        /*
         * Remove unncessary interface elements and adjust layout classes
         */
        fixLayout: function() {
            Y.one('.page-left-nav').remove(false);
            Y.one('.lf-main-navigation').remove(false);
            Y.one('.crumb').remove(false);
            this.maincontent.removeClass('span-10');
            var watchlist = Y.one('a.watchlist-length');
            watchlist.remove(false);
            Y.one('.search-bar').prepend(watchlist);
        },

        initOverview: function() {
                var tabcontainer = this.maincontent.create('<ul></ul>');
                this.glowsection.all('.shelf').each(function(shelf) {
                    var name = shelf.getAttribute('data-widget_name');
                    var id = 'ov-'+name.toLowerCase().replace(/ /g, '_');
                    var title = shelf.one('h2').get('textContent');
                    shelf.setAttribute('id', id);
                    var tab = tabcontainer.create('<li><a href="#'+id+'">'+title+'</a></li>');
                    tabcontainer.appendChild(tab);
                });
                this.maincontent.prepend(tabcontainer);
                var tabview = new Y.TabView({
                    srcNode: '#main-content'
                });
                tabview.render();
        },

        forceGridview: function() {
            if (window.location.href.contains("v=l")) {
                var newloc = window.location.href.replace("v=l", "v=g");
                window.location.href = newloc;
            } else {
                window.location.href += "&v=g";
            }
        },

        initGridview: function() {
            var rows = this.glowsection.all('.row');
            var firstrow = Y.one('.first_row');
            rows.each(function(row) {
                if (row !== firstrow) {
                    row.all('.compact_info_snb').each(function(item) {
                        item.remove(false);
                        if (item.hasClass('first')) {
                            item.removeClass('first');
                        }
                        firstrow.append(item);
                    });
                }
            });
        }

    }

    LFI.init();

});
