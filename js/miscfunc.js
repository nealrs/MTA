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
	$('.btn').button('loading');
	
	//update form parameters [fremote is set by map marker onclick]
	$("#fdates").val( $("#pickdate").html() );
	
	//set chart title & range
	$(".ctitle").html( ttitle );
	$(".cdates").html( $("#fdates").val() );
	
	
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
			
			
			
			$('.btn').button('reset');
								  
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

var locations = [
      	['R470', 'ELTINGVILLE PK', 40.5446, -74.164581],
		['R544', 'HARRISON', 40.738879, -74.155533],
		['R165', 'TOMPKINSVILLE', 40.636948, -74.074824],
		['R070', 'ST. GEORGE', 40.643738, -74.073622],
		['R552', 'JOURNAL SQUARE', 40.732102, -74.063915],
		['R551', 'GROVE STREET', 40.719876, -74.042616],
		['R543', 'EXCHANGE PLACE', 40.716737, -74.033024],
		['R216', 'BAY RIDGE-95 ST', 40.616624, -74.030964],
		['R215', '86 ST', 40.622715, -74.028368],
		['R214', '77 ST', 40.629702, -74.025514],
		['R213', 'BAY RIDGE AVE', 40.634945, -74.023411],
		['R212', '59 ST', 40.641426, -74.017972],
		['R041', 'BOWLING GREEN', 40.704782, -74.014099],
		['R042', 'BOWLING GREEN', 40.704782, -74.014099],
		['R233', '53 ST', 40.644959, -74.014034],
		['R304', 'RECTOR ST', 40.70784, -74.013691],
		['R227', 'RECTOR ST', 40.707222, -74.013391],
		['R076', '2 BDWY CUST SRV', 40.704591, -74.013273],
		['R043', 'WALL ST', 40.707466, -74.011867],
		['R390', '8 AVE', 40.635011, -74.011717],
		['R305', 'CORTLANDT ST', 40.710454, -74.011324],
		['R088', 'CORTLANDT ST', 40.710662, -74.011052],
		['R125', 'BROAD ST', 40.706539, -74.011052],
		['R540', 'PATH WTC', 40.711638, -74.010708],
		['R540', 'PATH WTC 2', 40.711638, -74.010708],
		['R232', '45 ST', 40.648866, -74.010086],
		['R029', 'WORLD TRADE CTR', 40.712557, -74.009807],
		['R030', 'CHAMBERS ST', 40.715436, -74.009335],
		['R027', 'WALL ST', 40.706864, -74.009056],
		['R029', 'PARK PLACE', 40.713061, -74.008777],
		['R029', 'CHAMBERS ST', 40.71433, -74.008563],
		['R002', 'FULTON ST', 40.709938, -74.007983],
		['R014', 'FULTON ST', 40.709938, -74.007983],
		['R014', 'FULTON ST', 40.709938, -74.007983],
		['R014', 'FULTON ST', 40.709938, -74.007983],
		['R028', 'FULTON ST', 40.709938, -74.007983],
		['R087', "MURRAY ST-B'WAY", 40.713086, -74.007232],
		['R343', 'FRANKLIN ST', 40.719323, -74.006953],
		['R320', 'CANAL ST', 40.722819, -74.006267],
		['R391', 'FT HAMILTON PKY', 40.631428, -74.005387],
		['R290', 'HOUSTON ST', 40.728202, -74.005344],
		['R139', 'CANAL ST', 40.720852, -74.005237],
		['R044', 'CHAMBERS ST', 40.713159, -74.003917],
		['R044', 'CHAMBERS ST', 40.713159, -74.003917],
		['R044', 'BROOKLYN BRIDGE', 40.713159, -74.003917],
		['R044', 'BROOKLYN BRIDGE', 40.713159, -74.003917],
		['R282', 'SPRING ST', 40.726202, -74.003627],
		['R197', '36 ST', 40.65515, -74.003477],
		['R189', 'CHRISTOPHER ST', 40.733405, -74.002898],
		['R175', '8 AVE', 40.740388, -74.002104],
		['R175', '14 ST', 40.740388, -74.002104],
		['R372', '18 AVE', 40.607958, -74.001782],
		['R462', 'CANAL ST', 40.718697, -74.000977],
		['R463', 'CANAL ST', 40.718697, -74.000977],
		['R463', 'CANAL ST', 40.718697, -74.000977],
		['R371', '79 ST', 40.613513, -74.000645],
		['R138', 'W 4 ST-WASH SQ', 40.732251, -74.000559],
		['R118', 'CANAL ST', 40.718233, -74.000323],
		['R370', '71 ST', 40.619588, -73.998842],
		['R373', '20 AVE', 40.604798, -73.998456],
		['R105', '14 ST', 40.738007, -73.998381],
		['R278', '25 ST', 40.660481, -73.998059],
		['R111', '23 ST', 40.745924, -73.998005],
		['R455', '25 ST', 40.66043, -73.997944],
		['R321', '18 ST', 40.741096, -73.997877],
		['R086', "PRINCE ST-B'WAY", 40.724332, -73.997684],
		['R322', 'SPRING ST', 40.722397, -73.997211],
		['R163', '6 AVE', 40.737348, -73.9969],
		['R163', '14 ST-6 AVE', 40.737348, -73.9969],
		['R545', '14TH STREET', 40.737434, -73.996785],
		['R398', 'NEW UTRECHT AVE', 40.625419, -73.996632],
		['R461', 'BROADWAY/LAFAY', 40.725297, -73.996204],
		['R270', 'SMITH-9 ST', 40.673714, -73.996139],
		['R194', 'BLEECKER ST', 40.725665, -73.995645],
		['R190', '23 ST', 40.744071, -73.995624],
		['R247', '55 ST', 40.631412, -73.995473],
		['R220', 'CARROLL ST', 40.680231, -73.99498],
		['R234', '50 ST', 40.636232, -73.994765],
		['R368', '9 AVE', 40.646343, -73.994551],
		['R369', 'FT HAMILTON PKY', 40.640872, -73.994229],
		['R240', 'GRAND ST', 40.718542, -73.994164],
		['R311', 'BOWERY', 40.720315, -73.994014],
		['R374', 'BAY PARKWAY', 40.601898, -73.993821],
		['R012', '34 ST-PENN STA', 40.752247, -73.993456],
		['R013', '34 ST-PENN STA', 40.752247, -73.993456],
		['R272', '28 ST', 40.747224, -73.99336],
		['R293', '34 ST-PENN STA', 40.750264, -73.992984],
		['R542', 'TWENTY THIRD ST', 40.742933, -73.992909],
		['R224', 'CLARK ST', 40.697356, -73.992888],
		['R454', 'PROSPECT AVE', 40.665405, -73.992877],
		['R246', 'PROSPECT AVE', 40.665438, -73.992856],
		['R203', '23 ST-6 AVE', 40.742868, -73.99277],
		['R453', '23 ST-6 AVE', 40.742981, -73.992727],
		['R085', "8 ST-B'WAY NYU", 40.730348, -73.992705],
		['R031', '34 ST-PENN STA', 40.750329, -73.991096],
		['R160', 'ASTOR PLACE', 40.730056, -73.991042],
		['R129', 'BERGEN ST', 40.686154, -73.990881],
		['R170', '14 ST-UNION SQ', 40.734836, -73.990688],
		['R170', '14 ST-UNION SQ', 40.734836, -73.990688],
		['R170', '14 ST-UNION SQ', 40.734836, -73.990688],
		['R170', '14 ST-UNION SQ', 40.734836, -73.990688],
		['R252', 'HIGH ST', 40.699316, -73.990474],
		['R392', '18 AVE', 40.620728, -73.990388],
		['R257', 'EAST BROADWAY', 40.713647, -73.990152],
		['R108', 'BOROUGH HALL/CT', 40.692404, -73.990151],
		['R108', 'BOROUGH HALL/CT', 40.692404, -73.990151],
		['R108', 'BOROUGH HALL/CT', 40.692404, -73.990151],
		['R300', '2 AVE', 40.723291, -73.989873],
		['R010', '42 ST-PA BUS TE', 40.757303, -73.989787],
		['R011', '42 ST-PA BUS TE', 40.757303, -73.989787],
		['R083', '23 ST-5 AVE', 40.741006, -73.989315],
		['R258', '9 ST', 40.67032, -73.988757],
		['R258', '4 AVE', 40.67032, -73.988757],
		['R082', '28 ST-BROADWAY', 40.745574, -73.988682],
		['R541', 'THIRTY THIRD ST', 40.748931, -73.988113],
		['R022', '34 ST-HERALD SQ', 40.749533, -73.987899],
		['R023', '34 ST-HERALD SQ', 40.749533, -73.987899],
		['R022', '34 ST-HERALD SQ', 40.749533, -73.987899],
		['R023', '34 ST-HERALD SQ', 40.749533, -73.987899],
		['R142', 'ESSEX ST', 40.71838, -73.987813],
		['R142', 'DELANCEY ST', 40.71838, -73.987813],
		['R127', 'JAY ST-METROTEC', 40.692338, -73.987342],
		['R330', '3 AVE', 40.733243, -73.987169],
		['R399', '25 AVE', 40.597873, -73.986955],
		['R301', 'YORK ST', 40.699756, -73.98689],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504],
		['R033', '42 ST-TIMES SQ', 40.755905, -73.986504],
		['R131', '23 ST', 40.740088, -73.986429],
		['R188', '50 ST', 40.762439, -73.985989],
		['R089', 'JAY ST-METROTEC', 40.692182, -73.985935],
		['R217', 'HOYT/SCHERMER', 40.688465, -73.985474],
		['R393', '20 AVE', 40.617373, -73.985088],
		['R225', 'HOYT ST', 40.690547, -73.985066],
		['R456', 'HOYT ST', 40.690545, -73.985065],
		['R021', '42 ST-BRYANT PK', 40.754198, -73.984573],
		['R143', '28 ST', 40.743095, -73.984251],
		['R081', '49 ST-7 AVE', 40.760139, -73.984112],
		['R116', '50 ST', 40.761675, -73.983908],
		['R400', 'BAY 50 ST', 40.588879, -73.983629],
		['R231', 'UNION ST', 40.677302, -73.983135],
		['R164', '66 ST-LINCOLN', 40.773424, -73.982234],
		['R394', 'BAY PKY-22 AVE', 40.612006, -73.982009],
		['R054', '5 AVE-BRYANT PK', 40.753824, -73.981966],
		['R452', '72 ST', 40.778575, -73.981912],
		['R084', '59 ST-COLUMBUS', 40.76811, -73.981891],
		['R084', '59 ST-COLUMBUS', 40.76811, -73.981891],
		['R084', '59 ST-COLUMBUS', 40.76811, -73.981891],
		['R099', 'DEKALB AVE', 40.690612, -73.981848],
		['R176', '33 ST', 40.746119, -73.981826],
		['R248', '1 AVE', 40.730901, -73.981719],
		['R113', '7 AVE-53 ST', 40.762877, -73.98159],
		['R020', '47-50 ST-ROCK', 40.758652, -73.981311],
		['R151', 'STILLWELL AVE', 40.577423, -73.981225],
		['R395', 'KINGS HIGHWAY', 40.603967, -73.980668],
		['R080', '57 ST-7 AVE', 40.764755, -73.980646],
		['R056', 'NEVINS ST', 40.688269, -73.980453],
		['R288', '7 AV-PARK SLOPE', 40.666276, -73.980324],
		['R166', '79 ST', 40.783872, -73.979938],
		['R204', 'CHURCH AVE', 40.644039, -73.979541],
		['R241', '15 ST-PROSPECT', 40.660376, -73.979509],
		['R396', 'AVE U', 40.597482, -73.979359],
		['R397', '86 ST', 40.592676, -73.978243],
		['R420', 'DITMAS AVE', 40.63615, -73.978179],
		['R302', '57 ST', 40.763625, -73.977449],
		['R057', 'ATLANTIC AVE', 40.684063, -73.977417],
		['R057', 'ATLANTIC AVE', 40.684063, -73.977417],
		['R057', 'PACIFIC ST', 40.684063, -73.977417],
		['R057', 'ATLANTIC AVE', 40.684063, -73.977417],
		['R242', '18 AVE', 40.629881, -73.977149],
		['R045', '42 ST-GRD CNTRL', 40.751849, -73.976945],
		['R046', '42 ST-GRD CNTRL', 40.751849, -73.976945],
		['R047', '42 ST-GRD CNTRL', 40.751849, -73.976945],
		['R048', '42 ST-GRD CNTRL', 40.751849, -73.976945],
		['R281', '72 ST', 40.775545, -73.976398],
		['R167', '86 ST', 40.788844, -73.97599],
		['R312', 'W 8 ST-AQUARIUM', 40.576152, -73.975925],
		['R289', 'FT HAMILTON PKY', 40.650722, -73.975818],
		['R421', 'AVE I', 40.625305, -73.975732],
		['R422', '22 AVE-BAY PKY', 40.620907, -73.975453],
		['R318', 'FULTON ST', 40.68713, -73.975346],
		['R015', '5 AVE-53 ST', 40.760179, -73.975196],
		['R058', 'BERGEN ST', 40.680801, -73.975132],
		['R426', 'NEPTUNE AVE', 40.580992, -73.974531],
		['R271', 'AVE X', 40.589547, -73.974295],
		['R423', 'AVE N', 40.615174, -73.974166],
		['R283', 'LAFAYETTE AVE', 40.68617, -73.973908],
		['R079', '5 AVE-59 ST', 40.764909, -73.973372],
		['R425', 'AVE U', 40.596065, -73.973329],
		['R424', 'AVE P', 40.609147, -73.972986],
		['R171', '7 AVE', 40.677172, -73.972514],
		['R168', '96 ST', 40.79388, -73.972363],
		['R130', 'KINGS HIGHWAY', 40.603234, -73.972342],
		['R187', '81 ST-MUSEUM', 40.781435, -73.972149],
		['R049', '51 ST', 40.757108, -73.97187],
		['R059', 'GRAND ARMY PLAZ', 40.675219, -73.971012],
		['R016', 'LEXINGTON-53 ST', 40.75753, -73.969102],
		['R017', 'LEXINGTON-53 ST', 40.75753, -73.969102],
		['R186', '86 ST', 40.785822, -73.968952],
		['R264', 'OCEAN PARKWAY', 40.576298, -73.968523],
		['R191', '103 ST', 40.799354, -73.968329],
		['R050', 'LEXINGTON AVE', 40.762796, -73.967686],
		['R051', 'LEXINGTON AVE', 40.762796, -73.967686],
		['R050', '59 ST', 40.762796, -73.967686],
		['R051', '59 ST', 40.762796, -73.967686],
		['R317', 'CLINTON-WASH AV', 40.688123, -73.966742],
		['R192', '110 ST-CATHEDRL', 40.804032, -73.966742],
		['R319', 'LEXINGTON AVE', 40.764763, -73.966291],
		['R284', 'CLINTON-WASH AV', 40.683263, -73.965838],
		['R251', '96 ST', 40.791654, -73.964682],
		['R262', 'BEVERLEY ROAD', 40.643982, -73.96451],
		['R060', 'EASTERN PKWY', 40.672013, -73.96436],
		['R159', '116 ST-COLUMBIA', 40.80819, -73.964124],
		['R177', '68ST-HUNTER COL', 40.768143, -73.964016],
		['R468', 'RIT-MANHATTAN', 40.761268, -73.964016],
		['R184', 'CORTELYOU ROAD', 40.640905, -73.963866],
		['R098', 'CHURCH AVE', 40.650494, -73.962836],
		['R149', 'NEWKIRK AVE', 40.635059, -73.962793],
		['R196', 'PROSPECT PARK', 40.661596, -73.962193],
		['R172', 'BRIGHTON BEACH', 40.577961, -73.961806],
		['R263', 'AVE H', 40.629164, -73.961678],
		['R314', '103 ST', 40.796105, -73.961399],
		['R148', 'PARKSIDE AVE', 40.655053, -73.961227],
		['R228', 'AVE J', 40.625028, -73.960819],
		['R287', 'CLASSON AVE', 40.688855, -73.960025],
		['R178', '77 ST', 40.773636, -73.959875],
		['R229', 'AVE M', 40.617568, -73.95936],
		['R412', 'BOTANIC GARDEN', 40.670499, -73.958759],
		['R034', '125 ST', 40.815596, -73.958395],
		['R334', 'CATHEDRL-110 ST', 40.800637, -73.958201],
		['R123', 'FRANKLIN AVE', 40.670711, -73.958051],
		['R411', 'PARK PLACE', 40.67491, -73.957794],
		['R211', 'KINGS HIGHWAY', 40.608691, -73.957772],
		['R460', 'MARCY AVE', 40.708377, -73.957751],
		['R235', 'BEDFORD AVE', 40.717241, -73.956614],
		['R297', 'FRANKLIN AVE', 40.681159, -73.956056],
		['R150', 'AVE U', 40.599307, -73.955916],
		['R179', '86 ST', 40.779485, -73.955541],
		['R230', 'NECK ROAD', 40.595234, -73.95509],
		['R333', '116 ST', 40.805072, -73.954833],
		['R239', 'GREENPOINT AVE', 40.731324, -73.954425],
		['R136', 'SHEEPSHEAD BAY', 40.58681, -73.954167],
		['R469', 'RIT-ROOSEVELT', 40.7574, -73.954006],
		['R169', '137 ST-CITY COL', 40.821994, -73.953674],
		['R276', 'VERNON/JACKSON', 40.742624, -73.953545],
		['R352', 'HEWES ST', 40.706994, -73.953481],
		['R269', 'BEDFORD/NOSTRAN', 40.689636, -73.953459],
		['R259', 'ROOSEVELT IS', 40.759123, -73.953266],
		['R102', '125 ST', 40.811056, -73.952386],
		['R323', '110 ST-CPN', 40.79911, -73.951807],
		['R268', 'LORIMER ST', 40.713875, -73.951592],
		['R268', 'METROPOLITAN AV', 40.713875, -73.951592],
		['R256', 'NASSAU AV', 40.724608, -73.951271],
		['R144', '96 ST', 40.785822, -73.95097],
		['R277', 'PRESIDENT ST', 40.667879, -73.950648],
		['R209', 'STERLING ST', 40.662752, -73.950605],
		['R061', 'NOSTRAND AVE', 40.669735, -73.950455],
		['R273', '145 ST', 40.826426, -73.950412],
		['R299', 'BROADWAY', 40.7061, -73.950348],
		['R198', 'NOSTRAND AVE', 40.68041, -73.950326],
		['R316', 'FLUSHING AVE', 40.700374, -73.950284],
		['R451', 'WINTHROP ST', 40.656648, -73.950198],
		['R360', 'VAN ALSTON-21ST', 40.743973, -73.949876],
		['R324', '116 ST', 40.802098, -73.949625],
		['R109', 'CHURCH AVE', 40.650843, -73.949575],
		['R286', 'MYRTLE-WILLOUGH', 40.694568, -73.949046],
		['R210', 'BEVERLY ROAD', 40.645089, -73.948975],
		['R134', 'HUNTERS PT AVE', 40.74238, -73.948889],
		['R135', 'NEWKIRK AVE', 40.639961, -73.948352],
		['R332', '135 ST', 40.817902, -73.947644],
		['R110', 'FLATBUSH AVE', 40.632836, -73.947642],
		['R180', '103 ST', 40.790582, -73.947473],
		['R353', 'LORIMER ST', 40.703855, -73.947387],
		['R206', '125 ST', 40.808076, -73.945906],
		['R346', 'COURT SQ', 40.747029, -73.94537],
		['R359', 'COURT SQ-23 ST', 40.747257, -73.945112],
		['R359', 'COURT SQ', 40.747257, -73.945112],
		['R193', '157 ST', 40.833879, -73.944726],
		['R181', '110 ST', 40.795066, -73.944297],
		['R101', '145 ST', 40.824787, -73.944232],
		['R249', 'GRAHAM AVE', 40.71459, -73.944104],
		['R303', '21 ST', 40.7541, -73.94258],
		['R124', 'KINGSTON AVE', 40.669409, -73.942173],
		['R377', 'FLUSHING AVE', 40.700244, -73.941658],
		['R182', '116 ST', 40.798574, -73.941593],
		['R331', '155 ST', 40.830551, -73.941486],
		['R207', '135 ST', 40.814459, -73.940992],
		['R199', 'KINGSTON-THROOP', 40.679921, -73.940858],
		['R250', 'GRAND ST', 40.711874, -73.94067],
		['R121', 'QUEENSBORO PLZ', 40.750508, -73.940177],
		['R035', '168 ST-BROADWAY', 40.840778, -73.940091],
		['R035', '168 ST-BROADWAY', 40.840778, -73.940091],
		['R035', '168 ST-BROADWAY', 40.840778, -73.940091],
		['R265', 'MONTROSE AVE', 40.707889, -73.940005],
		['R296', '163 ST-AMSTERDM', 40.835957, -73.939898],
		['R126', '175 ST', 40.847369, -73.939683],
		['R315', '155 ST', 40.829934, -73.938632],
		['R174', '181 ST', 40.851686, -73.937967],
		['R132', '125 ST', 40.804406, -73.937452],
		['R140', 'QUEENS PLAZA', 40.748948, -73.937194],
		['R345', '148 ST-LENOX', 40.823877, -73.936443],
		['R344', '145 ST', 40.820402, -73.936315],
		['R378', 'MYRTLE AVE', 40.697266, -73.935692],
		['R280', '190 ST', 40.859022, -73.93419],
		['R260', '181 ST', 40.849495, -73.933632],
		['R294', 'MORGAN AVE', 40.706148, -73.93316],
		['R062', 'CROWN HTS-UTICA', 40.669279, -73.932967],
		['R090', 'BEEBE-39 AVE', 40.753076, -73.93271],
		['R291', '33 ST/RAWSON ST', 40.744558, -73.930993],
		['R153', 'UTICA AVE', 40.679279, -73.930585],
		['R307', '138 ST-GR CONC', 40.813208, -73.929877],
		['R274', '191 ST', 40.855176, -73.929384],
		['R091', 'WASHINGTON-36 A', 40.756977, -73.929373],
		['R379', 'KOSCIUSZKO ST', 40.693329, -73.928826],
		['R339', '36 ST', 40.75202, -73.92874],
		['R401', 'CENTRAL AVE', 40.697673, -73.927131],
		['R185', 'DYCKMAN-200 ST', 40.865286, -73.92698],
		['R205', '149 ST-GR CONC', 40.818429, -73.926927],
		['R445', '138 ST-3 AVE', 40.810512, -73.926165],
		['R195', '161 ST-YANKEE', 40.827888, -73.925736],
		['R195', '161 ST-YANKEE', 40.827888, -73.925736],
		['R195', '161 ST-YANKEE', 40.827888, -73.925736],
		['R036', 'DYCKMAN ST', 40.860523, -73.925575],
		['R092', 'BROADWAY-31 ST', 40.761959, -73.925382],
		['R261', '40 ST-LOWERY ST', 40.743778, -73.923998],
		['R279', 'JEFFERSON ST', 40.706636, -73.922925],
		['R063', 'SUTTER AVE', 40.664591, -73.922668],
		['R380', 'GATES AVE', 40.689652, -73.922281],
		['R093', 'GRAND-30 AVE', 40.766843, -73.921423],
		['R221', '167 ST', 40.835535, -73.92138],
		['R438', 'RALPH AVE', 40.678815, -73.920801],
		['R238', 'STEINWAY ST', 40.756864, -73.920736],
		['R173', 'INWOOD-207 ST', 40.868045, -73.919921],
		['R413', 'KNICKERBOCKER', 40.698666, -73.919685],
		['R446', 'BROOK AVE', 40.808044, -73.919234],
		['R037', '207 ST', 40.864653, -73.918719],
		['R236', 'DEKALB AVE', 40.703839, -73.91844],
		['R104', '167 ST', 40.833773, -73.91843],
		['R223', '46 ST-BLISS ST', 40.743079, -73.918419],
		['R243', '170 ST', 40.840048, -73.917775],
		['R053', '149 ST-3 AVE', 40.816132, -73.917754],
		['R094', 'HOYT ST-ASTORIA', 40.770426, -73.917614],
		['R381', 'HALSEY ST', 40.68617, -73.916337],
		['R064', 'SARATOGA AVE', 40.661466, -73.916316],
		['R038', '215 ST', 40.869359, -73.915329],
		['R308', 'MT EDEN AVE', 40.844406, -73.914621],
		['R447', 'CYPRESS AVE', 40.805737, -73.914471],
		['R443', '170 ST', 40.839301, -73.913355],
		['R267', '46 ST', 40.756312, -73.913333],
		['R309', '176 ST', 40.848635, -73.912497],
		['R327', '52 ST-LINCOLN', 40.744103, -73.912497],
		['R095', 'DITMARS BL-31 S', 40.774984, -73.912067],
		['R439', 'ROCKAWAY AVE', 40.67836, -73.911939],
		['R137', 'MYRTLE AVE', 40.699707, -73.91181],
		['R432', 'CHAUNCEY ST', 40.682867, -73.91048],
		['R039', 'MARBLE HILL-225', 40.874551, -73.909879],
		['R065', 'ROCKAWAY AVE', 40.662541, -73.908763],
		['R405', 'JACKSON AVE', 40.816505, -73.907797],
		['R402', 'SENECA AVE', 40.702798, -73.907776],
		['R244', 'BURNSIDE AVE', 40.85339, -73.907733],
		['R448', 'E 143 ST', 40.808742, -73.90769],
		['R298', 'NORTHERN BLVD', 40.752898, -73.905973],
		['R313', 'BUSHWICK AVE', 40.682558, -73.905501],
		['R154', 'TREMONT AVE', 40.850307, -73.905244],
		['R040', '231 ST', 40.878867, -73.904858],
		['R103', 'BROADWAY-ENY', 40.678848, -73.904139],
		['R449', 'E 149 ST', 40.812104, -73.904085],
		['R266', 'HALSEY ST', 40.695607, -73.904021],
		['R295', 'WILSON AVE', 40.688676, -73.903999],
		['R275', '183 ST', 40.858389, -73.903828],
		['R403', 'FOREST AVE', 40.704424, -73.903077],
		['R147', '61 ST/WOODSIDE', 40.745623, -73.902969],
		['R348', 'ATLANTIC AVE', 40.675496, -73.902819],
		['R066', 'JUNIUS ST', 40.663419, -73.902454],
		['R349', 'SUTTER AVE', 40.669376, -73.902047],
		['R152', 'ROCKAWAY PKY', 40.64666, -73.901832],
		['R406', 'PROSPECT AVE', 40.819396, -73.901467],
		['R119', 'FORDHAM ROAD', 40.862941, -73.901199],
		['R112', 'FORDHAM ROAD', 40.862803, -73.901034],
		['R306', '238 ST', 40.884821, -73.900759],
		['R237', '182-183 ST', 40.856085, -73.900695],
		['R350', 'LIVONIA AVE', 40.663801, -73.900444],
		['R376', 'EAST 105 ST', 40.650625, -73.899558],
		['R375', 'NEW LOTS AVE', 40.658748, -73.899472],
		['R433', 'ALABAMA AVE', 40.677107, -73.898871],
		['R117', '242 ST', 40.889185, -73.898549],
		['R340', '65 ST', 40.749663, -73.898485],
		['R161', 'KINGSBRIDGE RD', 40.867899, -73.897326],
		['R407', 'INTERVALE-163', 40.822172, -73.896747],
		['R440', 'LIBERTY AVE', 40.674552, -73.896554],
		['R347', '69 ST-FISK AVE', 40.746325, -73.896403],
		['R450', 'LONGWOOD AVE', 40.816083, -73.89606],
		['R404', 'FRESH POND ROAD', 40.706181, -73.89591],
		['R067', 'PENNSYLVANIA AV', 40.664884, -73.894258],
		['R155', 'KINGSBRIDGE RD', 40.866974, -73.893485],
		['R408', 'SIMPSON ST', 40.82417, -73.893228],
		['R409', 'FREEMAN ST', 40.829966, -73.891876],
		['R434', 'VAN SICLEN AVE', 40.678018, -73.891726],
		['R018', 'ROOSEVELT AVE', 40.746655, -73.891361],
		['R018', '74 ST-BROADWAY', 40.746655, -73.891361],
		['R146', 'HUNTS POINT AVE', 40.820889, -73.890567],
		['R441', 'VAN SICLEN AVE', 40.672786, -73.890438],
		['R183', 'BEDFORD PARK BL', 40.873399, -73.890084],
		['R100', 'METROPOLITAN AV', 40.711353, -73.88958],
		['R068', 'VAN SICLEN AVE', 40.665405, -73.889451],
		['R386', '174 ST', 40.837382, -73.887659],
		['R156', 'BEDFORD PARK BL', 40.873026, -73.886919],
		['R325', 'WHITLOCK AVE', 40.826508, -73.886425],
		['R435', 'CLEVELAND ST', 40.679938, -73.884687],
		['R133', 'MOSHOLU PARKWAY', 40.87963, -73.884666],
		['R069', 'NEW LOTS AVE', 40.666252, -73.884087],
		['R096', '82 ST-JACKSON H', 40.747647, -73.883786],
		['R218', 'ELMHURST AVE', 40.742445, -73.882005],
		['R442', 'SHEPHERD AVE', 40.674161, -73.880761],
		['R436', 'NORWOOD AVE', 40.681598, -73.880074],
		['R387', 'E TREMONT AVE', 40.840097, -73.879774],
		['R162', 'ELDER AVE', 40.828894, -73.879559],
		['R157', 'NORWOOD-205 ST', 40.874827, -73.878872],
		['R052', 'WOODLAWN ROAD', 40.885973, -73.878851],
		['R254', 'GRAND AV-NEWTON', 40.736998, -73.877242],
		['R122', '90 ST-ELMHURST', 40.748541, -73.876791],
		['R120', 'MORRISON AVE', 40.829495, -73.874559],
		['R437', 'CRESCENT ST', 40.683209, -73.873765],
		['R388', 'E 180 ST', 40.841882, -73.873551],
		['R003', 'CYPRESS HILLS', 40.689945, -73.872564],
		['R200', 'EUCLID AVE', 40.675382, -73.87207],
		['R538', 'LGA AIRPORT CTB', 40.774702, -73.871189],
		['R097', 'JUNCTION BLVD', 40.749143, -73.869452],
		['R201', 'WOODHAVEN BLVD', 40.73308, -73.869259],
		['R389', 'BRONX PARK EAST', 40.848797, -73.868465],
		['R245', 'ST LAWRENCE AVE', 40.8315, -73.867623],
		['R361', 'PELHAM PARKWAY', 40.857188, -73.867607],
		['R362', 'ALLERTON AVE', 40.865481, -73.867393],
		['R004', 'ELDERTS LANE', 40.69132, -73.867135],
		['R363', 'BURKE AVE', 40.871387, -73.867135],
		['R226', 'GUN HILL ROAD', 40.877796, -73.866341],
		['R364', 'GUN HILL ROAD', 40.877796, -73.866255],
		['R382', 'GRANT AVE', 40.677107, -73.865376],
		['R365', '219 ST', 40.883767, -73.862736],
		['R208', '103 ST-CORONA', 40.749858, -73.862672],
		['R202', '63 DR-REGO PARK', 40.729869, -73.86161],
		['R329', 'MORRIS PARK', 40.854137, -73.860977],
		['R222', 'E 177 ST-PARKCH', 40.833246, -73.860805],
		['R366', '225 ST', 40.887887, -73.860505],
		['R005', 'FOREST PARKWAY', 40.692304, -73.860151],
		['R383', 'HUDSON-80 ST', 40.679369, -73.85896],
		['R367', '233 ST', 40.893386, -73.857265],
		['R430', 'PELHAM PARKWAY', 40.858973, -73.855355],
		['R310', '111 ST', 40.75176, -73.855183],
		['R444', 'NEREID AVE', 40.898382, -73.854389],
		['R219', '67 AVE', 40.726462, -73.85263],
		['R006', 'WOODHAVEN BLVD', 40.693866, -73.851568],
		['R384', 'BOYD-88 ST', 40.679857, -73.851492],
		['R106', 'CASTLE HILL AVE', 40.834255, -73.851222],
		['R145', 'WAKEFIELD-241', 40.903085, -73.850591],
		['R326', 'ZEREGA AVE', 40.83646, -73.846471],
		['R328', 'METS-WILLETS PT', 40.754622, -73.845625],
		['R141', 'FOREST HILLS-71', 40.721681, -73.84439],
		['R007', '104 ST', 40.695184, -73.844326],
		['R385', 'ROCKAWAY BLVD', 40.680429, -73.843853],
		['R107', 'WESTCHESTER SQ', 40.839892, -73.842952],
		['R292', 'BAYCHESTER AVE', 40.878656, -73.838596],
		['R354', 'OXFORD-104 ST', 40.681745, -73.837631],
		['R419', 'ROCKAWAY PK 116', 40.580454, -73.837459],
		['R341', '75 AVE', 40.718477, -73.837223],
		['R427', 'MIDDLETOWN ROAD', 40.843635, -73.836687],
		['R008', '111 ST', 40.697405, -73.836354],
		['R357', 'AQUEDUCT-N CNDT', 40.668234, -73.834058],
		['R464', 'AQUEDUCT TRACK', 40.668221, -73.834026],
		['R428', 'BUHRE AVE', 40.846817, -73.832545],
		['R355', 'GREENWOOD-111', 40.684364, -73.832181],
		['R158', 'UNION TPK-KEW G', 40.714444, -73.830979],
		['R431', 'DYRE AVE', 40.888244, -73.83085],
		['R414', 'HOWARD BCH-JFK', 40.660476, -73.830301],
		['R535', 'JFK HOWARD BCH', 40.660476, -73.830301],
		['R055', 'MAIN ST', 40.759578, -73.830056],
		['R009', '121 ST', 40.700536, -73.828382],
		['R429', 'PELHAM BAY PARK', 40.852465, -73.828125],
		['R459', 'ORCHARD BEACH', 40.852417, -73.828082],
		['R418', 'BEACH 105 ST', 40.583542, -73.82643],
		['R356', 'LEFFERTS BLVD', 40.685975, -73.824713],
		['R255', 'VAN WYCK BLVD', 40.709174, -73.820593],
		['R417', 'BEACH 98 ST', 40.585514, -73.820143],
		['R342', 'JAMAICA-VAN WYC', 40.702566, -73.816859],
		['R415', 'BROAD CHANNEL', 40.608693, -73.816068],
		['R416', 'BEACH 90 ST', 40.588032, -73.813684],
		['R128', 'SUTPHIN BLVD', 40.705416, -73.810562],
		['R024', 'SUTPHIN BLVD', 40.700488, -73.807933],
		['R114', 'PARSONS BLVD', 40.707564, -73.803326],
		['R025', 'JAMAICA CENTER', 40.702131, -73.80111],
		['R335', 'BEACH 67 ST', 40.590867, -73.797011],
		['R115', '169 ST', 40.710459, -73.7936],
		['R336', 'BEACH 60 ST', 40.592334, -73.788493],
		['R019', 'JAMAICA-179 ST', 40.712622, -73.783815],
		['R536', 'JFK JAMAICA CT1', 40.643942, -73.782356],
		['R537', 'JFK JAMAICA CT2', 40.643942, -73.782356],
		['R337', 'BEACH 44 ST', 40.593214, -73.776433],
		['R338', 'BEACH 36 ST', 40.595381, -73.768194],
		['R358', 'BEACH 25 ST', 40.600138, -73.76152],
		['R285', 'FAR ROCKAWAY', 40.603983, -73.755383],
		['R253', '174-175 ST', 40.845892, -73.910136],
		['R001', 'WHITEHALL ST', 40.703082, -74.012983],
		['R001', 'SOUTH FERRY', 40.703082, -74.012983]
    ];

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
        
        //////// Setup markers & info windows
        var infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < locations.length; i++) {  
		  marker = new google.maps.Marker({
			position: new google.maps.LatLng(locations[i][2], locations[i][3]),
			map: map,
			//icon: '',
			title: locations[i][1]+" - "+locations[i][0]
		  });

		  google.maps.event.addListener(marker, 'click', (function(marker, i) {
			return function() {
			  infowindow.setContent(locations[i][1]+" - "+locations[i][0]);
			  infowindow.open(map, marker);
			  
			  // onclick, set remote code for form & chart title
			  $("#fremote").val( locations[i][0] );
			  ttitle = locations[i][1]+" - "+locations[i][0];
			}
		  })(marker, i));
		}
        //////////
      }
google.maps.event.addDomListener(window, 'load', initialize);

//var tdates;
var ttitle;

