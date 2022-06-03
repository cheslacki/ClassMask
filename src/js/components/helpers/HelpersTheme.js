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

import {HelpersStyle} from './';

/**
 *
 */
class HelpersTheme extends HelpersController {

    /**
     *
     * @param props
     */
    constructor(props) {
        super(props);
        this.props = props;
        jQuery(document).ready(() => {
            Boolean(props.noteFeedback) && this.noteFeedback();
            Boolean(props.mask) && this.mask();
        });
    };

    /**
     *
     * @param config
     */
    setConfigNote = (config) => {
        this.props.configNote = {
            ...this.props.configNote,
            ...config
        };
    };

    /**
     * Note Feedback One init
     */
    noteFeedback = () => {
        const {configNote: {className, style}} = this.props;

        const $elements = jQuery(`.${className}`);

        const execute = (event) => {
            this.stopPropagation(event);

            let
                $this = jQuery(event.target),
                maxlength = $this.attr('maxlength');

            if (!!maxlength) {
                let $note = $this.closest('.note').find('.note-feedback');
                (!!$note && Boolean($note.length)) && $note.html(`${(maxlength - $this.val().length)}/${maxlength}`);
            }
        };

        if (!!$elements && Boolean($elements.length)) {
            let $notes = $elements.find('.note');

            $notes.append('<span class="note-feedback"></span>');

            HelpersStyle.setStyle({
                note: {
                    position: 'relative'
                },
                noteFeedback: style
            });

            HelpersStyle.create('NoteFeedback');

            $notes.map((key, element) => {
                let
                    $element = jQuery(element),
                    maxlength = $element.find('textarea').attr('maxlength');

                if (!!maxlength) {
                    let $note = $element.find('.note-feedback');
                    (!!$note && Boolean($note.length)) && $note.html(`${(maxlength - $note.val().length)}/${maxlength}`);
                }
            });

            $elements.off('keyup.note-feedback', '.note textarea');
            $elements.on('keyup.note-feedback', '.note textarea', execute);

            $elements.off('dragover.note-feedback', '.note textarea');
            $elements.on('dragover.note-feedback', '.note textarea', this.stopPropagation);

            $elements.off('drop.note-feedback', '.note textarea');
            $elements.on('drop.note-feedback', '.note textarea', this.stopPropagation);
        }
    };

