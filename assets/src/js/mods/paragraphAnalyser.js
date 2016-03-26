define(function(require){
    /** 
    * @module mods/paragraphAnalyser
    * @desc Takes a text input and outputs a list of how many words were used
    *
    * @example ParagraphAnalyser.init($el, opts);
    */  
    'use strict';

    /**
    * @constant
    * @desc template like strings for generating HTML output
    * @private
    * @type {Object}
    */
    var HTML = {
        tabularList :    '<ol class="tabular"></ol>',
        multipeCounter : '<span class="multiple-counter"></span>',
    };

    /**
    * @constant
    * @desc template like strings for generating HTML output
    * @private
    * @type {Object}
    */
    var CSS_CLASSES = {
        listHeading :   'list-header',
        multipleItems : 'has-multiple',
        error :         'error',
        confirmation :  'confirmation',
        hide :          'hidden'
    };

    /**
    * @function
    * @protected
    * @desc Initialises an instance of the module
    * @memberof module:mods/paragraphAnalyser
    *
    * @param {Object} $el - (jQuery object) Continainer element that requires the module
    * @param {Object} opts - Custom options for the module in this instance
    *
    * @returns {Object} - (jQuery object) Container element that requires the module
    */
    var init = function($el, opts){

        // create config object for the current module instance
        var config = getConfig($el, opts);

        // Only setup once per module instance
        if (config.$el.data('paragraphy-analyser-mod-setup')) {
            return;
        } else {
            config.$el.data('paragraphy-analyser-mod-setup',true);
        }

        if(config.$el.length > 0 && config.$input.length > 0 && config.$inputTrigger.length > 0  && config.$outputTable.length > 0 && config.$outputTallyList.length > 0 ) {
            setup(config);
        }
    };

    /**
    * @function
    * @private
    * @desc Combines custom and default settings to creates config object for the current module instance 
    * @memberof module:mods/paragraphAnalyser
    *
    * @param {Object} $el - (jQuery object) Continainer element that requires the module
    * @param {Object} opts - Custom options for the module in this instance
    *
    * @returns {Object} - Final config object for the module in this instance
    */
    var getConfig = function($el, opts){

        // config object for module
        var config = {
            // elements
            $el :               $el,
            $input :            $el.find(opts.inputText),
            $inputTrigger :     $el.find(opts.inputTrigger),
            $outputTable :      $el.find(opts.outputTable),
            $outputTallyList :  $el.find(opts.outputTallyList),
            $errorMessage :     $el.find(opts.errorMessage),
            $waitingMessage :   $el.find(opts.waitingMessage),
        };
        return config;
    };

    /**
    * @function
    * @private
    * @desc Bind triggers 
    * @memberof module:mods/paragraphAnalyser
    *
    * @param {Object} config - Custom options for the module in this instance
    *
    */
    var setup = function(config){

        // Respond to the trigger
        config.$inputTrigger.bind('click',function(e){
            e.preventDefault();

            // Get the input
            var input = config.$input.val();
            var invalid = Input.invalid(input);

            // Display if the input is valid or invalid
            Display.highlight(config, invalid);

            // If invalid - clear display and return
            if(invalid) {
                Display.clear(config);
                return;
            }

            // Show prepare and display valid results
            else {
                Display.results(config, input);
            }
        });
    };

    var Input = {

        /**
        * @function
        * @private
        * @desc Return whether the input is invalid or not 
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {String} input - Raw user input
        *
        * @returns {Boolean} - Whether the raw input is invalid
        *
        */
        invalid : function(input){

            // Invalid if the input contains no words
            var invalid = input.length < 1;

            // Invalid if the input contains numbers
            invalid = invalid || input.search(/[0-9]/g) >= 0;

            // Return the result
            return invalid;
        },

        /**
        * @function
        * @private
        * @desc Build the output object 
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {String} input - Raw user input
        *
        * @returns {Object} - The output data object
        *
        */
        output : function(input){

            // convert input to an array of words
            var words = input.toLowerCase().split(' ');

            // Clean the array and get basic meta data
            var wordsObject = Input.cleanWords(words);

            // Go through the array and build meta data
            return Input.processWords(wordsObject);
        },

        /**
        * @function
        * @private
        * @desc Loop through the words and construct the output data object 
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} wordsObject - The input as an object with meta data
        *
        * @returns {Object} - The output data object
        *
        */
        processWords : function(wordsObject){

            /* jshint maxstatements: 25 */
            /* jshint maxcomplexity: 10 */

            var output = {
                'table' : {
                    cols : [],
                    // e.g.
                    // cols : [ 
                    //    { letter:a, words: [ 
                    //        {word:apple, quantity:1},
                    //        {word:ant, quantity:1},
                    //        {word:ant, quantity:1},
                    //        {word:ant, quantity:1}
                    //    ]}
                    //    { letter:b, words: [ 
                    //        {word:big, quantity:2}
                    //    ]}
                    // ],
                    'maxItems'   : 0
                },
                'tally' : {
                    'words'     : wordsObject.words.length,
                    'commas'    : wordsObject.numCommas,
                    'fullstops' : wordsObject.numFullstops
                }
            };

            // Store the word and first letter
            var thisWord = ''; 
            var letter = '';
            var colFound = false;
            var wordFound = false;

            // loop through each word
            for (var i = 0; i < wordsObject.words.length; i++) {

                // Store the word and first letter
                thisWord = wordsObject.words[i]; 
                letter = thisWord.charAt(0);
                colFound = false;
                wordFound = false;

                // check if first letter has a column in the table output
                for (var j = 0; j < output.table.cols.length; j++) {
                    if(output.table.cols[j].letter === letter) { 

                        // first letter matched in this column, take a note
                        colFound = j;
                        break;
                    }
                }

                if(colFound !== false) { // A column exists matching the words first letter

                    // Check each of the words in this column for a match
                    for (var k = 0; k < output.table.cols[colFound].words.length; k++) {
                        if(output.table.cols[colFound].words[k].word === thisWord) {

                            // the word matches this word, take a note
                            wordFound = k;
                            // break;
                        }
                    }

                    if(wordFound !== false) { // The word is already listed

                        // Increase the quantity of these words
                        output.table.cols[colFound].words[wordFound].quantity++;
                    }

                    else { // The word needs to be added to the column
                        output.table.cols[colFound].words.push( {word:thisWord, quantity:1} );

                        // Increase the value of maxItems if we've got to that point
                        output.table.maxItems = output.table.cols[colFound].words.length > output.table.maxItems ? output.table.cols[colFound].words.length : output.table.maxItems;
                    }
                } else { // A new column needs to be added for this word
                    output.table.cols.push( {letter:letter, words:[{word:thisWord, quantity:1}]} );

                    // Max items increased if appropriate
                    output.table.maxItems = 1 > output.table.maxItems ? 1 : output.table.maxItems;
                }
            }

            return output;
        },

        /**
        * @function
        * @private
        * @desc Loop through the words array, cleaning and making notes 
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Array} words - The input as an array of words
        *
        * @returns {Object} - Results of the cleaning process
        *
        */
        cleanWords : function(words){

            var numCommas = 0;
            var numFullstops = 0;

            // loop through each word
            for (var i = 0; i < words.length; i++) {

                // Remove empty strings
                if (words[i] === '') {
                    words.splice(i,1);
                } else {

                    // Count commas
                    numCommas += (words[i].match(/\,/g)||[]).length;

                    // Count fullstops
                    numFullstops += (words[i].match(/\./g)||[]).length;

                    // Remove commas and full stops
                    words[i] = words[i].replace(/[\.,\,]/g, '');
                }
            }

            words.sort();

            // Prepare the return object
            var wordsObject = {
                words : words,
                numCommas : numCommas,
                numFullstops : numFullstops
            };

            return wordsObject;
        },
    };

    var Display = {

        /**
        * @function
        * @private
        * @desc Highlight the error message
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        * @param {Boolean} invalid - Whether the raw input is invalid
        *
        */
        highlight : function(config, invalid){
            config.$errorMessage.removeClass(invalid ? CSS_CLASSES.confirmation : CSS_CLASSES.error).addClass(invalid ? CSS_CLASSES.error : CSS_CLASSES.confirmation);
        },

        /**
        * @function
        * @private
        * @desc Empty the output elements and show the waiting message
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        *
        */
        clear : function(config){
            config.$outputTable.empty();
            config.$outputTallyList.empty();
            config.$waitingMessage.removeClass(CSS_CLASSES.hide);
        },

        /**
        * @function
        * @private
        * @desc Hide the waiting message and display the results
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        * @param {String} input - Raw user input
        *
        */
        results : function(config, input){
            Display.clear(config);
            config.$waitingMessage.addClass(CSS_CLASSES.hide);
            var output = Input.output(input);
            Display.tally(config, output.tally);
            Display.table(config, output.table);
        },

        /**
        * @function
        * @private
        * @desc Display the tally list
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        * @param {Object} tallyOutput - The output data for the tally display
        *
        */
        tally : function(config, tallyOutput){
            config.$outputTallyList.append('<li>Words: '+tallyOutput.words+'</li>');
            config.$outputTallyList.append('<li>Commas: '+tallyOutput.commas+'</li>');
            config.$outputTallyList.append('<li>Fullstops: '+tallyOutput.fullstops+'</li>');
        },

        /**
        * @function
        * @private
        * @desc Display the output table
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        * @param {Object} tableOutput - The output data for the table display
        *
        */
        table : function(config, tableOutput){

            // Set the number of columns in the table
            config.$outputTable.attr('data-vis-cols',tableOutput.cols.length);

            // Append columns to the table
            for (var i = 0; i < tableOutput.cols.length; i++) {
                config.$outputTable.append( Display.column(config, tableOutput.cols[i], tableOutput.maxItems) );
            }
        },

        /**
        * @function
        * @private
        * @desc Prepare the table columns
        * @memberof module:mods/paragraphAnalyser
        *
        * @param {Object} config - Custom options for the module in this instance
        * @param {Object} columnData - The output data for a single column
        * @param {Integer} maxItems - The number of items to appear in the column
        *
        */
        column : function(config, columnData, maxItems){

            var $column = $(HTML.tabularList);

            // Add column headings
            var $item = $('<li>').addClass(CSS_CLASSES.listHeading).text(columnData.letter.toUpperCase());
            $column.append($item);

            // Add items to a total of maxItems
            for (var i = 0; i < maxItems; i++) {

                $item = $('<li>');

                // Add a word if there is one
                if(columnData.words[i]) {
                    $item.text(columnData.words[i].word);
                    if(columnData.words[i].quantity > 1){
                        var $counter = $((HTML.multipeCounter)).text('('+columnData.words[i].quantity+')');
                        $item.append($counter).addClass(CSS_CLASSES.multipleItems);
                    }   
                }

                $column.append($item);
            }

            return $column;
        }
    };

    // export these methods
    return { init : init };
});