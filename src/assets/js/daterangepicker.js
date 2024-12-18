function intDateRangePicker(start_date, end_date) {
  // var start = moment().subtract(0, 'days');
  var start = moment();
  var end = moment();

  // console.log(' Number(new Date())', Number(new Date()));
  // console.log(' new Date(Number(new Date()))', new Date(Number(new Date())));
  // console.log(' new Date(Number(start_date))', new Date(Number(start_date)));

  start._d = new Date(start_date);
  end._d = new Date(end_date);


  $('#reportrange').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
      'hôm nay': [moment(), moment()],
      'hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'bảy ngày trước': [moment().subtract(6, 'days'), moment()],
      // 'mười bốn ngày trước': [moment().subtract(13, 'days'), moment()],
      // 'ba mươi ngày trước': [moment().subtract(29, 'days'), moment()],
      'tuần này': [moment().startOf('week'), moment().endOf('week')],
      'tuần trước': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
      'tháng này': [moment().startOf('month'), moment().endOf('month')],
      'tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'năm này': [moment().startOf('year'), moment().endOf('year')],
      'năm trước': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    }
  }, cb);

  cb(start, end);
};

function cb(start, end) {
  $('#reportrange span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
  $('#startDateReportTemp').val(Number(start));
  $('#endDateReportTemp').val(Number(end));
}


function intDateRangePickerCompare(start_date, end_date) {
  // var start = moment().subtract(0, 'days');
  var start = moment();
  var end = moment();

  // console.log(' Number(new Date())', Number(new Date()));
  // console.log(' new Date(Number(new Date()))', new Date(Number(new Date())));
  // console.log(' new Date(Number(start_date))', new Date(Number(start_date)));

  start._d = new Date(start_date);
  end._d = new Date(end_date);


  $('#reportrangeCompare').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
      'hôm nay': [moment(), moment()],
      'hôm qua': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'bảy ngày trước': [moment().subtract(6, 'days'), moment()],
      // 'mười bốn ngày trước': [moment().subtract(13, 'days'), moment()],
      // 'ba mươi ngày trước': [moment().subtract(29, 'days'), moment()],
      'tuần này': [moment().startOf('week'), moment().endOf('week')],
      'tuần trước': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
      'tháng này': [moment().startOf('month'), moment().endOf('month')],
      'tháng trước': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      'năm này': [moment().startOf('year'), moment().endOf('year')],
      'năm trước': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
    }
  }, cbCompare);

  cbCompare(start, end);
};

