var Core = {};

var Input = (function (Core) {
    var Input = {};

    Input.readLines = function () {
        var inputElement = document.getElementById("input");
        var content = inputElement.innerHTML;

        Core.inputData = [];
        Core.lineStarts = [];


        var pos = 0;
        var endOfWord = '†';


        function isWordCharacter(c) {
            return c.match(/[A-Za-z\-\']/gi);
        }

        var nextIsStart = true;
        while (pos < content.length) {
            var storage_word = [];
            while (storage_word.length < 4 && pos < content.length) {
                var nextChar = content.charAt(pos);

                if (isWordCharacter(nextChar)) {
                    storage_word.push(nextChar);
                    if (nextIsStart) {
                        console.log(nextChar);
                        nextIsStart = false;
                        Core.lineStarts.push([Core.inputData.length, storage_word.length - 1]);
                    }
                    pos++;
                } else {
                    if (nextChar == '\n') {
                        nextIsStart = true;
                    }
                    pos++;
                    // Eat whitespace and other characters.
                    while (pos < content.length && !isWordCharacter(content.charAt(pos))) {
                        if (content.charAt(pos) == '\n') {
                            nextIsStart = true;
                        }
                        pos++;
                    }
                    storage_word.push(endOfWord);
                }
            }
            Core.inputData.push(storage_word);
        }
    };

    return Input;
})(Core);

var MasterControl = (function (Input, Core) {

    var MasterControl = {};

    MasterControl.run = function () {
        Input.readLines();
        console.log(Core.inputData);
        console.log(Core.lineStarts);
    };

    return MasterControl;
})(Input, Core);



