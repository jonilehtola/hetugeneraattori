const language = {
    fi: {
        page_title: "HetuGeneraattori",
        generate_button: "Luo Hetu",
        copy_link: "kopioi luotu hetu",
        error_input: "Syöte ei kelpaa, käytä ainoastaan",
        error_inputcent: "Vuosisatamerkki ei kelpaa. Ainoastaan +, - ja A käytössä",
        error_dateinput: "Päivämäärä ei ole oikea",
        error_datemonth: "Päivämäärä ei ole oikea - kuukaudessa on liikaa päiviä",
        error_datemonthinput: "Syöte ei kelpaa - kuukausia on 01-12",
        error_leapday: "Vuodessa ei ole karkauspäivää",

    }
}
var text = language.fi;
var laajuusVuodessa = 365*999;
var aiheLaajuus=[28, 12, 99, 3, 999];
const fieldName=['hetu0', 'hetu1','hetu2','hetu3','hetu4','hetu5','hetu6','hetu7',"hetu8",'hetu9']
// human, error, blank
var fieldStatus=[];
const util = {
    vars: {
        day: 'day',
        month: 'month',
        year: 'year',
        century: 'cent',
        number: 'number'
    },
    isFilled() {
        let isFilled = true;
        for (let i=0;i<9;i++) {
            let val = util.getFieldValue(i);
            if (val == "") {
                isFilled = false;
                return false;
            }
        }
        return true;

    }
    ,
    isFieldEmpty(name) {
        if (Number.isInteger(name)) {
            name = fieldName[name]
        }
        if ($("#"+name).val() == "")
            return true;
        return false;
    },
    resetBlanks() {
        for (let key in fieldStatus) {
            if (fieldStatus.hasOwnProperty(key)) {
                if (fieldStatus[key]='blank')
                    util.setFieldValue(key, "");
            }
        }
    },
    getFieldValue(name) {
        if (Number.isInteger(name)) {
            name = fieldName[name]
        }
        return $("#"+name).val();

    },
    setFieldValue(name,value) {
        if (Number.isInteger(name)) {
            name = fieldName[name]
        }
        $("#"+name).val(value);
    },
    getValue(name) {
        let fieldNumber = 0;
        switch(name) {
            case util.vars.year:
                fieldNumber += 2;
            case util.vars.month:
                fieldNumber += 2;
            case util.vars.day:
                if (util.getFieldValue(fieldNumber) == "")
                    return undefined;
                if (util.getFieldValue(fieldNumber+1) == "")
                    return undefined;
                return parseInt(util.getFieldValue(fieldNumber)+util.getFieldValue(fieldNumber+1));
                break;
        }

    },
    clearCheck() {
        $(_DOM.hetuCheckInput).val("");
    },
    randomBetween(min, max) {
        return Math.floor(Math.random() * (+max - +min)) + +min;

    },
    getHetu() {
        let res = "";
        for (let field of fieldName) {
            res += util.getFieldValue(field);
        }
        res += $(_DOM.hetuCheckInput).val();
        return res;
    }
}

