$(document).ready(function() {
			
			$('#lastupdate').html('12/22/2012 - '+ moment().subtract('days', 7).endOf('week').format('L') );
			
			// date picker initilization
			$('#dates').daterangepicker(
                     {
                        ranges: {
                           'Last Week': [moment().subtract('days', 7).startOf('week').subtract('days', 1), moment().subtract('days', 7).endOf('week')], <!--- need to subtract 1 from each date here.--->
                           'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                           //'Last 3 Months': [moment().subtract('month', 3).startOf('month'), moment().subtract('month', 1).endOf('month')]
                        },
                        opens: 'left',
                        format: 'MM/DD/YYYY',
                        separator: ' to ',
                        startDate: moment().subtract('days', 7).startOf('week').subtract('days', 1),
                        endDate: moment().subtract('days', 7).endOf('week'),
                        
                       	// set min/max date manually --- or via db? (using moment.js for max, but need to reset min manually depending on oldest dataset)
                        minDate: '12/24/2012',
                        maxDate: moment().subtract('days', 7).endOf('week'),
                        locale: {
                            applyLabel: 'Submit',
                            fromLabel: 'From',
                            toLabel: 'To',
                            customRangeLabel: 'Custom Range',
                            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            firstDay: 0
                        },
                        showWeekNumbers: true,
                        buttonClasses: ['btn-danger'],
                        dateLimit: { days: 6 }
                     },
                     function(start, end) {
                        $('#dates2 span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
                     }
                  );
                  //Set the initial state of the picker label
                  $('#dates2 span').html(moment().subtract('days', 7).startOf('week').subtract('days', 1).format('MMMM D, YYYY') + ' - ' + moment().subtract('days', 7).endOf('week').format('MMMM D, YYYY'));

			$('#dates2').daterangepicker(
                     {
                        ranges: {
                           'Last Week': [moment().subtract('days', 7).startOf('week').subtract('days', 1), moment().subtract('days', 7).endOf('week')], <!--- need to subtract 1 from each date here.--->
                           'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
                           //'Last 3 Months': [moment().subtract('month', 3).startOf('month'), moment().subtract('month', 1).endOf('month')]
                        },
                        opens: 'left',
                        format: 'MM/DD/YYYY',
                        separator: ' to ',
                        startDate: moment().subtract('days', 7).startOf('week').subtract('days', 1),
                        endDate: moment().subtract('days', 7).endOf('week'),
                        minDate: '12/24/2012',
                        maxDate: moment().subtract('days', 7).endOf('week'),
                        locale: {
                            applyLabel: 'Submit',
                            fromLabel: 'From',
                            toLabel: 'To',
                            customRangeLabel: 'Custom Range',
                            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                            firstDay: 0
                        },
                        showWeekNumbers: true,
                        buttonClasses: ['btn-danger'],
                        dateLimit: { days: 62 }
                     },
                     function(start, end) {
                        $('#dates2 span').html(start.format('MM/DD/YYYY') + ' to ' + end.format('MM/DD/YYYY'));
                     }
                  );
                  //Set the initial state of the picker label
                  $('#dates2 span').html('Select date range');


            
            $(".chart_button").click(function() {
                $(".table_container").hide();
                //$(".placeholder_container").hide();
                $(".chart_container").show();
                
                submitForm();
                                           
            });
            
             $(".table_button").click(function() {
                $(".chart_container").hide();
                //$(".placeholder_container").hide();
                $(".table_container").show();
                
                submitForm();               
            });
            
             /*$(".brand").click(function() {
                $(".map_container").show();
                $(".chart_container").hide();
                $(".table_container").hide();
                
            });*/
            
            $("#toggle_control").click(function() {
                $(".map_container").slideToggle('slow');
                $('.toggle_icon').toggle();
                
            });
            
			// initially hide both table and chart containers.
			$(".table_container").hide();
			$(".chart_container").hide();
			
			// show modal on initial pageload
			//$('#aboutmodal').modal('toggle');
			
			/////
			
			$('#form').on('submit', function (e) {
			  
			  $('.btn').button('loading');
			  
			  $.ajax({
				type: 'get',
				url: 'get.php',
				data: $('form').serialize(),
				contentType: "application/json",
				success: function (data) {
			  
				  var parsed = jQuery.parseJSON(data);
				  //console.log(parsed);
			  
				  // ok, now lets plot the chart, write out the data table, and setup a CSV export.
				  plotChart(parsed);
				  dataTable(parsed.table);
				  JSON2CSV(parsed.table);
				  
				  $('.btn').button('reset');			  
				},
			
				error: function(XMLHttpRequest, textStatus, errorThrown) { alert("Oops! Please recheck your inputs and try again.");}
			
			  });
			  e.preventDefault();
			});
});


function submitForm(){			  
	//update form parameters
	$("#fremote").val('R290');
	$("#fdates").val( $("#pickdate").html() );
	
	//set chart title & range
	$(".ctitle").html( $("#fremote").val() );
	$(".cdates").html( $("#fdates").val() );
	//$('.btn').button('loading');
	
	$.ajax({
		type: 'get',
		url: 'get.php',
		data: $('form').serialize(),
		//data: 'remote=R314&dates=06%2F29%2F2013+to+07%2F06%2F2013',
		contentType: "application/json",
		success: function (data) {
			  
			var parsed = jQuery.parseJSON(data);
			//console.log(parsed);
			  
			// ok, now lets plot the chart, write out the data table, and setup the CSV export.
			plotChart(parsed);
			dataTable(parsed.table);
			JSON2CSV(parsed.table);
			
			
			
			//$('.btn').button('reset');
								  
			},
			
		error: function(XMLHttpRequest, textStatus, errorThrown) { alert("Oops! Please recheck your inputs and try again.");}
			
	});
}

function plotChart(data) {
      // setup chart data
      var data = {
		  "xScale": "ordinal",
		  "yScale": "linear",
		  "main": [
			{
			  "className": ".entries",
			  "data": data.entries			  
			},
			{
			  "className": ".exits",
			  "data": data.exits
			}
		  ]
		};
	  
	  // chart options	
	  var opts = {
  		"dataFormatX": function (x) { return d3.time.format('%Y-%m-%d %X').parse(x); },
  		"tickFormatX": function (x) { return d3.time.format('%a, %m/%d')(x); }
  	  };
  	  
  	  // finally, create the plot
      var myChart = new xChart('bar', data, '#chart', opts);
      
}

function dataTable(data){
	// setup data table.
	var str ="<table class='span12 table table-striped table-condensed table-hover table-bordered'><thead><tr><th>Interval Start</th><th>Entries</th><th>Exits</th><th>Interval End</th><th>Entries</th><th>Exits</th></tr></thead><tbody>";
			
			// load data table
			$.each(data, function(){
				str+="<tr>"; 
				$.each(this, function(key, value){
                    //alert(key + " --> " + value); 
                    str+="<td>"+value+"</td>";
                });
                str+="</tr> ";
			});
		
		// close data table
		str+= "</tbody></table>";
	
	$('.table_box').html(str);
}

function JSON2CSV(objArray) {
	// like it says, create CSV based on .table array from original return.
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
    var line = '';

        var head = array[0];
		for (var index in array[0]) {
        	var value = index + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }

        line = line.slice(0, -1);
        str += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';

        for (var index in array[i]) {
        	var value = array[i][index] + "";
            line += '"' + value.replace(/"/g, '""') + '",';
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
    }
    
    csv_data = str;
    return str;
    
    //window.open("data:text/csv;charset=utf-8," + escape(str))
}

function downloadCSV() {
	window.open("data:text/csv;charset=utf-8," + escape(csv_data))
}
// setup global csv variable.
var csv_data = "";    

// google maps code
google.maps.visualRefresh = true;
function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(40.7773, -73.9705),
          zoom: 12,
          
          disableDefaultUI: true,
          
          zoomControl: true,
    	  zoomControlOptions: {
      	  	style: google.maps.ZoomControlStyle.SMALL
    	  },
    	  
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("mapCanvas"), mapOptions);
        var transitLayer = new google.maps.TransitLayer(); transitLayer.setMap(map);
      }
google.maps.event.addDomListener(window, 'load', initialize);