    mask = () => {
        const
            mask_number = jQuery('.mask_number'),
            mask_phone = jQuery('.mask_phone'),
            mask_cell = jQuery('.mask_cell'),
            mask_phones = jQuery('.mask_phones'),
            mask_cpf = jQuery('.mask_cpf'),
            mask_cnpj = jQuery('.mask_cnpj'),
            mask_document = jQuery('.mask_document'),
            mask_string_upper = jQuery('.mask_string_upper'),
            mask_complement = jQuery('.mask_complement'),
            mask_zip = jQuery('.mask_zip'),
            mask_money = jQuery('.mask_money'),
            mask_fraction_medium = jQuery('.mask_fraction_medium'),
            mask_fraction_full = jQuery('.mask_fraction_full'),
            mask_date = jQuery('.mask_date'),
            mask_string_capitalize = jQuery('.mask_string_capitalize'),
            mask_name_character = jQuery('.mask_name_character'),
            mask_email = jQuery('.mask_email');

        if (!!mask_number && Boolean(mask_number.length)) {
            mask_number.off('keyup.mask_number');
            mask_number.on('keyup.mask_number', function () {
                jQuery(this).val(jQuery(this).val().classMask('number'));
            });
        }

        if (!!mask_phone && Boolean(mask_phone.length)) {
            mask_phone.off('keyup.mask_phone');
            mask_phone.on('keyup.mask_phone', function () {
                jQuery(this).val(jQuery(this).val().classMask('phone'));
            });
        }

        if (!!mask_cell && Boolean(mask_cell.length)) {
            mask_cell.off('keyup.mask_cell');
            mask_cell.on('keyup.mask_cell', function () {
                jQuery(this).val(jQuery(this).val().classMask('cell'));
            });
        }

        if (!!mask_phones && Boolean(mask_phones.length)) {
            mask_phones.off('keyup.mask_phones');
            mask_phones.on('keyup.mask_phones', function () {
                jQuery(this).val(jQuery(this).val().classMask('phoneAndCell'));
            });
        }

        if (!!mask_cpf && Boolean(mask_cpf.length)) {
            mask_cpf.off('keyup.mask_cpf');
            mask_cpf.on('keyup.mask_cpf', function () {
                jQuery(this).val(jQuery(this).val().classMask('cpf'));
            });
        }

        if (!!mask_cnpj && Boolean(mask_cnpj.length)) {
            mask_cnpj.off('keyup.mask_cnpj');
            mask_cnpj.on('keyup.mask_cnpj', function () {
                jQuery(this).val(jQuery(this).val().classMask('cnpj'));
            });
        }

        if (!!mask_document && Boolean(mask_document.length)) {
            mask_document.off('keyup.mask_document');
            mask_document.on('keyup.mask_document', function () {
                jQuery(this).val(jQuery(this).val().classMask('cpfAndCnpj'));
            });
        }

        if (!!mask_string_upper && Boolean(mask_string_upper.length)) {
            mask_string_upper.off('keyup.mask_string_upper');
            mask_string_upper.on('keyup.mask_string_upper', function () {
                jQuery(this).val(jQuery(this).val().classMask('string').toUpperCase());
            });
        }

        if (!!mask_complement && Boolean(mask_complement.length)) {
            mask_complement.off('keyup.mask_complement');
            mask_complement.on('keyup.mask_complement', function () {
                jQuery(this).val(jQuery(this).val().classMask('complement').toUpperCase());
            });
        }

        if (!!mask_zip && Boolean(mask_zip.length)) {
            mask_zip.off('keyup.mask_zip');
            mask_zip.on('keyup.mask_zip', function () {
                jQuery(this).val(jQuery(this).val().classMask('zip'));
            });
        }

        if (!!mask_money && Boolean(mask_money.length)) {
            mask_money.off('keyup.mask_money');
            mask_money.on('keyup.mask_money', function () {
                jQuery(this).val(jQuery(this).val().classMask('money'));
            });
        }

        if (!!mask_fraction_medium && Boolean(mask_fraction_medium.length)) {
            mask_fraction_medium.off('keyup.mask_fraction_medium');
            mask_fraction_medium.on('keyup.mask_fraction_medium', function () {
                jQuery(this).val(jQuery(this).val().classMask('fractionMedium'));
            });
        }

        if (!!mask_fraction_full && Boolean(mask_fraction_full.length)) {
            mask_fraction_full.off('keyup.mask_fraction_full');
            mask_fraction_full.on('keyup.mask_fraction_full', function () {
                jQuery(this).val(jQuery(this).val().classMask('fractionFull'));
            });
        }

        if (!!mask_date && Boolean(mask_date.length)) {
            mask_date.off('keyup.mask_date');
            mask_date.on('keyup.mask_date', function () {
                jQuery(this).val(jQuery(this).val().classMask('date'));
            });
        }

        if (!!mask_string_capitalize && Boolean(mask_string_capitalize.length)) {
            mask_string_capitalize.off('keyup.mask_string_capitalize');
            mask_string_capitalize.on('keyup.mask_string_capitalize', function () {
                jQuery(this).val(jQuery(this).val().classMask('stringToName'));
            });
        }

        if (!!mask_email && Boolean(mask_email.length)) {
            mask_email.off('keyup.mask_email');
            mask_email.on('keyup.mask_email', function () {
                jQuery(this).val(jQuery(this).val().classMask('email'));
            });
        }
    };
}

const config = {
    default: {
        noteFeedback: false,
        mask: false,
        configNote: {
            className: 'sheet-content',
            style: {
                position: 'absolute',
                bottom: '-22px',
                right: '8px',
                fontWeight: '600',
                color: '#888888'
            }
        }
    }
};

export default (props) => (new HelpersTheme({...config.default, ...props}));