const _generateFunctions = {
    maxVal: {
        day: 30,
        dayMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        day2: 28,
        month: 12,
        year: 99,
        number: 999,
    },
    day: function() {
        if (util.getFieldValue(0)!="" && util.getFieldValue(1) != "")
            return;
        let currMonth = util.getValue(util.vars.month);
        if (currMonth == undefined || Number.isNaN(currMonth)) {
            currMonth = _generateFunctions.month();
        }
        let maxDay = _generateFunctions.maxVal.dayMonths[currMonth-1];
        let randonDay = util.randomBetween(1, _generateFunctions.maxVal.dayMonths[currMonth-1]);
        console.log("xx", currMonth, "ran", randonDay,"%", randonDay%10)
        if (util.getFieldValue(1) == "") {
            if (parseInt(util.getFieldValue(0))==3) {
                if (maxDay > 30)
                    util.setFieldValue(1, randonDay % 2);
                else
                    util.setFieldValue(1, 0);
            } else if (parseInt(util.getFieldValue(0))==0) {
                util.setFieldValue(1, (randonDay % 9)+1) // 0 ei kelpaa
            } else {
                util.setFieldValue(1, randonDay % 10);
            }
        }
        if (util.getFieldValue(0) == "")
            util.setFieldValue(0, ~~(randonDay /10));
        return parseInt(util.getFieldValue(0)+util.getFieldValue(1));
    },
    month: function() {

        let maxMonth = 12;
        let daysMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 
        // first let's filter all the months by dates already entered
        if (parseInt(util.getFieldValue(0))==3) {
            // jos on jo jotain laitettu päivämäärään
            daysMonth = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 
            if (parseInt(util.getFieldValue(1))==1) {
                maxMonth = 7;
                daysMonth = [1, 3, 5, 7, 8, 10, 12]; 
            } else if (parseInt(util.getFieldValue(1))==0) {
                daysMonth = [4, 6, 9, 11]; 
            }
        } else if (parseInt(util.getFieldValue(0)+util.getFieldValue(1))>28) {
            daysMonth = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; 
        }
        // filter months by the months entered and left in the list
        let months = [];
        for (let m of daysMonth) {
            months.push({month: ("0"+(m)).slice(-2),
                days: ("0"+_generateFunctions.maxVal.dayMonths[m-1]).slice(-2)});                                
        }
        if (util.getFieldValue(2) != "") {
            // first digit of month entered
            for (let i=0; i<months.length; i++) {
                if (months[i].month.charAt(0) != util.getFieldValue(2)) {
                    months.splice(i, 1);
                    i--;
                }
            } 
        }
        if (util.getFieldValue(3) != "") {
            // second digit of month entered
            for (let i=0; i<months.length; i++) {
                if (months[i].month.charAt(1) != util.getFieldValue(3)) {
                     months.splice(i, 1);
                    i--;
                }
            } 
        }
        daysMonth=[];
        for (let i=0; i<months.length; i++) {
            daysMonth.push(parseInt(months[i].month));
        }
        maxMonth = daysMonth.length;
        console.log("Months left", daysMonth, "L", maxMonth);
        if (maxMonth == 0)
            return;
        let randonDay = daysMonth[util.randomBetween(0, maxMonth-1)];
        console.log("Arvottiin mt", randonDay);
        if (util.getFieldValue(2) == "")
            util.setFieldValue(2, ~~(randonDay /10));
        if (util.getFieldValue(3) == "")
            util.setFieldValue(3, randonDay % 10);
        return parseInt(util.getFieldValue(2)+util.getFieldValue(3));
    },
    year: function() {
        let randonDay = util.randomBetween(1, _generateFunctions.maxVal.year);
        if (util.getFieldValue(4) == "")
            util.setFieldValue(4, ~~(randonDay /10));
        if (util.getFieldValue(5) == "")
            util.setFieldValue(5, randonDay % 10);
        return parseInt(util.getFieldValue(4)+util.getFieldValue(5));
    },
    century: function() {
        let cents=['-','A'];
        if (util.getFieldValue(6)=="")
            util.setFieldValue(6, cents[util.randomBetween(0,1)]);
    },
    number: function() {
        let number = util.randomBetween(0,999);
        if (util.getFieldValue(7)=="")
            util.setFieldValue(7, ~~(number/100));    
        if (util.getFieldValue(8)=="")
            util.setFieldValue(8, ~~((number%100)/10));    
        if (util.getFieldValue(9)=="")
            util.setFieldValue(9, number%10);    

    }
}

var fieldMapping = {
    hetu0: _generateFunctions.day,
    hetu1: _generateFunctions.day,
    hetu2: _generateFunctions.month,
    hetu3: _generateFunctions.month,
    hetu4: _generateFunctions.year,
    hetu5: _generateFunctions.year,
    hetu6: _generateFunctions.century,
    hetu7: _generateFunctions.number,
    hetu8: _generateFunctions.number,
    hetu9: _generateFunctions.number,

}

function generateHetu() {
    let prevVal;
    for (let n in fieldMapping) {
        if (fieldMapping.hasOwnProperty(n)) {
            if (fieldMapping[n] == prevVal)
                continue; // jos on jo käsitelty, ei jatketa
            if ($("#"+n).val() == "") {
                fieldMapping[n]();
                prevVal = fieldMapping[n];
            }
        }
    }
}


