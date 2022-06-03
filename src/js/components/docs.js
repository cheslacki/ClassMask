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

const jQuery = window.$ = window.jQuery = require('jquery');

require('bootstrap');

const CodeMirror = require('codemirror');

require('codemirror/addon/selection/selection-pointer');
require('codemirror/mode/vbscript/vbscript');
require('codemirror/mode/htmlmixed/htmlmixed');

const options = {
    mode: {
        name: "htmlmixed",
        scriptTypes: [
            {
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null
            },
            {
                matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript"
            }
        ]
    },
    lineNumbers: true,
    readOnly: true,
    selectionPointer: true
};

//noinspection JSUnresolvedFunction
jQuery(document).ready(() => {
    jQuery.get('./docs/jquery.html', (data) => {
        //noinspection JSUnresolvedFunction
        CodeMirror(document.getElementById('doc_jquery'), options).setValue(data);
    });
    jQuery.get('./docs/app.html', (data) => {
        //noinspection JSUnresolvedFunction
        CodeMirror(document.getElementById('doc_app'), options).setValue(data);
    });
    jQuery.get('./docs/event.html', (data) => {
        //noinspection JSUnresolvedFunction
        CodeMirror(document.getElementById('doc_event'), options).setValue(data);
    });
    jQuery.get('./docs/note.html', (data) => {
        //noinspection JSUnresolvedFunction
        CodeMirror(document.getElementById('doc_note'), options).setValue(data);
    });
});
