
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.38.2' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var airlines = [
    	{
    		airline: "Aer Lingus",
    		avail_seat_km_per_week: 320906734,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Aeroflot*",
    		avail_seat_km_per_week: 1197672318,
    		incidents_85_99: 76,
    		fatal_accidents_85_99: 14,
    		fatalities_85_99: 128,
    		incidents_00_14: 6,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 88
    	},
    	{
    		airline: "Aerolineas Argentinas",
    		avail_seat_km_per_week: 385803648,
    		incidents_85_99: 6,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Aeromexico*",
    		avail_seat_km_per_week: 596871813,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 64,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Air Canada",
    		avail_seat_km_per_week: 1865253802,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Air France",
    		avail_seat_km_per_week: 3004002661,
    		incidents_85_99: 14,
    		fatal_accidents_85_99: 4,
    		fatalities_85_99: 79,
    		incidents_00_14: 6,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 337
    	},
    	{
    		airline: "Air India*",
    		avail_seat_km_per_week: 869253552,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 329,
    		incidents_00_14: 4,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 158
    	},
    	{
    		airline: "Air New Zealand*",
    		avail_seat_km_per_week: 710174817,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 7
    	},
    	{
    		airline: "Alaska Airlines*",
    		avail_seat_km_per_week: 965346773,
    		incidents_85_99: 5,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 88
    	},
    	{
    		airline: "Alitalia",
    		avail_seat_km_per_week: 698012498,
    		incidents_85_99: 7,
    		fatal_accidents_85_99: 2,
    		fatalities_85_99: 50,
    		incidents_00_14: 4,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "All Nippon Airways",
    		avail_seat_km_per_week: 1841234177,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 1,
    		incidents_00_14: 7,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "American*",
    		avail_seat_km_per_week: 5228357340,
    		incidents_85_99: 21,
    		fatal_accidents_85_99: 5,
    		fatalities_85_99: 101,
    		incidents_00_14: 17,
    		fatal_accidents_00_14: 3,
    		fatalities_00_14: 416
    	},
    	{
    		airline: "Austrian Airlines",
    		avail_seat_km_per_week: 358239823,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Avianca",
    		avail_seat_km_per_week: 396922563,
    		incidents_85_99: 5,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 323,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "British Airways*",
    		avail_seat_km_per_week: 3179760952,
    		incidents_85_99: 4,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 6,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Cathay Pacific*",
    		avail_seat_km_per_week: 2582459303,
    		incidents_85_99: 0,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "China Airlines",
    		avail_seat_km_per_week: 813216487,
    		incidents_85_99: 12,
    		fatal_accidents_85_99: 6,
    		fatalities_85_99: 535,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 225
    	},
    	{
    		airline: "Condor",
    		avail_seat_km_per_week: 417982610,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 16,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "COPA",
    		avail_seat_km_per_week: 550491507,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 47,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Delta / Northwest*",
    		avail_seat_km_per_week: 6525658894,
    		incidents_85_99: 24,
    		fatal_accidents_85_99: 12,
    		fatalities_85_99: 407,
    		incidents_00_14: 24,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 51
    	},
    	{
    		airline: "Egyptair",
    		avail_seat_km_per_week: 557699891,
    		incidents_85_99: 8,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 282,
    		incidents_00_14: 4,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 14
    	},
    	{
    		airline: "El Al",
    		avail_seat_km_per_week: 335448023,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 4,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Ethiopian Airlines",
    		avail_seat_km_per_week: 488560643,
    		incidents_85_99: 25,
    		fatal_accidents_85_99: 5,
    		fatalities_85_99: 167,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 92
    	},
    	{
    		airline: "Finnair",
    		avail_seat_km_per_week: 506464950,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Garuda Indonesia",
    		avail_seat_km_per_week: 613356665,
    		incidents_85_99: 10,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 260,
    		incidents_00_14: 4,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 22
    	},
    	{
    		airline: "Gulf Air",
    		avail_seat_km_per_week: 301379762,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 3,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 143
    	},
    	{
    		airline: "Hawaiian Airlines",
    		avail_seat_km_per_week: 493877795,
    		incidents_85_99: 0,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Iberia",
    		avail_seat_km_per_week: 1173203126,
    		incidents_85_99: 4,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 148,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Japan Airlines",
    		avail_seat_km_per_week: 1574217531,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 520,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Kenya Airways",
    		avail_seat_km_per_week: 277414794,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 283
    	},
    	{
    		airline: "KLM*",
    		avail_seat_km_per_week: 1874561773,
    		incidents_85_99: 7,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 3,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Korean Air",
    		avail_seat_km_per_week: 1734522605,
    		incidents_85_99: 12,
    		fatal_accidents_85_99: 5,
    		fatalities_85_99: 425,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "LAN Airlines",
    		avail_seat_km_per_week: 1001965891,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 2,
    		fatalities_85_99: 21,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Lufthansa*",
    		avail_seat_km_per_week: 3426529504,
    		incidents_85_99: 6,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 2,
    		incidents_00_14: 3,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Malaysia Airlines",
    		avail_seat_km_per_week: 1039171244,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 34,
    		incidents_00_14: 3,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 537
    	},
    	{
    		airline: "Pakistan International",
    		avail_seat_km_per_week: 348563137,
    		incidents_85_99: 8,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 234,
    		incidents_00_14: 10,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 46
    	},
    	{
    		airline: "Philippine Airlines",
    		avail_seat_km_per_week: 413007158,
    		incidents_85_99: 7,
    		fatal_accidents_85_99: 4,
    		fatalities_85_99: 74,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 1
    	},
    	{
    		airline: "Qantas*",
    		avail_seat_km_per_week: 1917428984,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 5,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Royal Air Maroc",
    		avail_seat_km_per_week: 295705339,
    		incidents_85_99: 5,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 51,
    		incidents_00_14: 3,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "SAS*",
    		avail_seat_km_per_week: 682971852,
    		incidents_85_99: 5,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 6,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 110
    	},
    	{
    		airline: "Saudi Arabian",
    		avail_seat_km_per_week: 859673901,
    		incidents_85_99: 7,
    		fatal_accidents_85_99: 2,
    		fatalities_85_99: 313,
    		incidents_00_14: 11,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Singapore Airlines",
    		avail_seat_km_per_week: 2376857805,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 2,
    		fatalities_85_99: 6,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 83
    	},
    	{
    		airline: "South African",
    		avail_seat_km_per_week: 651502442,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 159,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Southwest Airlines",
    		avail_seat_km_per_week: 3276525770,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 8,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Sri Lankan / AirLanka",
    		avail_seat_km_per_week: 325582976,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 14,
    		incidents_00_14: 4,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "SWISS*",
    		avail_seat_km_per_week: 792601299,
    		incidents_85_99: 2,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 229,
    		incidents_00_14: 3,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "TACA",
    		avail_seat_km_per_week: 259373346,
    		incidents_85_99: 3,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 3,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 3
    	},
    	{
    		airline: "TAM",
    		avail_seat_km_per_week: 1509195646,
    		incidents_85_99: 8,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 98,
    		incidents_00_14: 7,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 188
    	},
    	{
    		airline: "TAP - Air Portugal",
    		avail_seat_km_per_week: 619130754,
    		incidents_85_99: 0,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Thai Airways",
    		avail_seat_km_per_week: 1702802250,
    		incidents_85_99: 8,
    		fatal_accidents_85_99: 4,
    		fatalities_85_99: 308,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 1,
    		fatalities_00_14: 1
    	},
    	{
    		airline: "Turkish Airlines",
    		avail_seat_km_per_week: 1946098294,
    		incidents_85_99: 8,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 64,
    		incidents_00_14: 8,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 84
    	},
    	{
    		airline: "United / Continental*",
    		avail_seat_km_per_week: 7139291291,
    		incidents_85_99: 19,
    		fatal_accidents_85_99: 8,
    		fatalities_85_99: 319,
    		incidents_00_14: 14,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 109
    	},
    	{
    		airline: "US Airways / America West*",
    		avail_seat_km_per_week: 2455687887,
    		incidents_85_99: 16,
    		fatal_accidents_85_99: 7,
    		fatalities_85_99: 224,
    		incidents_00_14: 11,
    		fatal_accidents_00_14: 2,
    		fatalities_00_14: 23
    	},
    	{
    		airline: "Vietnam Airlines",
    		avail_seat_km_per_week: 625084918,
    		incidents_85_99: 7,
    		fatal_accidents_85_99: 3,
    		fatalities_85_99: 171,
    		incidents_00_14: 1,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Virgin Atlantic",
    		avail_seat_km_per_week: 1005248585,
    		incidents_85_99: 1,
    		fatal_accidents_85_99: 0,
    		fatalities_85_99: 0,
    		incidents_00_14: 0,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	},
    	{
    		airline: "Xiamen Airlines",
    		avail_seat_km_per_week: 430462962,
    		incidents_85_99: 9,
    		fatal_accidents_85_99: 1,
    		fatalities_85_99: 82,
    		incidents_00_14: 2,
    		fatal_accidents_00_14: 0,
    		fatalities_00_14: 0
    	}
    ];

    /* src/App.svelte generated by Svelte v3.38.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (21:1) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let h1;
    	let strong;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;
    	let t7;
    	let each_value = airlines;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			h1 = element("h1");
    			strong = element("strong");
    			strong.textContent = "Global Airline List";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "------------------------------------";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Select an airline to read some details about crashes and aviation safety";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "------------------------------------";
    			t7 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(strong, file, 22, 6, 889);
    			attr_dev(h1, "class", "svelte-pqc7nk");
    			add_location(h1, file, 22, 2, 885);
    			add_location(p0, file, 23, 2, 933);
    			add_location(p1, file, 24, 2, 979);
    			add_location(p2, file, 25, 2, 1061);
    			add_location(ul, file, 21, 1, 878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, h1);
    			append_dev(h1, strong);
    			append_dev(ul, t1);
    			append_dev(ul, p0);
    			append_dev(ul, t3);
    			append_dev(ul, p1);
    			append_dev(ul, t5);
    			append_dev(ul, p2);
    			append_dev(ul, t7);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedAirline, airlines*/ 1) {
    				each_value = airlines;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(21:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (11:1) {#if selectedAirline}
    function create_if_block(ctx) {
    	let p0;
    	let a0;
    	let t1;
    	let h1;
    	let strong0;
    	let t3;
    	let t4_value = /*selectedAirline*/ ctx[0].airline + "";
    	let t4;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let t8;
    	let t9_value = /*selectedAirline*/ ctx[0].incidents_85_99 + "";
    	let t9;
    	let t10;
    	let p3;
    	let t11;
    	let t12_value = /*selectedAirline*/ ctx[0].fatalities_85_99 + "";
    	let t12;
    	let t13;
    	let p4;
    	let t15;
    	let p5;
    	let strong1;
    	let a1;
    	let t18;
    	let br;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			p0 = element("p");
    			a0 = element("a");
    			a0.textContent = "Go back to airline list";
    			t1 = space();
    			h1 = element("h1");
    			strong0 = element("strong");
    			strong0.textContent = "Airline is:";
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "------------------------------------";
    			t7 = space();
    			p2 = element("p");
    			t8 = text("The number of safety related incidents are ");
    			t9 = text(t9_value);
    			t10 = space();
    			p3 = element("p");
    			t11 = text("The number of fatalities are ");
    			t12 = text(t12_value);
    			t13 = space();
    			p4 = element("p");
    			p4.textContent = "------------------------------------";
    			t15 = space();
    			p5 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "Source data: ";
    			a1 = element("a");
    			a1.textContent = "Five Thirty-Eight";
    			t18 = space();
    			br = element("br");
    			attr_dev(a0, "href", "#");
    			add_location(a0, file, 12, 4, 299);
    			add_location(p0, file, 12, 1, 296);
    			add_location(strong0, file, 13, 6, 389);
    			attr_dev(h1, "class", "svelte-pqc7nk");
    			add_location(h1, file, 13, 2, 385);
    			add_location(p1, file, 14, 2, 451);
    			add_location(p2, file, 15, 2, 497);
    			add_location(p3, file, 16, 2, 584);
    			add_location(p4, file, 17, 2, 657);
    			add_location(strong1, file, 18, 5, 706);
    			attr_dev(a1, "href", "https://github.com/fivethirtyeight/data/blob/master/airline-safety/airline-safety.csv");
    			add_location(a1, file, 18, 35, 736);
    			add_location(p5, file, 18, 2, 703);
    			add_location(br, file, 19, 2, 861);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p0, anchor);
    			append_dev(p0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, strong0);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, p1, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, p2, anchor);
    			append_dev(p2, t8);
    			append_dev(p2, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, p3, anchor);
    			append_dev(p3, t11);
    			append_dev(p3, t12);
    			insert_dev(target, t13, anchor);
    			insert_dev(target, p4, anchor);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, p5, anchor);
    			append_dev(p5, strong1);
    			append_dev(p5, a1);
    			insert_dev(target, t18, anchor);
    			insert_dev(target, br, anchor);

    			if (!mounted) {
    				dispose = listen_dev(a0, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedAirline*/ 1 && t4_value !== (t4_value = /*selectedAirline*/ ctx[0].airline + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*selectedAirline*/ 1 && t9_value !== (t9_value = /*selectedAirline*/ ctx[0].incidents_85_99 + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*selectedAirline*/ 1 && t12_value !== (t12_value = /*selectedAirline*/ ctx[0].fatalities_85_99 + "")) set_data_dev(t12, t12_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(p1);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(p2);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(p3);
    			if (detaching) detach_dev(t13);
    			if (detaching) detach_dev(p4);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(p5);
    			if (detaching) detach_dev(t18);
    			if (detaching) detach_dev(br);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(11:1) {#if selectedAirline}",
    		ctx
    	});

    	return block;
    }

    // (27:2) {#each airlines as airline}
    function create_each_block(ctx) {
    	let li;
    	let a;
    	let t_value = /*airline*/ ctx[3].airline + "";
    	let t;
    	let mounted;
    	let dispose;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[2](/*airline*/ ctx[3]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", "#");
    			add_location(a, file, 28, 7, 1191);
    			add_location(li, file, 28, 3, 1187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t);

    			if (!mounted) {
    				dispose = listen_dev(a, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(27:2) {#each airlines as airline}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let t0;
    	let p0;
    	let t2;
    	let p1;
    	let t3;
    	let a;
    	let t5;

    	function select_block_type(ctx, dirty) {
    		if (/*selectedAirline*/ ctx[0]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if_block.c();
    			t0 = space();
    			p0 = element("p");
    			p0.textContent = "------------------------------------";
    			t2 = space();
    			p1 = element("p");
    			t3 = text("Visit the ");
    			a = element("a");
    			a.textContent = "Svelte tutorial";
    			t5 = text(" to learn how to build Svelte apps.");
    			add_location(p0, file, 32, 1, 1299);
    			attr_dev(a, "href", "https://svelte.dev/tutorial");
    			add_location(a, file, 33, 14, 1357);
    			add_location(p1, file, 33, 1, 1344);
    			attr_dev(main, "class", "svelte-pqc7nk");
    			add_location(main, file, 9, 0, 218);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, p0);
    			append_dev(main, t2);
    			append_dev(main, p1);
    			append_dev(p1, t3);
    			append_dev(p1, a);
    			append_dev(p1, t5);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(main, t0);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let selectedAirline;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(0, selectedAirline = null);
    	const click_handler_1 = airline => $$invalidate(0, selectedAirline = airline);
    	$$self.$capture_state = () => ({ airlines, selectedAirline });

    	$$self.$inject_state = $$props => {
    		if ("selectedAirline" in $$props) $$invalidate(0, selectedAirline = $$props.selectedAirline);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selectedAirline, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