function renderFieldStatus() {
    console.log("Status:", fieldStatus);
    for (let field of fieldName) {
        if (typeof fieldStatus[field] != 'undefined' && fieldStatus[field] !== 'blank') {
            $("#"+field).removeClass("field_error").removeClass("field_warning").removeClass("field_input")
                .addClass("field_"+fieldStatus[field]);
        } else {
            $("#"+field).removeClass("field_error").removeClass("field_warning").removeClass("field_input");
        }
    }
}

function clearBlankFields() {
    for (let field of fieldName) {
        if (typeof fieldStatus[field] == 'undefined' || fieldStatus[field] == 'blank') {
            util.setFieldValue(field,"");
        } 
    }

}

function renderError(field, error) {
    fieldStatus[field] = 'error';
}

function clearError(field, val) {
    if (val === '') {
        fieldStatus[field] = 'blank';
    } else {
        fieldStatus[field] = 'input';
    }

}

function getDateFromFields() {
    let months=[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let str = "";
    let yearStr = "";
    let dayStr ="";
    dayStr += util.getFieldValue(0);
    dayStr += util.getFieldValue(1) || 0;
    let day = parseInt(dayStr);
    let mStr = "";
    mStr += util.getFieldValue(2);
    mStr += util.getFieldValue(3) || 0;
    let month = parseInt(mStr);
    if (day > months[month-1])
        return false;
    return true;
    // tässä tutkitaan vain kuukausi nykyisestä vuodesta
    /*
    str += ".";
    yearStr += $("#hetu4").val();
    yearStr += $("#hetu5").val();
    let year = parseInt(yearStr)+centurySeparator[$("#hetu6").val()];
    */
    // tutkitaan karkauspäivä VAIN jos vuosi annettu
}

function checkDateAsValid() {
    return getDateFromFields();
    
}
const centurySeparator = {
    'A': 2000,
    '+': 1800,
    '-': 1900
}
const _checkFunctions={
    pvmField: function(val, field) {
        if (!/[0-9]/.test(val)) {
            renderError(field, text.error_input);
            return false;
        }
        if (field === 'hetu0' && !/[0-3]/.test(val)) {
            renderError(field, text.error_dateinput);
            return false;
        }
        if (field === 'hetu1') {
            let hetu0 = parseInt($('#hetu0').val());
            if (hetu0 === 3 && !/[0-1]/.test(val)) {
                renderError(field, text.error_dateinput);
                return false;
            }
            if (hetu0 === 0 && val == 0) {
                renderError(field, text.error_dateinput);
                return false;
            }
        }

        if (field === 'hetu2' && !/[0-1]/.test(val)) {
            renderError(field, text.error_dateinput);
            return false;
        }
        if (field === 'hetu3') {
            let hetu2 = parseInt($('#hetu2').val());
            if (hetu2 === 1 && !/[0-2]/.test(val)) {
                renderError(field, text.error_dateinput);
                return false;
            }
            if (hetu2 === 0 && val == "0") {
                renderError(field, text.error_dateinput);
                return false;
            }
        }
        if (checkDateAsValid()) {
            clearError(field);
            return true;
        }
        renderError(field, text.error_dateinput);
        return false;
    },
    centuryMark: function(val, field) {
        if (val === 'A' || val==='+' || val==='-') {
            clearError(field);
            return true;
        } else {
            renderError(field, text.error_inputcent);
            return false;
        }
    },
    seqNumber: function(val, field) {
        if (!/[0-9]/.test(val)) {
            renderError(field, text.error_input);
            return false;
        }
        clearError(field);
        return true;
    }
}
function calculateCheckChar(number) {
    let checkChar = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", 
                "A", "B", "C", "D", "E", "F", "H", "J", "K", "L", 
                "M", "N", "P",  "R", "S", "T", "U", "V", "W", "X", "Y"];
    return checkChar[number % 31];
}
function calculateCheckCharFromFields() {
    const fields={
        hetu0: 100000000,
        hetu1: 10000000,
        hetu2: 1000000,
        hetu3: 100000,
        hetu4: 10000,
        hetu5: 1000,
        hetu7: 100,
        hetu8: 10,
        hetu9: 1
    };
    let resnum = 0;
    for (let k in fields) {
        if (fields.hasOwnProperty(k)) {
            resnum += parseInt(($("#"+k).val())||0)*fields[k];
        }
    }
    let checkChar = calculateCheckChar(resnum);
    console.log("Resnum", resnum, checkChar);
    $(_DOM.hetuCheckInput).val(checkChar);

}

