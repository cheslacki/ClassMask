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
            {to: 'A', from: '[ÀÁÂÃÄÅĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]'},
            {to: 'a', from: '[àáâãäåāăąạảấầẩẫậắằẳẵặª]'},
            {to: 'AE', from: '[Æ]'},
            {to: 'ae', from: '[æ]'},
            {to: 'C', from: '[ÇĆĈČ]'},
            {to: 'c', from: '[çćĉč]'},
            {to: 'D', from: '[ÐĎĐÞ]'},
            {to: 'd', from: '[ðďđþ]'},
            {to: 'E', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]'},
            {to: 'e', from: '[èéêëēĕėęěẹẻẽếềểễệ]'},
            {to: 'G', from: '[ĜĞĢǴ]'},
            {to: 'g', from: '[ĝğģǵ]'},
            {to: 'H', from: '[ĤḦ]'},
            {to: 'h', from: '[ĥḧ]'},
            {to: 'I', from: '[ÌÍÎÏĨĪĮİỈỊ]'},
            {to: 'i', from: '[ìíîïĩīįi̇ỉị]'},
            {to: 'J', from: '[Ĵ]'},
            {to: 'j', from: '[ĵ]'},
            {to: 'IJ', from: '[Ĳ]'},
            {to: 'ij', from: '[ĳ]'},
            {to: 'K', from: '[Ķ]'},
            {to: 'k', from: '[ķ]'},
            {to: 'L', from: '[ĹĻĽŁ]'},
            {to: 'l', from: '[ĺļľł]'},
            {to: 'M', from: '[Ḿ]'},
            {to: 'm', from: '[ḿ]'},
            {to: 'N', from: '[ÑŃŅŇ]'},
            {to: 'n', from: '[ñńņň]'},
            {to: 'O', from: '[ÒÓÔÕÖØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]'},
            {to: 'o', from: '[òóôõöøōŏőọỏốồổỗộớờởỡợǫǭơº]'},
            {to: 'OE', from: '[Œ]'},
            {to: 'oe', from: '[œ]'},
            {to: 'P', from: '[Ṕ]'},
            {to: 'p', from: '[ṕ]'},
            {to: 'R', from: '[ŔŖŘ]'},
            {to: 'r', from: '[ŕŗř]'},
            {to: 'S', from: '[ŚŜŞŠ]'},
            {to: 's', from: '[śŝşš]'},
            {to: 'SS', from: '[ẞ]'},
            {to: 'ss', from: '[ß]'},
            {to: 'T', from: '[ŢŤ]'},
            {to: 't', from: '[ţť]'},
            {to: 'U', from: '[ÙÚÛÜŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]'},
            {to: 'u', from: '[ùúûüũūŭůűųụủứừửữựư]'},
            {to: 'W', from: '[ẂŴẀẄ]'},
            {to: 'w', from: '[ẃŵẁẅ]'},
            {to: 'X', from: '[Ẍ]'},
            {to: 'x', from: '[ẍ]'},
            {to: 'Y', from: '[ÝŶŸỲỴỶỸ]'},
            {to: 'y', from: '[ýŷÿỳỵỷỹ]'},
            {to: 'Z', from: '[ŹŻŽ]'},
            {to: 'z', from: '[źżž]'},
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