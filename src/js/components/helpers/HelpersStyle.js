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

import HelpersController from './HelpersController';

/**
 *
 */
class HelpersStyle extends HelpersController {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            text: ''
        };
    };

    /**
     *
     * @param object
     */
    setStyle = (object) => {
        let styles = '';
        for (let prefix in object) {
            if(object.hasOwnProperty(prefix)){
                let fields = this.verifyField(object, prefix, false, false);
                if (!!fields) {
                    styles += `.${this.toSlug(prefix)}{`;
                    for (let field in fields) {
                        if(fields.hasOwnProperty(field)){
                            let value = this.verifyField(object, `${prefix}.${field}`, false, false);
                            value && (styles += `${this.toSlug(field)}:${value};`);
                        }
                    }
                    styles += '}';
                }
            }

        }
        this.state.text = styles;
    };

    /**
     *
     * @param name
     */
    create = (name) => {
        if (!!name) {
            this.remove(name);
            let
                style = document.createElement('STYLE'),
                attributeDataMeta = document.createAttribute('data-meta');

            attributeDataMeta.value = this.toSlug(name);
            style.setAttributeNode(attributeDataMeta);
            style.type = 'text/css';
            style.appendChild(document.createTextNode(this.state.text));
            window.document.head.appendChild(style);
        }
    };

    /**
     *
     * @param name
     */
    remove = (name) => {
        this.find(name, (ownerNode) => {
            window.document.head.removeChild(ownerNode);
        });
    };

    /**
     *
     * @param name
     * @param callback
     */
    find = (name, callback) => {
        if (!!name) {
            name = this.toSlug(name);
            Array.from(document.styleSheets).forEach((styleSheet) => {
                let ownerNode = styleSheet.ownerNode;
                if (ownerNode.localName === 'style' && styleSheet.cssRules) {
                    let dataMeta = ownerNode.attributes.getNamedItem('data-meta');
                    return (!!dataMeta && (dataMeta.value === name)) && callback(ownerNode);
                }
            });
        }
    }
}

export default (new HelpersStyle());