function calculateCheckForFull() {
    if(util.isFilled()) {
        calculateCheckCharFromFields();
    } else {
        util.clearCheck();
    }
}

function pvmField() {

}
function centuryMark() {

}
const _fieldCheckFunction = {
    hetu0: _checkFunctions.pvmField,
    hetu1: _checkFunctions.pvmField,
    hetu2: _checkFunctions.pvmField,
    hetu3: _checkFunctions.pvmField,
    hetu4: _checkFunctions.pvmField,
    hetu5: _checkFunctions.pvmField,
    hetu6: _checkFunctions.centuryMark,
    hetu7: _checkFunctions.seqNumber,
    hetu8: _checkFunctions.seqNumber,
    hetu9: _checkFunctions.seqNumber
}
const _DOM = {
    hetuInputSelector: "input.hetu",
    hetuAllInputs: ".hetu .hetufield",
    hetuCheckInput: "input#tark"
}
function setup() {
    $(_DOM.hetuAllInputs).attr("size", 1).attr("maxlength", 1);
    
    $(_DOM.hetuInputSelector).on('keydown', function(e) {
        $target = $(e.target);
        var inp = e.key; // String.fromCharCode(e.keyCode);
        if (e.keyCode === 37) { // left
            $target.prev(_DOM.hetuInputSelector).focus();
            e.preventDefault();
        } else if (e.keyCode == 39) { // right
            $target.next(_DOM.hetuInputSelector).focus();
            e.preventDefault();
        } else if (e.keyCode == 8) { //backspace
            $target.val("");
            fieldStatus[e.target.id]='blank';
            $target.prev(_DOM.hetuInputSelector).focus();
            e.preventDefault();
        } else if (e.keyCode == 46) { // delete 
            $target.val("");
            fieldStatus[e.target.id]='blank';
            e.preventDefault();
        } else if (/[a-zA-Z0-9\-\+ ]/.test(inp)) {
            $target.val("");
            if (inp != " " &&_fieldCheckFunction[e.target.id](inp.toUpperCase(), e.target.id) === false) {
                e.preventDefault();
            } else {
                clearError(e.target.id);
                if (inp != " ") {
                    $target.val(inp.toUpperCase());
                } else {
                    fieldStatus[e.target.id]='blank';
                }
                e.preventDefault();
                $target.next(_DOM.hetuInputSelector).focus();
            }
        } 
        calculateCheckForFull();
        renderFieldStatus();
    })

    /*
    $(_DOM.hetuInputSelector).on('keypress', function(e) {
        $target = $(e.target);
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9-\+_ ]/.test(inp)) {

            $target.next(_DOM.hetuInputSelector).focus();
        } 
    })
    $(_DOM.hetuInputSelector).on('keyup', function(e) {
        $target = $(e.target);
        if (e.keyCode == 8) // backspace
            $target.prev(_DOM.hetuInputSelector).focus();
    })
    */
}
function copyToClipboard(e) {
    let target = e.target;
    var textArea = document.createElement("textarea");
    textArea.value = $(e.target).parent("li").find(".result").html();
    textArea.style.visibility = 'hidden';
    e.target.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
        var succ = document.execCommand('copy');
    } catch(err) {
        console.log("ERROR in copy", err);
    }
    e.target.removeChild(textArea);
    e.preventDefault();
    return false;
}

function luoHetu() {
        clearBlankFields();
        generateHetu();
        calculateCheckCharFromFields();
        let hetu = util.getHetu();
        console.log("hetu", hetu)
        let el;
        $("ul#luodut").append($("<li />").attr("class","result-cont")
                    .append($("<span />").attr("class","result").html(hetu))
                    .append(el =$("<a />").attr("href","#").html("("+text.copy_link+")")));
        el[0].addEventListener("click", copyToClipboard, true);
    }