function cbCompare(start, end) {
  $('#reportrangeCompare span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
  $('#startDateReportTempCompare').val(Number(start));
  $('#endDateReportTempCompare').val(Number(end));
}

/*----------  Chọn lịch cho FBA bỏ hôm qua, hôm nay,..  ----------*/
function intDateRangePickerFBA(start_date, end_date) {
  // var start = moment().subtract(0, 'days');
  var start = moment();
  var end = moment();

  // console.log(' Number(new Date())', Number(new Date()));
  // console.log(' new Date(Number(new Date()))', new Date(Number(new Date())));
  // console.log(' new Date(Number(start_date))', new Date(Number(start_date)));

  start._d = new Date(start_date);
  end._d = new Date(end_date);

  $('#reportrangefba').daterangepicker({
    startDate: start,
    endDate: end,
  }, cbfba);
  cbfba(start, end);
};

function cbfba(start, end) {
  $('#reportrangefba span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
  $('#startDateReportTemp').val(Number(start));
  $('#endDateReportTemp').val(Number(end));
}
/*----------  Kế thúc chọn lịch FBA  ----------*/
/*----------  Nghĩa thêm loại lịch viewchild  ----------*/
// Đang sử dụng cho viewchild timeperriod1
function intDateRangePicker_viewchild(start_date, end_date) {
  var start = moment();
  var end = moment();
  start._d = new Date(start_date);
  end._d = new Date(end_date);
  $('#reportrangefba').daterangepicker({
    startDate: start,
    endDate: end,
  }, datetime_callback);
  $('#reportrangefba span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
};

function datetime_callback(start, end) {
  $('#reportrangefba span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
  $('#startDateReportTemp').val('\'' + start.format('YYYY-MM-DD') + '\'');
  $('#endDateReportTemp').val('\'' + end.format('YYYY-MM-DD') + '\'').trigger('change');
  $('#reportrangefba').on('apply.daterangepicker').trigger('change');;
}


// Đang sử dụng cho viewchild timeperriod2
function intDateRangePicker_viewchild2(start_date, end_date) {
  var start = moment();
  var end = moment();
  start._d = new Date(start_date);
  end._d = new Date(end_date);
  $('#reportrangefba2').daterangepicker({
    startDate: start,
    endDate: end,
  }, datetime_callback2);
  $('#reportrangefba2 span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
};

function datetime_callback2(start, end) {
  $('#reportrangefba2 span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
  $('#startDateReportTemp2').val('\'' + start.format('YYYY-MM-DD') + '\'');
  $('#endDateReportTemp2').val('\'' + end.format('YYYY-MM-DD') + '\'').trigger('change');
  $('#reportrangefba2').on('apply.daterangepicker').trigger('change');;
}


//   Customer Daily
function intDateRangePicker_daily_viewchild(start_date) {
  var start = moment();
  start._d = new Date(start_date);
  $('#reportrangefbaCustomerDaily').daterangepicker({
    singleDatePicker: true,
    startView: 2,
    minViewMode: 2,
    opens: 'right',
    startDate: start,
    timePickerSeconds: false,
    timePicker: false,
  }, datetime_daily_callback);
  $('#reportrangefbaCustomerDaily span').html(start.format('DD/MM/YYYY'));
};

function datetime_daily_callback(start) {
  $('#reportrangefbaCustomerDaily span').html(start.format('DD/MM/YYYY'));
  $('#reportrangefbaCustomerDaily #startDateReportTemp').val('\'' + start.format('YYYY-MM-DD') + '\'').trigger('change');
  $('#reportrangefbaCustomerDaily').on('apply.daterangepicker').trigger('change');
}

//  Customer Monthly
function intDateRangePicker_monthly_viewchild(start_date) {
  var start = moment();
  start._d = new Date(start_date);
  $('#reportrangefbaCustomerMonthly').daterangepicker({
    format: 'MM/yyyy',
    singleDatePicker: true,
    autoclose: true,
    timePicker: true,
    startDate: start,
    autoUpdateInput: true,
    time: {
      enabled: false
    },
    showDropdowns: true,
    minYear: 2015,
    maxYear: new Date().getFullYear() + 5,
    timePickerSeconds: false,
    timePicker: false,
    "locale": {
      "monthNames": [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
      "firstDay": 1
    },
  }, datetime_monthly_callback);
  $('#reportrangefbaCustomerMonthly span').html(start.format(' MM/YYYY'));
};

function datetime_monthly_callback(start) {
  $('#reportrangefbaCustomerMonthly span').html(start.format(' MM/YYYY'));
  $('#reportrangefbaCustomerMonthly #startDateReportTemp').val('\'' + start.format('YYYY-MM-DD') + '\'').trigger('change');
  $('#reportrangefbaCustomerMonthly').on('apply.daterangepicker').trigger('change');
}


//  Customer Yearly
function intDateRangePicker_yearly_viewchild(start_date) {
  var start = moment();
  start._d = new Date(start_date);
  // var language = localStorage.getItem("language")
   $('#reportrangefbaCustomerYearly').daterangepicker({
      format: 'MM/yyyy',
      singleDatePicker: true,
      autoclose: true,
      timePicker: true,
      startDate: start,
      autoUpdateInput: true,
      time: {
        enabled: false
      },
      showDropdowns: true,
      minYear: 2015,
      maxYear: new Date().getFullYear() + 5,
      timePickerSeconds: false,
      timePicker: false,
      "locale": {
        "monthNames": [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December"
        ],
        "firstDay": 1
      },
    }, datetime_yearly_callback); $('#reportrangefbaCustomerYearly span').html(start.format(' YYYY'));
  };

  function datetime_yearly_callback(start) {
    $('#reportrangefbaCustomerYearly span').html(start.format(' YYYY'));
    $('#reportrangefbaCustomerYearly #startDateReportTemp').val('\'' + start.format('YYYY-MM-DD') + '\'').trigger('change');
    $('#reportrangefbaCustomerYearly').on('apply.daterangepicker').trigger('change');
  }


  function intDateRangePicker_monthly() {
    $('#reportrangefbaCustomerMonthly').datepicker({
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: 'MM yy',
      onClose: function (dateText, inst) {
        $(this).datepicker('setDate', new Date(inst.selectedYear, inst.selectedMonth, 1));
        console.log('HHHHHH');
        console.log('dateText ' + dateText);
        console.log('inst ' + inst);
      }
    }, intDateRangePicker_callback);
    // $('#reportrangefba01 span').html(start.toString('MMMM, yyyy'));
  }

  function intDateRangePicker_callback() {
    // $('#reportrangefba01 span').html(start.toString('MMMM, yyyy')  );
    // $('#startDateReportTemp').val('\'' + start.format('YYYY-MM-DD') + '\'');
    // $('#reportrangefba01').on('apply.daterangepicker').trigger('change');;
  }
