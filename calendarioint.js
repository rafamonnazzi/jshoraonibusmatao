
   // Utility: shorthand for the document.getElementByID()
function _(key) {
    return document.getElementById(key);
}

// Constructor
function NDP(elementID) {
    
    daysList = ['Dom', 'Seg', 'Ter', 'Qua','Qui', 'Sex', 'Sab'];
    monthsList = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Aug', 'Set', 'Out', 'Nov', 'Dez'];  
    
    
    no_of_days = {Jan: 31, Fev: 28, Mar: 31, Abr: 30, Mai: 31, Jun: 30, Jul: 31, Aug: 31, Set: 30, Out: 31, Nov: 30, Dez: 31};
    cur_opened = null;
    div = elementID;
    
    // Fn: to create calender in a div / change calender upon change in month_year
    // parameters
    // 1. month - format e.g. Jan
    // 2. year - yyyy
    getCal = function (month, year) {
        
        var cal_div = document.createElement('div');
        cal_div.id = div + '_calender_div';
        cal_div.className = 'calender_div';
        cal_div.style.visibility = 'hidden';
        _(div).appendChild(cal_div);
        
        var my_div = document.createElement('div');
        my_div.id = div + '_m_y';
        my_div.className = 'm_y';
        my_div.style.visibility = 'hidden';
        
        var prev_m = document.createElement('button');
        prev_m.id = 'prev_m_' + div;
        prev_m.className = 'm_btn left';
        prev_m.innerHTML = '&larr;';
        prev_m.setAttribute('onClick', 'updateMonthYear(id)');
        
        var next_m = document.createElement('button');
        next_m.id = 'next_m_' + div;
        next_m.className = 'm_btn right';
        next_m.setAttribute('onClick', 'updateMonthYear(id)');
        next_m.innerHTML = '&rarr;';
        
        var m_span = document.createElement('span');
        m_span.id = div + '_m_span';
        m_span.className = 'm_span';
        m_span.innerHTML = month + '_' + year;
        m_span.setAttribute('onClick', 'expand_toggle(\'' + div + '\')');
        
        my_div.appendChild(prev_m);
        my_div.appendChild(m_span);
        my_div.appendChild(next_m);
        
        _(div).appendChild(my_div);
        var d_span = document.createElement('span');
        d_span.innerHTML = 'select date';
        d_span.id = div + '_d_span';
        d_span.className = 'display_span';
        d_span.setAttribute('onClick', 'expand_toggle(\'' + div + '\')');
        _(div).appendChild(d_span);
        _(div).appendChild(cal_div);
        updateCal(cal_div, month, year); 	
    }
    
    updateCal = function (cal_div, month, year) {
        cal_div.innerHTML = '';
        if (month == null || year == null ) {
            var month = monthsList[new Date().getMonth()];
            var year = new Date().getFullYear();
        }
        
        if (month == "Feb" && year % 4 == 0 && year % 400 != 0) {
            totalDays = 29;
        } else {
            totalDays = no_of_days[month];
        }
        
        var day_on_1 = new Date(month + " 01" + ", " + year).getDay();	
        for(var i = 0; i < daysList.length; i++) {
            cal_div.innerHTML += "<div class='date_blocks_days' id='days_" + daysList[i] + "'>" + daysList[i] + "</div>";
        }
        
        if(day_on_1 > 0) {
            while (day_on_1 >0) {
                cal_div.innerHTML += "<div class='date_blocks_empty'></div>";
                day_on_1--;
            }
        } else if (day_on_1 == 0 && month =='Feb' && year % 4 != 0) {
            for (var i = 0; i < 7; i++) {
                cal_div.innerHTML += "<div class='date_blocks_empty'></div>";
            }
        }
        
        for(var i = 1; i <= totalDays; i++) {
            fulldate = year + '-' + (((monthsList.indexOf(month) + 1) + '').length == 1 ? '0' + (monthsList.indexOf(month) + 1): (monthsList.indexOf(month) + 1)) + '-' + ((i + '').length == 1 ? '0' + i : i);
            
            if ( new Date(fulldate).getDay() % 6 == 0 ) {
                cal_div.innerHTML += "<div class='date_blocks date_blocks_weekends' id='"  +cal_div.id + "_" + i + "_date_block' onClick='setValue(\"" + cal_div.parentElement.id + "\", innerHTML, \"" + month + "\", \"" + year + "\")'>" + i + "</div>";	
            } else {
                cal_div.innerHTML += "<div class='date_blocks' id='" + cal_div.id + "_" + i + "_date_block' onClick='setValue(\"" + cal_div.parentElement.id + "\", innerHTML, \"" + month + "\", \"" + year + "\")'>" + i + "</div>";
            }
        }
    }
    
    // To toggle open and close calender
    // parameteres = elm: calender element
    expand_toggle = function (elm) {
        if( _(elm).lastElementChild.style.visibility == "hidden" ) {
            if (cur_opened != null){
                expand_toggle(cur_opened);
            }
            cur_opened = elm;
        } else if ( _(elm).lastElementChild.style.visibility == "visible" ) {
            cur_opened = null;
        }
        
        _(elm).lastElementChild.style.visibility = _(elm).lastElementChild.style.visibility == "hidden" ? "visible" : "hidden";
        _(elm).firstChild.style.visibility = _(elm).firstChild.style.visibility == "hidden" ? "visible" : "hidden";
        _(elm).classList.toggle('btnSplit');
        _(elm).lastElementChild.classList.toggle('OpenCalender');
        _(elm).firstChild.nextSibling.classList.toggle('spanGone');
    }
    
    // update date on button onClick in calender
    update_date = function(clicked) {
        if(clicked.split('_')[0] == "from"){
            if( _("to_span").innerHTML != "TO" ){
                _("to_span").innerHTML = "TO"; 
                toast("Please select 'to date'!")
            }
            _("from_span").innerHTML = _(clicked).innerHTML + " " + _(clicked.split('_')[0] + "_m_y_span").innerHTML;
            getCal('to_cal', _('from_span').innerHTML.split(' ')[1], _('from_span').innerHTML.split(' ')[2]);
        } else if ( clicked.split('_')[0] == "to" ) {
            _("to_span").innerHTML = _(clicked).innerHTML + " " + _(clicked.split('_')[0] + "_m_y_span").innerHTML;;
        }
        expand_toggle(clicked.split('_')[0] + "_date");
    }
    
    // change month year
    updateMonthYear = function (key) {
        if(key.split('_')[0] == "prev"){
            var cm = _(key).nextSibling.innerHTML.split('_')[0],
            cy = _(key).nextSibling.innerHTML.split('_')[1],
            nm = monthsList.indexOf(cm) == 0 ? 11 : monthsList.indexOf(cm) - 1;
            
            cy = nm == 11 ? cy - 1 : cy;
            _(key).nextSibling.innerHTML = "";
            updateCal(_(key).parentElement.parentElement.lastElementChild, monthsList[nm], cy);
            _(key).nextSibling.innerHTML = monthsList[nm] + "_" + cy;
        } else if (key.split('_')[0] == "next") {
            var cm = _(key).previousSibling.innerHTML.split('_')[0];
            var cy = _(key).previousSibling.innerHTML.split('_')[1];
            var nm = monthsList.indexOf(cm) == 11 ? 0 : monthsList.indexOf(cm) + 1;
            cy = nm == 0 ? (cy*1) + 1 : cy; 
            _(key).previousSibling.innerHTML = "";
            updateCal(_(key).parentElement.parentElement.lastElementChild, monthsList[nm], cy);
            _(key).previousSibling.innerHTML = monthsList[nm] + "_" + cy;
        }
    }
    
    setValue = function(elm, day, month, year) {
        _(elm).firstChild.nextSibling.innerHTML = year + '-' + ( (((monthsList.indexOf(month)+1)+'').length == 1) ? '0'+(monthsList.indexOf(month)+1) : monthsList.indexOf(month)+1 ) +'-'+((day.length==1)?'0'+day:day);
        expand_toggle(elm);
    }
    
    // To get selected value
    // parameter = calender element e.g. document.getElementById('<div_id>');
    getValue = function (elm){
        return _(elm).firstChild.nextSibling.innerHTML.search('date') > -1 
        ? false 
        : _(elm).firstChild.nextSibling.innerHTML;
    }
    
    clearValue = function(elm) {
        _(elm).firstChild.nextSibling.innerHTML = 'select date';
    }
    
    clearCurOpened = function() {
        cur_opened = null;
    }
    
    return {
        get: getValue,
        toggle: expand_toggle,
        refresh: getCal
    }
}

var DP;

window.addEventListener('load', function(){
  DP = new NDP('calender');
  console.log(DP);
  DP.refresh('Jan', 2019);
  setTimeout(function() { DP.toggle('calender'); }, 700);
});