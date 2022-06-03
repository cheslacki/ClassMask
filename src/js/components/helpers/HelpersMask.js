/**!
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

(function () {
    let _this = {};

    function HelpersMask() {
        this.props = {isRegex: /^number|string|removeSpace|removeSpaceDuplicate|stringToUpper|stringToName|email|date|phone|cell|phoneAndCell|cpf|cnpj|cpfAndCnpj|zip|money|fractionMedium|fractionFull$/};

        _this.mask = this;

        Object.defineProperty(String.prototype, 'classMask', {
            value: function (mask) {
                if (_this.mask.props.isRegex.test(mask)) {
                    return _this.mask[mask](this);
                } else {
                    console.log(`Not exists ${mask}.`);
                    return this;
                }
            }
        });
    }

    HelpersMask.prototype = {
        constructor: HelpersMask,

        /**
         *
         * @param string
         * @returns {string}
         */
        number: function (string) {
            return string.toString().replace(/\D/g, '');
        },

        /**
         *
         * @param string
         * @returns {void|XML|*}
         */
        string: function (string) {
            return string.toString().replace(/[^a-zA-Z]/g, '');
        },

        /**
         *
         * @param string
         * @returns {void|XML|*}
         */
        removeSpace: function (string) {
            return string.replace(/\s+/g, '');
        },

        /**
         *
         * @param string
         * @returns {void|XML|*}
         */
        removeSpaceDuplicate: function (string) {
            return string.replace(/\s+/g, ' ');
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        stringToUpper: function (string) {
            return this.string(string).toUpperCase();
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        capitalize: function (string) {
            //noinspection JSValidateTypes
            let array = string.split(' ');
            for (let i = 0; i < array.length; i++) {
                array[i] = ((array[i].length > 2) ? `${array[i].charAt(0).toUpperCase()}${array[i].slice(1).toLowerCase()}` : array[i].toLowerCase());
            }
            return array.join(' ');
        },

        /**
         *
         * @param string
         * @returns {void|XML|*}
         */
        stringToName: function (string) {
            string = string.toString()
                .replace(/[^a-zA-Zá-üÁ-Ü\s]/g, '')
                .replace(/^\s+/g, '');

            return this.capitalize(this.removeSpaceDuplicate(string));
        },

        /**
         *
         * @param string
         * @returns {XML|void}
         */
        zero: function (string) {
            return string.replace(/^0+/g, '');
        },

        /**
         *
         * @param string
         * @returns {string}
         * Basic https://en.wikipedia.org/wiki/Email_address
         */
        email: function (string) {
            return string.toString()
                .replace(/[^a-zA-Z0-9.@!#$%&'*+-\/=?^_`{|}~]/gi, '')
                .replace(/(@)(.*?)(\1)/g, '$1$2')
                .replace(/(\.)\1+/g, '.')
                .replace(/^\.+/g, '')
                .replace(/^@+/g, '').toLowerCase();
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        date: function (string) {
            return this.number(string)
                .substring(0, 8)
                .replace(/(\d{2})(\d)/, '$1/$2')
                .replace(/(\d{2})(\d)/, '$1/$2');
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        phone: function (string) {
            return this.zero(this.number(string))
                .substring(0, 10)
                .replace(/(\d{0})(\d)/, '$1($2')
                .replace(/(\d{2})(\d)/, '$1)$2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        cell: function (string) {
            return this.zero(this.number(string))
                .substring(0, 11)
                .replace(/(\d{0})(\d)/, '$1($2')
                .replace(/(\d{2})(\d)/, '$1)$2')
                .replace(/(\d{5})(\d)/, '$1-$2');
        },

        /**
         *
         * @param string
         * @returns {*|string}
         */
        phoneAndCell: function (string) {
            if (this.zero(this.number(string)).length < 11) {
                return this.phone(string);
            } else {
                return this.cell(string);
            }
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        cpf: function (string) {
            return this.number(string)
                .substring(0, 11)
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        cnpj: function (string) {
            return this.number(string)
                .substring(0, 14)
                .replace(/^(\d{2})(\d)/, '$1.$2')
                .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                .replace(/\.(\d{3})(\d)/, '.$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2');
        },

        /**
         *
         * @param string
         * @returns {*|string}
         */
        cpfAndCnpj: function (string) {
            if (this.number(string).length < 12) {
                return this.cpf(string);
            } else {
                return this.cnpj(string);
            }
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        zip: function (string) {
            if (this.number(string).length < 8) {
                return this.number(string)
                    .substring(0, 7)
                    .replace(/(\d{4})(\d)/, '$1-$2');
            } else {
                return this.number(string)
                    .substring(0, 8)
                    .replace(/(\d{5})(\d)/, '$1-$2');
            }
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        money: function (string) {
            return this.zero(this.number(string))
                .substring(0, 10)
                .replace(/^(\d)$/, '0,0$1')
                .replace(/^(\d{2})$/, '0,$1')
                .replace(/^(\d{1,3})(\d{2})$/, '$1,$2')
                .replace(/^(\d{1,3})(\d{3})(\d{2})$/, '$1.$2,$3')
                .replace(/^(\d{1,2})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3,$4');
        },
        /**
         *
         * @param string
         * @returns {string}
         */
        fractionMedium: function (string) {
            return this.zero(this.number(string))
                .substring(0, 15)
                .replace(/^(\d)$/, '0,0000$1')
                .replace(/^(\d{2})$/, '0,000$1')
                .replace(/^(\d{3})$/, '0,00$1')
                .replace(/^(\d{4})$/, '0,0$1')
                .replace(/^(\d{5})$/, '0,$1')
                .replace(/^(\d{1,3})(\d{5})$/, '$1,$2')
                .replace(/^(\d{1,3})(\d{3})(\d{5})$/, '$1.$2,$3')
                .replace(/^(\d{1,2})(\d{3})(\d{3})(\d{5})$/, '$1.$2.$3,$4');
        },

        /**
         *
         * @param string
         * @returns {string}
         */
        fractionFull: function (string) {
            return this.zero(this.number(string))
                .substring(0, 20)
                .replace(/^(\d)$/, '0,000000000$1')
                .replace(/^(\d{2})$/, '0,00000000$1')
                .replace(/^(\d{3})$/, '0,0000000$1')
                .replace(/^(\d{4})$/, '0,000000$1')
                .replace(/^(\d{5})$/, '0,00000$1')
                .replace(/^(\d{6})$/, '0,0000$1')
                .replace(/^(\d{7})$/, '0,000$1')
                .replace(/^(\d{8})$/, '0,00$1')
                .replace(/^(\d{9})$/, '0,0$1')
                .replace(/^(\d{10})$/, '0,$1')
                .replace(/^(\d{1,3})(\d{10})$/, '$1,$2')
                .replace(/^(\d{1,3})(\d{3})(\d{10})$/, '$1.$2,$3')
                .replace(/^(\d{1,2})(\d{3})(\d{3})(\d{10})$/, '$1.$2.$3,$4');
        }
    };

    return (new HelpersMask());
})();
