/**
 * Created by Leonardo Cheslacki on 02/06/2022.
 *
 * MIT License
 *
 * Copyright (c) 2022 cheslacki
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

class HelpersController {
    /**
     *
     */
    constructor() {
        this.$timer = [];
        this.$listeners = [];
    }

    /**
     *
     * @param state
     * @param callback
     */
    setState = (state, callback) => {
        this.state = state;
        (typeof(callback) === 'function') && callback(true);
    };

    /**
     *
     * @param field
     * @returns {string}
     */
    getState = (field) => {
        return this.verifyField(this.state, field, false, null);
    };

    /**
     *
     * @param object
     * @param callback
     */
    setStates = (object, callback) => {
        /**
         *
         * @param state
         * @param object
         * @param callback
         */
        const changeState = (state, object, callback) => {
            if (this.isObjectIf(object)) {
                this.defineObject(object);

                let
                    i = 0,
                    changed = false;

                for (let key in object) {
                    ++i;
                    if (object.hasOwnProperty(key)) {
                        if (state.hasOwnProperty(key) && this.isObjectIf(state[key])) {
                            changeState((this.isObject(state[key]) ? state[key] : state), object[key], (value) => {
                                state = {...state, [key]: value};
                                changed = true;
                            });
                        } else if (state.hasOwnProperty(key) && Array.isArray(state[key]) && Array.isArray(object[key])) {
                            state = {...state, [key]: [...state[key], ...object[key]]};
                            changed = true;
                        } else {
                            state = {...state, [key]: object[key]};
                            changed = true;
                        }

                        if (changed && (object.length === i)) {
                            callback(state);
                        }
                    }
                }
            } else {
                callback(!this.isEmpty(object) ? object : null);
            }
        };

        changeState(this.state, object, (state) => {
            this.setState(state, () => {
                (typeof(callback) === 'function') && callback(true);
            });
        });
    };

    /**
     *
     * @returns {{value: null, on, on, forceUpdate: (function(*))}}
     */
    forceUpdate = () => {
        return {
            value: null,
            get on() {
                return this.value;
            },
            set on(value) {
                this.value = value;
            },
            forceUpdate(string){
                this.on = string;
            }
        };
    };

    /**
     *
     * @param alias
     * @param callback
     * @param delay
     */
    throttle = (alias, callback, delay) => {
        this.$timer[alias] && clearTimeout(this.$timer[alias]);
        this.$timer[alias] = setTimeout(() => {
            callback(true);
        }, delay || 3000);
    };

    /**
     *
     * @param alias
     */
    clearThrottle = (alias) => {
        clearTimeout(this.$timer[alias]);
    };

    /**
     *
     * @param data
     * @param field
     * @param prefix
     * @param empty
     * @returns {string}
     */
    verifyField = (data, field, prefix, empty) => {
        let array = field.split('.');
        if (this.isArrayIf(array)) {
            let length = array.length, temp = data;
            for (let i = 0; length > i; i++) {
                if (this.isObjectIf(temp) && temp.hasOwnProperty(array[i])) {
                    temp = !this.isEmpty(temp[array[i]]) ? temp[array[i]] : empty;
                } else {
                    temp = empty;
                }
                if (length === (i + 1)) {
                    return ((prefix && !!temp) ? `${prefix}${temp}` : temp);
                }
            }
        }
    };

    /**
     *
     * @param array
     * @param index
     * @param length
     * @param done
     * @param always
     */
    recursiveSyncMap = (array, index, length, done, always) => {
        done(array[index], () => {
            if (length > ++index) {
                this.recursiveSyncMap(array, index, length, (item, next, stop) => {
                    done(item, next, stop);
                }, () => {
                    always(true);
                })
            } else {
                always(true);
            }
        }, () => {
            always(true);
        });
    };

    /**
     *
     * @param field
     * @param value
     * @param callback
     */
    mountObject = (field, value, callback) => {
        let
            fields = field.split('.').reverse(),
            object = value;

        this.recursiveSyncMap(fields, 0, fields.length, (item, next) => {
            object = {[item]: object};
            next(true);
        }, () => {
            callback(object);
        });
    };

    /**
     *
     * @param string
     * @param separator
     * @returns {string|*}
     */
    toSlug = (string, separator) => {
        const sets = [
            {to: 'A', from: '[??????????????????????????????????????????????????????]'},
            {to: 'a', from: '[????????????????????????????????????????????????????????]'},
            {to: 'AE', from: '[??]'},
            {to: 'ae', from: '[??]'},
            {to: 'C', from: '[????????]'},
            {to: 'c', from: '[????????]'},
            {to: 'D', from: '[????????]'},
            {to: 'd', from: '[????????]'},
            {to: 'E', from: '[??????????????????????????????????????????]'},
            {to: 'e', from: '[??????????????????????????????????????????]'},
            {to: 'G', from: '[????????]'},
            {to: 'g', from: '[????????]'},
            {to: 'H', from: '[?????]'},
            {to: 'h', from: '[?????]'},
            {to: 'I', from: '[??????????????????????]'},
            {to: 'i', from: '[??????????????i????????]'},
            {to: 'J', from: '[??]'},
            {to: 'j', from: '[??]'},
            {to: 'IJ', from: '[??]'},
            {to: 'ij', from: '[??]'},
            {to: 'K', from: '[??]'},
            {to: 'k', from: '[??]'},
            {to: 'L', from: '[????????]'},
            {to: 'l', from: '[????????]'},
            {to: 'M', from: '[???]'},
            {to: 'm', from: '[???]'},
            {to: 'N', from: '[????????]'},
            {to: 'n', from: '[????????]'},
            {to: 'O', from: '[????????????????????????????????????????????????????????????]'},
            {to: 'o', from: '[??????????????????????????????????????????????????????????????]'},
            {to: 'OE', from: '[??]'},
            {to: 'oe', from: '[??]'},
            {to: 'P', from: '[???]'},
            {to: 'p', from: '[???]'},
            {to: 'R', from: '[??????]'},
            {to: 'r', from: '[??????]'},
            {to: 'S', from: '[????????]'},
            {to: 's', from: '[????????]'},
            {to: 'SS', from: '[???]'},
            {to: 'ss', from: '[??]'},
            {to: 'T', from: '[????]'},
            {to: 't', from: '[????]'},
            {to: 'U', from: '[???????????????????????????????????????????]'},
            {to: 'u', from: '[???????????????????????????????????????????]'},
            {to: 'W', from: '[???????????]'},
            {to: 'w', from: '[???????????]'},
            {to: 'X', from: '[???]'},
            {to: 'x', from: '[???]'},
            {to: 'Y', from: '[??????????????????]'},
            {to: 'y', from: '[??????????????????]'},
            {to: 'Z', from: '[??????]'},
            {to: 'z', from: '[??????]'},
            {to: '-and-', from: '[&]'},
            {to: '-', from: '[_]'}
        ];

        string = string.toString().trim();

        sets.forEach((set) => {
            string = string.replace(new RegExp(set.from, 'g'), set.to);
        });

        string = string.split(/(?=[A-Z])/).join('-').toLowerCase();

        string = string.replace(/\s+/g, '-')  /* Replace spaces with - */
            .replace(/[^\w-]/g, '')           /* Remove all non-word chars */
            .replace(/-+/g, '-')              /* Replace multiple - with single - */
            .replace(/^-+/, '')               /* Trim - from start of text */
            .replace(/-+$/, '');
        /* Trim - from end of text */

        if ((typeof(separator) !== 'undefined') && (separator !== '-')) {
            string = string.replace(/-/g, separator);
        }

        return string;
    };

    /**
     *
     * @param event
     * @returns {boolean}
     */
    stopPropagation = (event) => {
        event.stopPropagation();
        event.preventDefault();
        // event.cancelBubble = true;
        // event.returnValue = false;
        return false;
    };

    /**
     *
     * @param string
     * @returns {boolean|String}
     */
    removeSpaceDuplicate = (string) => {
        return Boolean(string) && string.replace(/\s+/g, ' ');
    };

    /**
     *
     * @param name
     * @returns {boolean}
     */
    removeArrayInput = (name) => {
        return Boolean(name) && name.replace(/\[]$/, '');
    };

    /**
     *
     * @param name
     * @returns {boolean}
     */
    checkArrayInput = (name) => {
        return (/\[]$/).test(name);
    };

    /**
     *
     * @param element
     * @param type
     * @param reference
     * @param listener
     */
    addListener = (element, type, reference, listener) => {
        const setListener = () => {
            if (this.isElement(element)) {
                element.removeEventListener(type, listener);
                element.addEventListener(type, listener);
                this.$listeners = [...this.$listeners, ...[{
                    reference: reference,
                    listener: element
                }]];
            }
        };

        if (this.isArrayIf(this.$listeners)) {
            let array = this.$listeners.filter((value) => {
                return value.reference === reference;
            });
            !Boolean(array.length) && setListener();
        } else {
            setListener();
        }
    };

    /**
     *
     * @param type
     * @param object
     */
    emit = (type, object) => {
        //noinspection JSCheckFunctionSignatures
        document.dispatchEvent(new CustomEvent(type, {detail: object}));
    };

    /**
     *
     * @param type
     * @param callback
     */
    on = (type, callback) => {
        document.addEventListener(type, (event) => {
            callback(event.detail);
        })
    };

    /**
     *
     * @param array
     * @returns {boolean}
     */
    isArrayIf = (array) => {
        return (!!array && Array.isArray(array) && Boolean(array.length));
    };

    /**
     *
     * @param array
     * @param value
     * @returns {boolean}
     */
    inArray = (array, value) => {
        return (this.isArrayIf(array) && array.indexOf(value) > -1);
    };

    /**
     *
     * @param value
     * @returns {boolean}
     */
    isEmpty = (value) => {
        return !(!!value && (typeof(value) !== 'undefined') && (value !== null));
    };

    /**
     *
     * @param object|array-like
     * @returns {boolean}
     */
    isObjectIf = (object) => {
        return (!!object && ((typeof(object) === 'object') && (object !== null) && ((typeof(object.length) !== 'undefined' && Boolean(object.length)) || Boolean(Object.keys(object).length))));
    };

    /**
     *
     * @param object|array-like
     * @returns {boolean}
     */
    isObject = (object) => {
        return (!!object && (typeof(object) === 'object') && (object !== null));
    };

    /**
     *
     * @param object
     * @param method
     * @returns {boolean}
     */
    isFunction = (object, method) => {
        return (!!object && (typeof(object[method]) === 'function'));
    };

    /**
     *
     * @param element
     * @returns {boolean}
     */
    isElement = (element) => {
        return (!!element && (typeof(element.nodeType) !== 'undefined') && (element.nodeType === Node.ELEMENT_NODE));
    };

    /**
     *
     * @param object
     */
    defineObject = (object) => {
        (this.isObjectIf(object) && !object.hasOwnProperty('length')) && Object.defineProperty(object, 'length', {
            get: () => {
                return Object.keys(object).length;
            }
        });
    };

    /**
     *
     * @param element
     * @returns {*}
     */
    elementToArray = (element) => {
        let array = this.isObjectIf(element) && Array.prototype.slice.call(element);
        return Array.isArray(array) ? array : [];
    };
}

export default HelpersController;