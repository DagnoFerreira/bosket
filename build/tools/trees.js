function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { array } from "./arrays";

// crashes gen-flow-files : type treeMap<T> = Map<T, treeMap<T>>


export var tree = function tree(t, prop) {
    return {
        /**
         * Flattens the tree into a single array.
         * @return {[type]} A flattened array containing all the tree elements
         */
        flatten: function flatten() {
            var flattened = [];
            var fifo = [t];
            while (fifo.length > 0) {
                var _tree = fifo.pop();
                if (!(_tree instanceof Array)) continue;
                flattened = [].concat(_toConsumableArray(array(flattened).notIn(_tree)), _toConsumableArray(_tree));
                fifo = [].concat(_toConsumableArray(fifo), _toConsumableArray(_tree.filter(function (item) {
                    return item[prop];
                }).map(function (item) {
                    return item[prop];
                })));
            }

            return flattened;
        },
        /**
         * Filters the tree.
         * @param  {[type]} filterFun Filtering function
         * @return {[type]}           Clone of the original tree without the filtered elements
         */
        filter: function filter(filterFun) {
            var copy = t.filter(filterFun);
            var recurse = function recurse(list) {
                list.forEach(function (item) {
                    if (item[prop] && item[prop] instanceof Array) {
                        item[prop] = item[prop].filter(filterFun);
                        recurse(item[prop]);
                    }
                });
            };
            recurse(copy);
            return copy;
        },
        /**
         * Filters the tree and returns a Map representing the filtered tree.
         * @param  {[type]} filterFun Filtering function
         * @return {[type]}           A Map representation of the filtered tree
         */
        filterMap: function filterMap(filterFun) {
            var finalMap = new Map();

            var recurse = function recurse(list, map) {
                list.forEach(function (item) {
                    if (item[prop] && item[prop] instanceof Array) {
                        var childMap = new Map();
                        recurse(item[prop], childMap);
                        if (childMap.size > 0) {
                            map.set(item, childMap);
                        } else if (filterFun(item)) {
                            map.set(item, new Map());
                        }
                    } else if (filterFun(item)) {
                        map.set(item, null);
                    }
                });
            };
            recurse(t, finalMap);
            return finalMap;
        },
        /**
         * Perform an action on a tree element, then update its ancestors references.
         * @param  {[type]}   elt         Element on which to perform the action (or matching function)
         * @param  {Function} cb          An action callback
         * @param  {[type]}   [path=null] Ancestors path
         * @return {[type]}               An updated tree clone
         */
        perform: function perform(elt, cb) {
            var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (!path) path = tree(t, prop).path(elt);
            if (path instanceof Array) {
                path.reverse().forEach(function (p, idx) {
                    if (idx === 0) cb(p);else p[prop] = [].concat(_toConsumableArray(p[prop]));
                });
                return [].concat(_toConsumableArray(t));
            } else {
                return t;
            }
        },
        /**
         * Adds an element and update its ancestors references.
         * @param {[type]} parent      Where to add
         * @param {[type]} elt         What to add (or matching function)
         * @param {[type]} [path=null] Ancestors path
         * @return {[type]}            An updated tree clone
         */
        add: function add(parent, elt) {
            var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            return tree(t, prop).perform(parent, function (p) {
                return p[prop] = [].concat(_toConsumableArray(p[prop]), [elt]);
            }, path);
        },
        /**
         * Removes an element and update its ancestors references.
         * @param  {[type]} parent      Where to remove
         * @param  {[type]} elt         What to remove (or matching function)
         * @param  {[type]} [path=null] Ancestors path
         * @return {[type]}             An updated tree clone
         */
        remove: function remove(parent, elt) {
            var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
            return tree(t, prop).perform(parent, function (p) {
                p[prop] = p[prop].filter(function (_) {
                    if (typeof elt === "function") return !elt(_);
                    return _ !== elt;
                });
            }, path);
        },
        /**
         * Retrieves all ancestors of an element (or returns false).
         * @param  {[type]} elt Element to search for (or matching function)
         * @return {[type]}     Ancestors path
         */
        path: function path(elt) {
            var recurse = function recurse(item) {
                if (item === elt || typeof elt === "function" && elt(item)) return [item];
                if (!item[prop]) return false;
                for (var i = 0; i < item[prop].length; i++) {
                    var check = recurse(item[prop][i]);
                    if (check) return [item].concat(_toConsumableArray(check));
                }
                return false;
            };
            for (var i = 0; i < t.length; i++) {
                var check = recurse(t[i]);
                if (check) return check;
            }
            return false;
        },
        /**
         * Visits each node of the tree and performs an action.
         * @param  {[type]} visitor Action to perform.
         */
        visit: function visit(visitor) {
            var fifo = [t];
            while (fifo.length > 0) {
                var _tree2 = fifo.pop();
                visitor(_tree2);
                _tree2.forEach(function (child) {
                    return child[prop] && child[prop] instanceof Array ? fifo.push(child[prop]) : null;
                });
            }
        }
    };
};
//# sourceMappingURL=trees.js.map