var Core = {};

var Input = (function (Core) {
    var Input = {};

    Input.readLines = function () {
        var inputElement = document.getElementById("input");
        var content = inputElement.innerHTML;

        Core.inputData = [];
        Core.lineStarts = [];


        var pos = 0;
        var endOfWord = '\t';


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

var CircularShift = (function (Core){

    var CircularShift = {};

    Core.shifts = [];

    function nextLineEnd(lineIndex, lineStart) {
        var nextLineStart = Core.lineStarts[lineIndex+1];

        if (nextLineStart) {
            if (nextLineStart[1] == 0) {
                return [nextLineStart[0] - 1, 3];
            } else {
                return [nextLineStart[0], nextLineStart[1] - 1]
            }
        } else {
            return [Core.inputData.length - 1, Core.inputData[Core.inputData.length - 1].length - 1]
        }

    }

    function isBefore(pos, lineEnd) {
        if (pos[0] < lineEnd[0]) return true;
        if (pos[0] == lineEnd[0] && pos[1] <= lineEnd[1]) return true;
        return false;
    }

    CircularShift.prepareShifts = function() {

        Core.shifts = [];

        for (var lineIndex = 0; lineIndex < Core.lineStarts.length; lineIndex++) {
            var lineStart = Core.lineStarts[lineIndex];
            var lineEnd = nextLineEnd(lineIndex, lineStart);

            console.log("Start: " + lineStart);
            console.log("End: " + lineEnd);

            var pos = [lineStart[0], lineStart[1]];
            var s = "";
            var nextCharIsStart = true;
            while (isBefore(pos, lineEnd)) {
                var c = Core.inputData[pos[0]][pos[1]];


                if (c == '\t') {
                    nextCharIsStart = true;
                } else {
                    if (nextCharIsStart) {
                        Core.shifts.push([[pos[0], pos[1]], lineIndex]);
                    }
                    nextCharIsStart = false;
                }
                pos[1] += 1;
                if (pos[1] == 4) {
                    pos[0] += 1;
                    pos[1] = 0;
                }
            }
        }
    };

    return CircularShift;
})(Core);

var MasterControl = (function (Input, Core) {

    var MasterControl = {};

    MasterControl.run = function () {
        Input.readLines();
        CircularShift.prepareShifts();
        console.log(Core.shifts);
    };

    return MasterControl;
})(Input, Core);



