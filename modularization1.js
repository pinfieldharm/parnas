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

var Alphabetizing = (function(Core) {

    var Alphabetizing = {};

    function nextPos(pos) {

        if (pos[1] < 3) {
            return [pos[0], pos[1]+1];
        } else {
            return [pos[0] + 1, 0];
        }

    }

    function comparePositions(pos1, pos2) {
        var c1 = Core.inputData[pos1[0]][pos1[1]].toLowerCase();
        var c2 = Core.inputData[pos2[0]][pos2[1]].toLowerCase();

        if (c1 < c2) return -1;
        if (c1 > c2) return 1;
        if (c1 == '\t') return 0;

        return comparePositions(nextPos(pos1), nextPos(pos2));

    }

    function compareShifts(shift1, shift2) {
        return comparePositions(shift1[0], shift2[0]);
    }

    Alphabetizing.alphabetize = function() {
        Core.alphabetizedShifts = Core.shifts.slice(0);
        Core.alphabetizedShifts.sort(compareShifts);
    };

    return Alphabetizing;

})(Core);

var Output = (function(Core) {

    var Output = {};


    // Copied from CircularShift!!!! Trying to keep module boundaries
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

    // Copied from CircularShift!!!! Trying to keep module boundaries
    function isBefore(pos, lineEnd) {
        if (pos[0] < lineEnd[0]) return true;
        if (pos[0] == lineEnd[0] && pos[1] <= lineEnd[1]) return true;
        return false;
    }

    // Copied from Alphabetizing!!! Trying to keep module boundaries (and found a bug in it!)
    function nextPos(pos) {

        if (pos[1] < 3) {
            return [pos[0], pos[1]+1];
        } else {
            return [pos[0] + 1, 0];
        }

    }

    function posEqual(pos1, pos2) {
        return pos1[0] == pos2[0] && pos1[1] == pos2[1];
    }

    function printShift(shift) {
        var shiftStart = shift[0];
        var lineIndex = shift[1];
        var lineStart = Core.lineStarts[lineIndex];
        var lineEnd = nextLineEnd(lineIndex, lineStart);

        var output = document.getElementById('output');

        var row = document.createElement('div');
        row.className = 'row';
        output.appendChild(row);


        var s = "<div class='left'>";
        var inTerm = false;
        for (var pos = lineStart; isBefore(pos, lineEnd); pos = nextPos(pos)) {
            if (posEqual(shiftStart, pos)) {
                inTerm = true;
                s += '</div><div class="right"><div class="inside-right"><div class="inside-right-row"><div class="term">'
            }
            var c = Core.inputData[pos[0]][pos[1]];

            if (c == '\t') {
                if (inTerm) {
                    inTerm = false;
                    s += '</div><div class="remainder">';
                } else {
                    s += ' ';
                }
            } else {
                s += c;
            }
        }
        s += "</div></div></div>";
        row.innerHTML = s;
    }

    Output.printShifts = function() {
        for (var i = 0; i < Core.alphabetizedShifts.length; i++) {
            var shift = Core.alphabetizedShifts[i];
            printShift(shift);
        }
    };

    return Output;
})(Core);

var MasterControl = (function (Input, Core) {

    var MasterControl = {};

    MasterControl.run = function () {
        Input.readLines();
        CircularShift.prepareShifts();
        Alphabetizing.alphabetize();
        Output.printShifts();
    };

    return MasterControl;
})(Input, Core);



