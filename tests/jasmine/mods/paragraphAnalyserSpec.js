// test mods/paragraphAnalyser.js
define(function(require){
    'use strict';

    /********************
        SETUP
    ********************/

    // get test dependencies
    var ParagraphAnalyser = require('mods/paragraphAnalyser');

    /********************
        TEST
    ********************/

    describe('mods/paragraphAnalyser:', function(){
        var ELS = {
            $el: {},
            $input: {},
            $trigger: {},
            $table: {},
            $tally: {},
            $error: {}
        };
        var INPUTS = {
            valid : 'The quick brown fox jumps over the lazy dog, before the duffle bag became his toy, now he’s happy.',
            invalid : 'The quick brown fox 1234.'
        };
        var opts = {
            inputText:        '#user-input',
            inputTrigger:     '#input-trigger',
            outputTable:      '#output-table',
            outputTallyList:  '#output-tally',
            errorMessage:     '#error-message',
        };

        beforeEach(function(){

            // Set up elements
            ELS.$el = $('.main').html('<div class="mod" data-mods="paragraphAnalyser"></div>').find('.mod');
            ELS.$el.append('<textarea id="user-input"></textarea>');
            ELS.$el.append('<button id="input-trigger"></button>');
            ELS.$el.append('<div id="output-table"></div>');
            ELS.$el.append('<ul id="output-tally"></ul>');
            ELS.$el.append('<p id="error-message"></p>');

            // Store elements
            ELS = {
                $el : ELS.$el,
                $input: ELS.$el.find(opts.inputText),
                $trigger: ELS.$el.find(opts.inputTrigger),
                $table: ELS.$el.find(opts.outputTable),
                $tally: ELS.$el.find(opts.outputTallyList),
                $error: ELS.$el.find(opts.errorMessage)
            };

            // Timing
            // jasmine.clock().install();
        });

        afterEach(function(){

            // Clear down elements
            $('.main').empty();
            ELS.$el.off();
            ELS = {
                $el: {},
                $input: {},
                $trigger: {},
                $table: {},
                $tally: {},
                $error: {}
            };

            // Timing
            // jasmine.clock().uninstall();
        });

        describe('core behaviour:', function(){
            it('has an init method', function(){
                expect(typeof ParagraphAnalyser.init).toEqual('function');
            });
            xit('displays error if invalid text is added', function(){
                // No error by default
                expect(ELS.$error.hasClass('error')).toEqual(false);

                // No error after running module and clicking the trigger
                ParagraphAnalyser.init(ELS.$el,opts);
                ELS.$trigger.click();
                expect(ELS.$error.hasClass('error')).toEqual(false);

                // No error after adding valid text and clicking the trigger
                ELS.$input.value = INPUTS.valid;
                ELS.$trigger.click();
                expect(ELS.$error.hasClass('error')).toEqual(false);

                // Error after adding valid text and clicking the trigger
                ELS.$input.value = INPUTS.invalid;
                ELS.$trigger.click();
                expect(ELS.$el.find(opts.errorMessage).hasClass('error')).toEqual(true);
            });
        });
    });
});