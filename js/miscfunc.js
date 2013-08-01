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
                $(".placeholder_container").hide();
                $(".chart_container").show();
                
                submitForm();
                                           
            });
            
             $(".table_button").click(function() {
                $(".chart_container").hide();
                $(".placeholder_container").hide();
                $(".table_container").show();
                
                submitForm();               
            });
            
             /*$(".brand").click(function() {
                $(".map_container").show();
                $(".chart_container").hide();
                $(".table_container").hide();
                
            });*/
            
            $("#toggle_control").click(function() {
                $(".map_container").slideToggle('fast');
                $('.toggle_icon').toggle();
                google.maps.event.trigger(map, 'resize');
                
            });
            
            $(".cbtn").click(function() {
                $(".map_container").slideToggle('fast');
                $('.toggle_icon').toggle();              
            });
            
			// initially hide both table and chart containers.
			$(".table_container").hide();
			$(".chart_container").hide();
			
			// show modal on initial pageload
			$('#aboutmodal').modal('toggle');
			
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

function validate(){
//validate our situation (check if form fields are empty)
	if ( $("#pickdate").html() == null 
		|| $("#pickdate").html() == ""
		|| $("#pickdate").html() == "select date range"  
		|| $("#fremote").val() == null
		|| $("#fremote").val() == ""){		
		
		//alert("Oops! Please recheck your inputs and try again.");
		//return null;
	}
}

function submitForm(){			  
	//$('.btn').button('loading');
	
	/*if (validate() == null){
		alert("Oops! Please recheck your inputs and try again.");
	} else {*/
	
		//update form parameters [fremote is set by map marker onclick]
		$("#fdates").val( $("#pickdate").html() );
	
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
			
				//set chart title & range
				$(".ctitle").html( ttitle );
				$(".ctrains").html(ttrains);
				$(".cdates").html( $("#fdates").val() );
			
				//$('.btn').button('reset');
								  
				},
			
			error: function(XMLHttpRequest, textStatus, errorThrown) { alert("Oops! Please recheck your inputs and try again.");}
			
		});
	//}
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
  		"tickFormatX": function (x) { return d3.time.format('%a, %m/%d')(x); },
  		"tickHintY": 10
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
      	['R470', 'ELTINGVILLE PK', 40.5446, -74.164581,' SRT', 'Z'],
		['R544', 'HARRISON', 40.738879, -74.155533,' PTH', '1'],
		['R165', 'TOMPKINSVILLE', 40.636948, -74.074824,' SRT', '1'],
		['R070', 'ST. GEORGE', 40.643738, -74.073622,' SRT', '1'],
		['R552', 'JOURNAL SQUARE', 40.732102, -74.063915,' PTH', '1'],
		['R551', 'GROVE STREET', 40.719876, -74.042616,' PTH', '1'],
		['R543', 'EXCHANGE PLACE', 40.716737, -74.033024,' PTH', '1'],
		['R216', 'BAY RIDGE-95 ST', 40.616624, -74.030964,' BMT', 'R'],
		['R215', '86 ST', 40.622715, -74.028368,' BMT', 'R'],
		['R214', '77 ST', 40.629702, -74.025514,' BMT', 'R'],
		['R213', 'BAY RIDGE AVE', 40.634945, -74.023411,' BMT', 'R'],
		['R212', '59 ST', 40.641426, -74.017972,' BMT', 'NR'],
		['R041', 'BOWLING GREEN', 40.704782, -74.014099,' IRT', '45'],
		['R042', 'BOWLING GREEN', 40.704782, -74.014099,' IRT', '45'],
		['R233', '53 ST', 40.644959, -74.014034,' BMT', 'R'],
		['R304', 'RECTOR ST', 40.70784, -74.013691,' IRT', '1'],
		['R227', 'RECTOR ST', 40.707222, -74.013391,' BMT', 'NR'],
		['R076', '2 BDWY CUST SRV', 40.704591, -74.013273,' IRT', '45'],
		['R043', 'WALL ST', 40.707466, -74.011867,' IRT', '45'],
		['R390', '8 AVE', 40.635011, -74.011717,' BMT', 'N'],
		['R305', 'CORTLANDT ST', 40.710454, -74.011324,' IRT', '1'],
		['R088', 'CORTLANDT ST', 40.710662, -74.011052,' BMT', 'R'],
		['R125', 'BROAD ST', 40.706539, -74.011052,' BMT', 'JZ'],
		['R540', 'PATH WTC / PATH WTC 2', 40.711638, -74.010708,' PTH', '1'],
		['R232', '45 ST', 40.648866, -74.010086,' BMT', 'R'],
		['R029', 'WORLD TRADE CTR', 40.712557, -74.009807,' IND', '23ACE'],
		['R030', 'CHAMBERS ST', 40.715436, -74.009335,' IRT', '123'],
		['R027', 'WALL ST', 40.706864, -74.009056,' IRT', '23'],
		['R029', 'PARK PLACE', 40.713061, -74.008777,' IRT', '23ACE'],
		['R029', 'CHAMBERS ST', 40.71433, -74.008563,' IND', 'ACE23'],
		['R002', 'FULTON ST', 40.709938, -74.007983,' BMT', 'ACJZ2345'],
		['R014', 'FULTON ST', 40.709938, -74.007983,' IND / IRT', 'ACJZ2345'],
		['R028', 'FULTON ST', 40.709938, -74.007983,' IRT', '2345ACJZ'],
		['R087', 'MURRAY ST-B\'WAY', 40.713086, -74.007232,' BMT', 'R'],
		['R343', 'FRANKLIN ST', 40.719323, -74.006953,' IRT', '1'],
		['R320', 'CANAL ST', 40.722819, -74.006267,' IRT', '1'],
		['R391', 'FT HAMILTON PKY', 40.631428, -74.005387,' BMT', 'N'],
		['R290', 'HOUSTON ST', 40.728202, -74.005344,' IRT', '1'],
		['R139', 'CANAL ST', 40.720852, -74.005237,' IND', 'ACE'],
		['R044', 'CHAMBERS ST / BROOKLYN BRIDGE', 40.713159, -74.003917,' BMT / IRT', '456JZ'],
		['R282', 'SPRING ST', 40.726202, -74.003627,' IND', 'CE'],
		['R197', '36 ST', 40.65515, -74.003477,' BMT', 'DNR'],
		['R189', 'CHRISTOPHER ST', 40.733405, -74.002898,' IRT', '1'],
		['R175', '8 AVE / 14 ST', 40.740388, -74.002104,' BMT / IND', 'ACEL'],
		['R372', '18 AVE', 40.607958, -74.001782,' BMT', 'D'],
		['R462', 'CANAL ST', 40.718697, -74.000977,' BMT', 'JNQRZ6'],
		['R463', 'CANAL ST', 40.718697, -74.000977,' BMT / IRT', 'JNQRZ6'],
		['R371', '79 ST', 40.613513, -74.000645,' BMT', 'D'],
		['R138', 'W 4 ST-WASH SQ', 40.732251, -74.000559,' IND', 'ABCDEFM'],
		['R118', 'CANAL ST', 40.718233, -74.000323,' BMT', 'JNQRZ6'],
		['R370', '71 ST', 40.619588, -73.998842,' BMT', 'D'],
		['R373', '20 AVE', 40.604798, -73.998456,' BMT', 'D'],
		['R105', '14 ST', 40.738007, -73.998381,' IRT', '123FLM'],
		['R278', '25 ST', 40.660481, -73.998059,' BMT', 'R'],
		['R111', '23 ST', 40.745924, -73.998005,' IND', 'CE'],
		['R455', '25 ST', 40.66043, -73.997944,' BMT', 'R'],
		['R321', '18 ST', 40.741096, -73.997877,' IRT', '1'],
		['R086', 'PRINCE ST-B\'WAY', 40.724332, -73.997684,' BMT', 'NR'],
		['R322', 'SPRING ST', 40.722397, -73.997211,' IRT', '6'],
		['R163', '14 ST-6 AVE', 40.737348, -73.9969,' IND / BMT', 'FLM123'],
		['R545', '14TH STREET', 40.737434, -73.996785,' PTH', '1'],
		['R398', 'NEW UTRECHT AVE', 40.625419, -73.996632,' BMT', 'ND'],
		['R461', 'BROADWAY/LAFAY', 40.725297, -73.996204,' IND', 'BDFM6'],
		['R270', 'SMITH-9 ST', 40.673714, -73.996139,' IND', 'FG'],
		['R194', 'BLEECKER ST', 40.725665, -73.995645,' IRT', '6BDFM'],
		['R190', '23 ST', 40.744071, -73.995624,' IRT', '1'],
		['R247', '55 ST', 40.631412, -73.995473,' BMT', 'D'],
		['R220', 'CARROLL ST', 40.680231, -73.99498,' IND', 'FG'],
		['R234', '50 ST', 40.636232, -73.994765,' BMT', 'D'],
		['R368', '9 AVE', 40.646343, -73.994551,' BMT', 'D'],
		['R369', 'FT HAMILTON PKY', 40.640872, -73.994229,' BMT', 'D'],
		['R240', 'GRAND ST', 40.718542, -73.994164,' IND', 'BD'],
		['R311', 'BOWERY', 40.720315, -73.994014,' BMT', 'JZ'],
		['R374', 'BAY PARKWAY', 40.601898, -73.993821,' BMT', 'D'],
		['R012', '34 ST-PENN STA', 40.752247, -73.993456,' IND', 'ACE'],
		['R013', '34 ST-PENN STA', 40.752247, -73.993456,' IND', 'ACE'],
		['R272', '28 ST', 40.747224, -73.99336,' IRT', '1'],
		['R293', '34 ST-PENN STA', 40.750264, -73.992984,' IRT', '123ACE'],
		['R542', 'TWENTY THIRD ST', 40.742933, -73.992909,' PTH', '1'],
		['R224', 'CLARK ST', 40.697356, -73.992888,' IRT', '23'],
		['R454', 'PROSPECT AVE', 40.665405, -73.992877,' BMT', 'R'],
		['R246', 'PROSPECT AVE', 40.665438, -73.992856,' BMT', 'R'],
		['R203', '23 ST-6 AVE', 40.742868, -73.99277,' IND', 'FM'],
		['R453', '23 ST-6 AVE', 40.742981, -73.992727,' IND', 'FM'],
		['R085', '8 ST-B\'WAY NYU', 40.730348, -73.992705,' BMT', 'NR'],
		['R031', '34 ST-PENN STA', 40.750329, -73.991096,' IRT', '123'],
		['R160', 'ASTOR PLACE', 40.730056, -73.991042,' IRT', '6'],
		['R129', 'BERGEN ST', 40.686154, -73.990881,' IND', 'FG'],
		['R170', '14 ST-UNION SQ', 40.734836, -73.990688,' BMT / IRT', 'LNQR456'],
		['R252', 'HIGH ST', 40.699316, -73.990474,' IND', 'AC'],
		['R392', '18 AVE', 40.620728, -73.990388,' BMT', 'N'],
		['R257', 'EAST BROADWAY', 40.713647, -73.990152,' IND', 'F'],
		['R108', 'BOROUGH HALL/CT', 40.692404, -73.990151,' BMT / IRT', '2345R'],
		['R300', '2 AVE', 40.723291, -73.989873,' IND', 'F'],
		['R010', '42 ST-PA BUS TE', 40.757303, -73.989787,' IND', 'ACENQRS1237'],
		['R011', '42 ST-PA BUS TE', 40.757303, -73.989787,' IND', 'ACENQRS1237'],
		['R083', '23 ST-5 AVE', 40.741006, -73.989315,' BMT', 'NR'],
		['R258', '4 AVE / 9 ST', 40.67032, -73.988757,' BMT / IND', 'DFGMNR'],
		['R082', '28 ST-BROADWAY', 40.745574, -73.988682,' BMT', 'NR'],
		['R541', 'THIRTY THIRD ST', 40.748931, -73.988113,' PTH', '1'],
		['R022', '34 ST-HERALD SQ', 40.749533, -73.987899,' BMT / IND', 'BDFMNQR'],
		['R023', '34 ST-HERALD SQ', 40.749533, -73.987899,' BMT / IND', 'BDFMNQR'],
		['R142', 'ESSEX ST / DELANCEY ST', 40.71838, -73.987813,' BMT / IND', 'FJMZ'],
		['R127', 'JAY ST-METROTEC', 40.692338, -73.987342,' IND', 'ACF'],
		['R330', '3 AVE', 40.733243, -73.987169,' BMT', 'L'],
		['R399', '25 AVE', 40.597873, -73.986955,' BMT', 'D'],
		['R301', 'YORK ST', 40.699756, -73.98689,' IND', 'F'],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504,' BMT', '1237ACENQRS'],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504,' IRT', '1237ACENQRS'],
		['R032', '42 ST-TIMES SQ', 40.755905, -73.986504,' IRT', 'ACENQRS1237'],
		['R033', '42 ST-TIMES SQ', 40.755905, -73.986504,' IRT', '1237ACENQRS'],
		['R131', '23 ST', 40.740088, -73.986429,' IRT', '6'],
		['R188', '50 ST', 40.762439, -73.985989,' IND', 'CE'],
		['R089', 'JAY ST-METROTEC', 40.692182, -73.985935,' BMT', 'R'],
		['R217', 'HOYT/SCHERMER', 40.688465, -73.985474,' IND', 'ACG'],
		['R393', '20 AVE', 40.617373, -73.985088,' BMT', 'N'],
		['R225', 'HOYT ST', 40.690547, -73.985066,' IRT', '23'],
		['R456', 'HOYT ST', 40.690545, -73.985065,' IRT', '23'],
		['R021', '42 ST-BRYANT PK', 40.754198, -73.984573,' IND', 'BDFM7'],
		['R143', '28 ST', 40.743095, -73.984251,' IRT', '6'],
		['R081', '49 ST-7 AVE', 40.760139, -73.984112,' BMT', 'NQR'],
		['R116', '50 ST', 40.761675, -73.983908,' IRT', '1'],
		['R400', 'BAY 50 ST', 40.588879, -73.983629,' BMT', 'D'],
		['R231', 'UNION ST', 40.677302, -73.983135,' BMT', 'R'],
		['R164', '66 ST-LINCOLN', 40.773424, -73.982234,' IRT', '1'],
		['R394', 'BAY PKY-22 AVE', 40.612006, -73.982009,' BMT', 'N'],
		['R054', '5 AVE-BRYANT PK', 40.753824, -73.981966,' IRT', '7BDFM'],
		['R452', '72 ST', 40.778575, -73.981912,' IRT', '123'],
		['R084', '59 ST-COLUMBUS', 40.76811, -73.981891,' IND / IRT', '1ABCD'],
		['R099', 'DEKALB AVE', 40.690612, -73.981848,' BMT', 'BDNQR'],
		['R176', '33 ST', 40.746119, -73.981826,' IRT', '6'],
		['R248', '1 AVE', 40.730901, -73.981719,' BMT', 'L'],
		['R113', '7 AVE-53 ST', 40.762877, -73.98159,' IND', 'BDE'],
		['R020', '47-50 ST-ROCK', 40.758652, -73.981311,' IND', 'BDFM'],
		['R151', 'STILLWELL AVE', 40.577423, -73.981225,' BMT', 'DFNQ'],
		['R395', 'KINGS HIGHWAY', 40.603967, -73.980668,' BMT', 'N'],
		['R080', '57 ST-7 AVE', 40.764755, -73.980646,' BMT', 'NQR'],
		['R056', 'NEVINS ST', 40.688269, -73.980453,' IRT', '2345'],
		['R288', '7 AV-PARK SLOPE', 40.666276, -73.980324,' IND', 'FG'],
		['R166', '79 ST', 40.783872, -73.979938,' IRT', '1'],
		['R204', 'CHURCH AVE', 40.644039, -73.979541,' IND', 'FG'],
		['R241', '15 ST-PROSPECT', 40.660376, -73.979509,' IND', 'FG'],
		['R396', 'AVE U', 40.597482, -73.979359,' BMT', 'N'],
		['R397', '86 ST', 40.592676, -73.978243,' BMT', 'N'],
		['R420', 'DITMAS AVE', 40.63615, -73.978179,' IND', 'F'],
		['R302', '57 ST', 40.763625, -73.977449,' IND', 'F'],
		['R057', 'ATLANTIC AVE / PACIFIC ST', 40.684063, -73.977417,' BMT / IRT', '2345BDNQR'],
		['R242', '18 AVE', 40.629881, -73.977149,' IND', 'F'],
		['R045', '42 ST-GRD CNTRL', 40.751849, -73.976945,' IRT', '4567S'],
		['R046', '42 ST-GRD CNTRL', 40.751849, -73.976945,' IRT', '4567S'],
		['R047', '42 ST-GRD CNTRL', 40.751849, -73.976945,' IRT', '4567S'],
		['R048', '42 ST-GRD CNTRL', 40.751849, -73.976945,' IRT', '4567S'],
		['R281', '72 ST', 40.775545, -73.976398,' IND', 'BC'],
		['R167', '86 ST', 40.788844, -73.97599,' IRT', '1'],
		['R312', 'W 8 ST-AQUARIUM', 40.576152, -73.975925,' BMT', 'FQ'],
		['R289', 'FT HAMILTON PKY', 40.650722, -73.975818,' IND', 'FG'],
		['R421', 'AVE I', 40.625305, -73.975732,' IND', 'F'],
		['R422', '22 AVE-BAY PKY', 40.620907, -73.975453,' IND', 'F'],
		['R318', 'FULTON ST', 40.68713, -73.975346,' IND', 'G'],
		['R015', '5 AVE-53 ST', 40.760179, -73.975196,' IND', 'EM'],
		['R058', 'BERGEN ST', 40.680801, -73.975132,' IRT', '23'],
		['R426', 'NEPTUNE AVE', 40.580992, -73.974531,' IND', 'F'],
		['R271', 'AVE X', 40.589547, -73.974295,' IND', 'F'],
		['R423', 'AVE N', 40.615174, -73.974166,' IND', 'F'],
		['R283', 'LAFAYETTE AVE', 40.68617, -73.973908,' IND', 'C'],
		['R079', '5 AVE-59 ST', 40.764909, -73.973372,' BMT', 'NQR'],
		['R425', 'AVE U', 40.596065, -73.973329,' IND', 'F'],
		['R424', 'AVE P', 40.609147, -73.972986,' IND', 'F'],
		['R171', '7 AVE', 40.677172, -73.972514,' BMT', 'BQ'],
		['R168', '96 ST', 40.79388, -73.972363,' IRT', '123'],
		['R130', 'KINGS HIGHWAY', 40.603234, -73.972342,' IND', 'F'],
		['R187', '81 ST-MUSEUM', 40.781435, -73.972149,' IND', 'BC'],
		['R049', '51 ST', 40.757108, -73.97187,' IRT', '6'],
		['R059', 'GRAND ARMY PLAZ', 40.675219, -73.971012,' IRT', '23'],
		['R016', 'LEXINGTON-53 ST', 40.75753, -73.969102,' IND', 'EM6'],
		['R017', 'LEXINGTON-53 ST', 40.75753, -73.969102,' IND', 'EM6'],
		['R186', '86 ST', 40.785822, -73.968952,' IND', 'BC'],
		['R264', 'OCEAN PARKWAY', 40.576298, -73.968523,' BMT', 'Q'],
		['R191', '103 ST', 40.799354, -73.968329,' IRT', '1'],
		['R050', 'LEXINGTON AVE / 59 ST', 40.762796, -73.967686,' BMT / IRT', '456NQR'],
		['R051', 'LEXINGTON AVE / 59 ST', 40.762796, -73.967686,' BMT / IRT', '456NQR'],
		['R317', 'CLINTON-WASH AV', 40.688123, -73.966742,' IND', 'G'],
		['R192', '110 ST-CATHEDRL', 40.804032, -73.966742,' IRT', '1'],
		['R319', 'LEXINGTON AVE', 40.764763, -73.966291,' IND', 'F'],
		['R284', 'CLINTON-WASH AV', 40.683263, -73.965838,' IND', 'C'],
		['R251', '96 ST', 40.791654, -73.964682,' IND', 'BC'],
		['R262', 'BEVERLEY ROAD', 40.643982, -73.96451,' BMT', 'BQ'],
		['R060', 'EASTERN PKWY', 40.672013, -73.96436,' IRT', '23'],
		['R159', '116 ST-COLUMBIA', 40.80819, -73.964124,' IRT', '1'],
		['R177', '68ST-HUNTER COL', 40.768143, -73.964016,' IRT', '6'],
		['R468', 'RIT-MANHATTAN', 40.761268, -73.964016,' RIT', 'R'],
		['R184', 'CORTELYOU ROAD', 40.640905, -73.963866,' BMT', 'BQ'],
		['R098', 'CHURCH AVE', 40.650494, -73.962836,' BMT', 'BQ'],
		['R149', 'NEWKIRK AVE', 40.635059, -73.962793,' BMT', 'BQ'],
		['R196', 'PROSPECT PARK', 40.661596, -73.962193,' BMT', 'BQS'],
		['R172', 'BRIGHTON BEACH', 40.577961, -73.961806,' BMT', 'BQ'],
		['R263', 'AVE H', 40.629164, -73.961678,' BMT', 'BQ'],
		['R314', '103 ST', 40.796105, -73.961399,' IND', 'BC'],
		['R148', 'PARKSIDE AVE', 40.655053, -73.961227,' BMT', 'BQ'],
		['R228', 'AVE J', 40.625028, -73.960819,' BMT', 'BQ'],
		['R287', 'CLASSON AVE', 40.688855, -73.960025,' IND', 'G'],
		['R178', '77 ST', 40.773636, -73.959875,' IRT', '6'],
		['R229', 'AVE M', 40.617568, -73.95936,' BMT', 'BQ'],
		['R412', 'BOTANIC GARDEN', 40.670499, -73.958759,' BMT', 'S2345'],
		['R034', '125 ST', 40.815596, -73.958395,' IRT', '1'],
		['R334', 'CATHEDRL-110 ST', 40.800637, -73.958201,' IND', 'BC'],
		['R123', 'FRANKLIN AVE', 40.670711, -73.958051,' IRT', '2345S'],
		['R411', 'PARK PLACE', 40.67491, -73.957794,' BMT', 'S'],
		['R211', 'KINGS HIGHWAY', 40.608691, -73.957772,' BMT', 'BQ'],
		['R460', 'MARCY AVE', 40.708377, -73.957751,' BMT', 'JMZ'],
		['R235', 'BEDFORD AVE', 40.717241, -73.956614,' BMT', 'L'],
		['R297', 'FRANKLIN AVE', 40.681159, -73.956056,' IND', 'ACS'],
		['R150', 'AVE U', 40.599307, -73.955916,' BMT', 'BQ'],
		['R179', '86 ST', 40.779485, -73.955541,' IRT', '456'],
		['R230', 'NECK ROAD', 40.595234, -73.95509,' BMT', 'BQ'],
		['R333', '116 ST', 40.805072, -73.954833,' IND', 'BC'],
		['R239', 'GREENPOINT AVE', 40.731324, -73.954425,' IND', 'G'],
		['R136', 'SHEEPSHEAD BAY', 40.58681, -73.954167,' BMT', 'BQ'],
		['R469', 'RIT-ROOSEVELT', 40.7574, -73.954006,' RIT', 'R'],
		['R169', '137 ST-CITY COL', 40.821994, -73.953674,' IRT', '1'],
		['R276', 'VERNON/JACKSON', 40.742624, -73.953545,' IRT', '7'],
		['R352', 'HEWES ST', 40.706994, -73.953481,' BMT', 'JM'],
		['R269', 'BEDFORD/NOSTRAN', 40.689636, -73.953459,' IND', 'G'],
		['R259', 'ROOSEVELT IS', 40.759123, -73.953266,' IND', 'F'],
		['R102', '125 ST', 40.811056, -73.952386,' IND', 'ACBD'],
		['R323', '110 ST-CPN', 40.79911, -73.951807,' IRT', '23'],
		['R268', 'LORIMER ST / METROPOLITAN AV', 40.713875, -73.951592,' BMT / IND', 'GL'],
		['R256', 'NASSAU AV', 40.724608, -73.951271,' IND', 'G'],
		['R144', '96 ST', 40.785822, -73.95097,' IRT', '6'],
		['R277', 'PRESIDENT ST', 40.667879, -73.950648,' IRT', '25'],
		['R209', 'STERLING ST', 40.662752, -73.950605,' IRT', '25'],
		['R061', 'NOSTRAND AVE', 40.669735, -73.950455,' IRT', '3'],
		['R273', '145 ST', 40.826426, -73.950412,' IRT', '1'],
		['R299', 'BROADWAY', 40.7061, -73.950348,' IND', 'G'],
		['R198', 'NOSTRAND AVE', 40.68041, -73.950326,' IND', 'AC'],
		['R316', 'FLUSHING AVE', 40.700374, -73.950284,' IND', 'G'],
		['R451', 'WINTHROP ST', 40.656648, -73.950198,' IRT', '25'],
		['R360', 'VAN ALSTON-21ST', 40.743973, -73.949876,' IND', 'G'],
		['R324', '116 ST', 40.802098, -73.949625,' IRT', '23'],
		['R109', 'CHURCH AVE', 40.650843, -73.949575,' IRT', '25'],
		['R286', 'MYRTLE-WILLOUGH', 40.694568, -73.949046,' IND', 'G'],
		['R210', 'BEVERLY ROAD', 40.645089, -73.948975,' IRT', '25'],
		['R134', 'HUNTERS PT AVE', 40.74238, -73.948889,' IRT', '7'],
		['R135', 'NEWKIRK AVE', 40.639961, -73.948352,' IRT', '25'],
		['R332', '135 ST', 40.817902, -73.947644,' IND', 'BC'],
		['R110', 'FLATBUSH AVE', 40.632836, -73.947642,' IRT', '25'],
		['R180', '103 ST', 40.790582, -73.947473,' IRT', '6'],
		['R353', 'LORIMER ST', 40.703855, -73.947387,' BMT', 'JM'],
		['R206', '125 ST', 40.808076, -73.945906,' IRT', '23'],
		['R346', 'COURT SQ', 40.747029, -73.94537,' IRT', '7'],
		['R359', 'COURT SQ-23 ST / COURT SQ', 40.747257, -73.945112,' IND', 'EMG'],
		['R193', '157 ST', 40.833879, -73.944726,' IRT', '1'],
		['R181', '110 ST', 40.795066, -73.944297,' IRT', '6'],
		['R101', '145 ST', 40.824787, -73.944232,' IND', 'ABCD'],
		['R249', 'GRAHAM AVE', 40.71459, -73.944104,' BMT', 'L'],
		['R303', '21 ST', 40.7541, -73.94258,' IND', 'F'],
		['R124', 'KINGSTON AVE', 40.669409, -73.942173,' IRT', '3'],
		['R377', 'FLUSHING AVE', 40.700244, -73.941658,' BMT', 'JM'],
		['R182', '116 ST', 40.798574, -73.941593,' IRT', '6'],
		['R331', '155 ST', 40.830551, -73.941486,' IND', 'C'],
		['R207', '135 ST', 40.814459, -73.940992,' IRT', '23'],
		['R199', 'KINGSTON-THROOP', 40.679921, -73.940858,' IND', 'C'],
		['R250', 'GRAND ST', 40.711874, -73.94067,' BMT', 'L'],
		['R121', 'QUEENSBORO PLZ', 40.750508, -73.940177,' IRT', '7NQ'],
		['R035', '168 ST-BROADWAY', 40.840778, -73.940091,' IND / IRT', '1AC'],
		['R265', 'MONTROSE AVE', 40.707889, -73.940005,' BMT', 'L'],
		['R296', '163 ST-AMSTERDM', 40.835957, -73.939898,' IND', 'C'],
		['R126', '175 ST', 40.847369, -73.939683,' IND', 'A'],
		['R315', '155 ST', 40.829934, -73.938632,' IND', 'BD'],
		['R174', '181 ST', 40.851686, -73.937967,' IND', 'A'],
		['R132', '125 ST', 40.804406, -73.937452,' IRT', '456'],
		['R140', 'QUEENS PLAZA', 40.748948, -73.937194,' IND', 'EMR'],
		['R345', '148 ST-LENOX', 40.823877, -73.936443,' IRT', '3'],
		['R344', '145 ST', 40.820402, -73.936315,' IRT', '3'],
		['R378', 'MYRTLE AVE', 40.697266, -73.935692,' BMT', 'JMZ'],
		['R280', '190 ST', 40.859022, -73.93419,' IND', 'A'],
		['R260', '181 ST', 40.849495, -73.933632,' IRT', '1'],
		['R294', 'MORGAN AVE', 40.706148, -73.93316,' BMT', 'L'],
		['R062', 'CROWN HTS-UTICA', 40.669279, -73.932967,' IRT', '34'],
		['R090', 'BEEBE-39 AVE', 40.753076, -73.93271,' BMT', 'NQ'],
		['R291', '33 ST/RAWSON ST', 40.744558, -73.930993,' IRT', '7'],
		['R153', 'UTICA AVE', 40.679279, -73.930585,' IND', 'AC'],
		['R307', '138 ST-GR CONC', 40.813208, -73.929877,' IRT', '45'],
		['R274', '191 ST', 40.855176, -73.929384,' IRT', '1'],
		['R091', 'WASHINGTON-36 A', 40.756977, -73.929373,' BMT', 'NQ'],
		['R379', 'KOSCIUSZKO ST', 40.693329, -73.928826,' BMT', 'J'],
		['R339', '36 ST', 40.75202, -73.92874,' IND', 'MR'],
		['R401', 'CENTRAL AVE', 40.697673, -73.927131,' BMT', 'M'],
		['R185', 'DYCKMAN-200 ST', 40.865286, -73.92698,' IND', 'A'],
		['R205', '149 ST-GR CONC', 40.818429, -73.926927,' IRT', '245'],
		['R445', '138 ST-3 AVE', 40.810512, -73.926165,' IRT', '6'],
		['R195', '161 ST-YANKEE', 40.827888, -73.925736,' IND / IRT', 'BD4'],
		['R036', 'DYCKMAN ST', 40.860523, -73.925575,' IRT', '1'],
		['R092', 'BROADWAY-31 ST', 40.761959, -73.925382,' BMT', 'NQ'],
		['R261', '40 ST-LOWERY ST', 40.743778, -73.923998,' IRT', '7'],
		['R279', 'JEFFERSON ST', 40.706636, -73.922925,' BMT', 'L'],
		['R063', 'SUTTER AVE', 40.664591, -73.922668,' IRT', '3'],
		['R380', 'GATES AVE', 40.689652, -73.922281,' BMT', 'JZ'],
		['R093', 'GRAND-30 AVE', 40.766843, -73.921423,' BMT', 'NQ'],
		['R221', '167 ST', 40.835535, -73.92138,' IRT', '4'],
		['R438', 'RALPH AVE', 40.678815, -73.920801,' IND', 'C'],
		['R238', 'STEINWAY ST', 40.756864, -73.920736,' IND', 'MR'],
		['R173', 'INWOOD-207 ST', 40.868045, -73.919921,' IND', 'A'],
		['R413', 'KNICKERBOCKER', 40.698666, -73.919685,' BMT', 'M'],
		['R446', 'BROOK AVE', 40.808044, -73.919234,' IRT', '6'],
		['R037', '207 ST', 40.864653, -73.918719,' IRT', '1'],
		['R236', 'DEKALB AVE', 40.703839, -73.91844,' BMT', 'L'],
		['R104', '167 ST', 40.833773, -73.91843,' IND', 'BD'],
		['R223', '46 ST-BLISS ST', 40.743079, -73.918419,' IRT', '7'],
		['R243', '170 ST', 40.840048, -73.917775,' IRT', '4'],
		['R053', '149 ST-3 AVE', 40.816132, -73.917754,' IRT', '25'],
		['R094', 'HOYT ST-ASTORIA', 40.770426, -73.917614,' BMT', 'NQ'],
		['R381', 'HALSEY ST', 40.68617, -73.916337,' BMT', 'J'],
		['R064', 'SARATOGA AVE', 40.661466, -73.916316,' IRT', '3'],
		['R038', '215 ST', 40.869359, -73.915329,' IRT', '1'],
		['R308', 'MT EDEN AVE', 40.844406, -73.914621,' IRT', '4'],
		['R447', 'CYPRESS AVE', 40.805737, -73.914471,' IRT', '6'],
		['R443', '170 ST', 40.839301, -73.913355,' IND', 'BD'],
		['R267', '46 ST', 40.756312, -73.913333,' IND', 'MR'],
		['R309', '176 ST', 40.848635, -73.912497,' IRT', '4'],
		['R327', '52 ST-LINCOLN', 40.744103, -73.912497,' IRT', '7'],
		['R095', 'DITMARS BL-31 S', 40.774984, -73.912067,' BMT', 'NQ'],
		['R439', 'ROCKAWAY AVE', 40.67836, -73.911939,' IND', 'C'],
		['R137', 'MYRTLE AVE', 40.699707, -73.91181,' BMT', 'LM'],
		['R432', 'CHAUNCEY ST', 40.682867, -73.91048,' BMT', 'JZ'],
		['R039', 'MARBLE HILL-225', 40.874551, -73.909879,' IRT', '1'],
		['R065', 'ROCKAWAY AVE', 40.662541, -73.908763,' IRT', '3'],
		['R405', 'JACKSON AVE', 40.816505, -73.907797,' IRT', '25'],
		['R402', 'SENECA AVE', 40.702798, -73.907776,' BMT', 'M'],
		['R244', 'BURNSIDE AVE', 40.85339, -73.907733,' IRT', '4'],
		['R448', 'E 143 ST', 40.808742, -73.90769,' IRT', '6'],
		['R298', 'NORTHERN BLVD', 40.752898, -73.905973,' IND', 'MR'],
		['R313', 'BUSHWICK AVE', 40.682558, -73.905501,' BMT', 'L'],
		['R154', 'TREMONT AVE', 40.850307, -73.905244,' IND', 'BD'],
		['R040', '231 ST', 40.878867, -73.904858,' IRT', '1'],
		['R103', 'BROADWAY-ENY', 40.678848, -73.904139,' IND', 'ACJLZ'],
		['R449', 'E 149 ST', 40.812104, -73.904085,' IRT', '6'],
		['R266', 'HALSEY ST', 40.695607, -73.904021,' BMT', 'L'],
		['R295', 'WILSON AVE', 40.688676, -73.903999,' BMT', 'L'],
		['R275', '183 ST', 40.858389, -73.903828,' IRT', '4'],
		['R403', 'FOREST AVE', 40.704424, -73.903077,' BMT', 'M'],
		['R147', '61 ST/WOODSIDE', 40.745623, -73.902969,' IRT', '7'],
		['R348', 'ATLANTIC AVE', 40.675496, -73.902819,' BMT', 'L'],
		['R066', 'JUNIUS ST', 40.663419, -73.902454,' IRT', '3'],
		['R349', 'SUTTER AVE', 40.669376, -73.902047,' BMT', 'L'],
		['R152', 'ROCKAWAY PKY', 40.64666, -73.901832,' BMT', 'L'],
		['R406', 'PROSPECT AVE', 40.819396, -73.901467,' IRT', '25'],
		['R119', 'FORDHAM ROAD', 40.862941, -73.901199,' IRT', '4'],
		['R112', 'FORDHAM ROAD', 40.862803, -73.901034,' IND', 'BD'],
		['R306', '238 ST', 40.884821, -73.900759,' IRT', '1'],
		['R237', '182-183 ST', 40.856085, -73.900695,' IND', 'BD'],
		['R350', 'LIVONIA AVE', 40.663801, -73.900444,' BMT', 'L'],
		['R376', 'EAST 105 ST', 40.650625, -73.899558,' BMT', 'L'],
		['R375', 'NEW LOTS AVE', 40.658748, -73.899472,' BMT', 'L'],
		['R433', 'ALABAMA AVE', 40.677107, -73.898871,' BMT', 'J'],
		['R117', '242 ST', 40.889185, -73.898549,' IRT', '1'],
		['R340', '65 ST', 40.749663, -73.898485,' IND', 'MR'],
		['R161', 'KINGSBRIDGE RD', 40.867899, -73.897326,' IRT', '4'],
		['R407', 'INTERVALE-163', 40.822172, -73.896747,' IRT', '25'],
		['R440', 'LIBERTY AVE', 40.674552, -73.896554,' IND', 'C'],
		['R347', '69 ST-FISK AVE', 40.746325, -73.896403,' IRT', '7'],
		['R450', 'LONGWOOD AVE', 40.816083, -73.89606,' IRT', '6'],
		['R404', 'FRESH POND ROAD', 40.706181, -73.89591,' BMT', 'M'],
		['R067', 'PENNSYLVANIA AV', 40.664884, -73.894258,' IRT', '3'],
		['R155', 'KINGSBRIDGE RD', 40.866974, -73.893485,' IND', 'BD'],
		['R408', 'SIMPSON ST', 40.82417, -73.893228,' IRT', '25'],
		['R409', 'FREEMAN ST', 40.829966, -73.891876,' IRT', '25'],
		['R434', 'VAN SICLEN AVE', 40.678018, -73.891726,' BMT', 'JZ'],
		['R018', 'ROOSEVELT AVE / 74 ST-BROADWAY', 40.746655, -73.891361,' IND / IRT', 'EFMR7'],
		['R146', 'HUNTS POINT AVE', 40.820889, -73.890567,' IRT', '6'],
		['R441', 'VAN SICLEN AVE', 40.672786, -73.890438,' IND', 'C'],
		['R183', 'BEDFORD PARK BL', 40.873399, -73.890084,' IRT', '4'],
		['R100', 'METROPOLITAN AV', 40.711353, -73.88958,' BMT', 'M'],
		['R068', 'VAN SICLEN AVE', 40.665405, -73.889451,' IRT', '3'],
		['R386', '174 ST', 40.837382, -73.887659,' IRT', '25'],
		['R156', 'BEDFORD PARK BL', 40.873026, -73.886919,' IND', 'BD'],
		['R325', 'WHITLOCK AVE', 40.826508, -73.886425,' IRT', '6'],
		['R435', 'CLEVELAND ST', 40.679938, -73.884687,' BMT', 'J'],
		['R133', 'MOSHOLU PARKWAY', 40.87963, -73.884666,' IRT', '4'],
		['R069', 'NEW LOTS AVE', 40.666252, -73.884087,' IRT', '3'],
		['R096', '82 ST-JACKSON H', 40.747647, -73.883786,' IRT', '7'],
		['R218', 'ELMHURST AVE', 40.742445, -73.882005,' IND', 'MR'],
		['R442', 'SHEPHERD AVE', 40.674161, -73.880761,' IND', 'C'],
		['R436', 'NORWOOD AVE', 40.681598, -73.880074,' BMT', 'JZ'],
		['R387', 'E TREMONT AVE', 40.840097, -73.879774,' IRT', '25'],
		['R162', 'ELDER AVE', 40.828894, -73.879559,' IRT', '6'],
		['R157', 'NORWOOD-205 ST', 40.874827, -73.878872,' IND', 'D'],
		['R052', 'WOODLAWN ROAD', 40.885973, -73.878851,' IRT', '4'],
		['R254', 'GRAND AV-NEWTON', 40.736998, -73.877242,' IND', 'MR'],
		['R122', '90 ST-ELMHURST', 40.748541, -73.876791,' IRT', '7'],
		['R120', 'MORRISON AVE', 40.829495, -73.874559,' IRT', '6'],
		['R437', 'CRESCENT ST', 40.683209, -73.873765,' BMT', 'JZ'],
		['R388', 'E 180 ST', 40.841882, -73.873551,' IRT', '25'],
		['R003', 'CYPRESS HILLS', 40.689945, -73.872564,' BMT', 'J'],
		['R200', 'EUCLID AVE', 40.675382, -73.87207,' IND', 'AC'],
		['R538', 'LGA AIRPORT CTB', 40.774702, -73.871189,' IRT', '7'],
		['R097', 'JUNCTION BLVD', 40.749143, -73.869452,' IRT', '7'],
		['R201', 'WOODHAVEN BLVD', 40.73308, -73.869259,' IND', 'MR'],
		['R389', 'BRONX PARK EAST', 40.848797, -73.868465,' IRT', '25'],
		['R245', 'ST LAWRENCE AVE', 40.8315, -73.867623,' IRT', '6'],
		['R361', 'PELHAM PARKWAY', 40.857188, -73.867607,' IRT', '25'],
		['R362', 'ALLERTON AVE', 40.865481, -73.867393,' IRT', '25'],
		['R004', 'ELDERTS LANE', 40.69132, -73.867135,' BMT', 'JZ'],
		['R363', 'BURKE AVE', 40.871387, -73.867135,' IRT', '25'],
		['R226', 'GUN HILL ROAD', 40.877796, -73.866341,' IRT', '5'],
		['R364', 'GUN HILL ROAD', 40.877796, -73.866255,' IRT', '25'],
		['R382', 'GRANT AVE', 40.677107, -73.865376,' IND', 'A'],
		['R365', '219 ST', 40.883767, -73.862736,' IRT', '25'],
		['R208', '103 ST-CORONA', 40.749858, -73.862672,' IRT', '7'],
		['R202', '63 DR-REGO PARK', 40.729869, -73.86161,' IND', 'MR'],
		['R329', 'MORRIS PARK', 40.854137, -73.860977,' IRT', '5'],
		['R222', 'E 177 ST-PARKCH', 40.833246, -73.860805,' IRT', '6'],
		['R366', '225 ST', 40.887887, -73.860505,' IRT', '25'],
		['R005', 'FOREST PARKWAY', 40.692304, -73.860151,' BMT', 'J'],
		['R383', 'HUDSON-80 ST', 40.679369, -73.85896,' IND', 'A'],
		['R367', '233 ST', 40.893386, -73.857265,' IRT', '25'],
		['R430', 'PELHAM PARKWAY', 40.858973, -73.855355,' IRT', '5'],
		['R310', '111 ST', 40.75176, -73.855183,' IRT', '7'],
		['R444', 'NEREID AVE', 40.898382, -73.854389,' IRT', '25'],
		['R219', '67 AVE', 40.726462, -73.85263,' IND', 'MR'],
		['R006', 'WOODHAVEN BLVD', 40.693866, -73.851568,' BMT', 'JZ'],
		['R384', 'BOYD-88 ST', 40.679857, -73.851492,' IND', 'A'],
		['R106', 'CASTLE HILL AVE', 40.834255, -73.851222,' IRT', '6'],
		['R145', 'WAKEFIELD-241', 40.903085, -73.850591,' IRT', '2'],
		['R326', 'ZEREGA AVE', 40.83646, -73.846471,' IRT', '6'],
		['R328', 'METS-WILLETS PT', 40.754622, -73.845625,' IRT', '7'],
		['R141', 'FOREST HILLS-71', 40.721681, -73.84439,' IND', 'EFMR'],
		['R007', '104 ST', 40.695184, -73.844326,' BMT', 'JZ'],
		['R385', 'ROCKAWAY BLVD', 40.680429, -73.843853,' IND', 'A'],
		['R107', 'WESTCHESTER SQ', 40.839892, -73.842952,' IRT', '6'],
		['R292', 'BAYCHESTER AVE', 40.878656, -73.838596,' IRT', '5'],
		['R354', 'OXFORD-104 ST', 40.681745, -73.837631,' IND', 'A'],
		['R419', 'ROCKAWAY PK 116', 40.580454, -73.837459,' IND', 'AS'],
		['R341', '75 AVE', 40.718477, -73.837223,' IND', 'EF'],
		['R427', 'MIDDLETOWN ROAD', 40.843635, -73.836687,' IRT', '6'],
		['R008', '111 ST', 40.697405, -73.836354,' BMT', 'J'],
		['R357', 'AQUEDUCT-N CNDT', 40.668234, -73.834058,' IND', 'A'],
		['R464', 'AQUEDUCT TRACK', 40.668221, -73.834026,' IND', 'A'],
		['R428', 'BUHRE AVE', 40.846817, -73.832545,' IRT', '6'],
		['R355', 'GREENWOOD-111', 40.684364, -73.832181,' IND', 'A'],
		['R158', 'UNION TPK-KEW G', 40.714444, -73.830979,' IND', 'EF'],
		['R431', 'DYRE AVE', 40.888244, -73.83085,' IRT', '5'],
		['R414', 'HOWARD BCH-JFK', 40.660476, -73.830301,' IND', 'A'],
		['R535', 'JFK HOWARD BCH', 40.660476, -73.830301,' IND', 'A'],
		['R055', 'MAIN ST', 40.759578, -73.830056,' IRT', '7'],
		['R009', '121 ST', 40.700536, -73.828382,' BMT', 'JZ'],
		['R429', 'PELHAM BAY PARK', 40.852465, -73.828125,' IRT', '6'],
		['R459', 'ORCHARD BEACH', 40.852417, -73.828082,' IND', '6'],
		['R418', 'BEACH 105 ST', 40.583542, -73.82643,' IND', 'AS'],
		['R356', 'LEFFERTS BLVD', 40.685975, -73.824713,' IND', 'A'],
		['R255', 'VAN WYCK BLVD', 40.709174, -73.820593,' IND', 'EF'],
		['R417', 'BEACH 98 ST', 40.585514, -73.820143,' IND', 'AS'],
		['R342', 'JAMAICA-VAN WYC', 40.702566, -73.816859,' IND', 'E'],
		['R415', 'BROAD CHANNEL', 40.608693, -73.816068,' IND', 'AS'],
		['R416', 'BEACH 90 ST', 40.588032, -73.813684,' IND', 'AS'],
		['R128', 'SUTPHIN BLVD', 40.705416, -73.810562,' IND', 'F'],
		['R024', 'SUTPHIN BLVD', 40.700488, -73.807933,' IND', 'EJZ'],
		['R114', 'PARSONS BLVD', 40.707564, -73.803326,' IND', 'F'],
		['R025', 'JAMAICA CENTER', 40.702131, -73.80111,' IND', 'EJZ'],
		['R335', 'BEACH 67 ST', 40.590867, -73.797011,' IND', 'A'],
		['R115', '169 ST', 40.710459, -73.7936,' IND', 'F'],
		['R336', 'BEACH 60 ST', 40.592334, -73.788493,' IND', 'A'],
		['R019', 'JAMAICA-179 ST', 40.712622, -73.783815,' IND', 'F'],
		['R536', 'JFK JAMAICA CT1', 40.643942, -73.782356,' IND', 'E'],
		['R537', 'JFK JAMAICA CT2', 40.643942, -73.782356,' IND', 'E'],
		['R337', 'BEACH 44 ST', 40.593214, -73.776433,' IND', 'A'],
		['R338', 'BEACH 36 ST', 40.595381, -73.768194,' IND', 'A'],
		['R358', 'BEACH 25 ST', 40.600138, -73.76152,' IND', 'A'],
		['R285', 'FAR ROCKAWAY', 40.603983, -73.755383,' IND', 'A'],
		['R253', '174-175 ST', 40.845892, -73.910136,' IND', 'BD'],
		['R001', 'WHITEHALL ST / SOUTH FERRY', 40.703082, -74.012983,' BMT / IRT', '1NR'],
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
        
        // spidering
        var oms = new OverlappingMarkerSpiderfier(map);
        var iw = new google.maps.InfoWindow();
        
		oms.addListener('click', function(marker, event) {
  			iw.setContent('<strong>'+ marker.desc + '</strong><br>'+ marker.trains);
  			iw.open(map, marker);
  			//marker.setIcon('http://geotest.jit.su/assets/marker-red.png');
  			
  			// onclick, set remote code for form & chart title
			$("#fremote").val( marker.remoteCode );
			ttitle = marker.desc;
			ttrains = marker.trains;
		});
				
		oms.addListener('spiderfy', function(markers) {
  			iw.close();
		});

        for (var i = 0; i < locations.length; i ++) {
  			var marker = new google.maps.Marker({
    			position: new google.maps.LatLng(locations[i][2], locations[i][3]),
    			title: locations[i][1]+" - "+locations[i][0],
    			map: map,
    			icon: 'https://s3.amazonaws.com/uploads.hipchat.com/35126/241085/7xg6krkwgnhzaww/blue_75.png'
    			//icon: 'http://geotest.jit.su/assets/marker-red.png'
  			});
  			marker.desc = locations[i][1]+" - "+locations[i][0];
  			marker.title = locations[i][1]+" - "+locations[i][0];
  			marker.remoteCode = locations[i][0];
  			marker.division = locations[i][4];
  			marker.trains = trains(locations[i][5]);
  			oms.addMarker(marker);  
		}        
      }
google.maps.event.addDomListener(window, 'load', initialize);

var ttitle;

function trains(trainlist){

	var trains = jQuery.map((trainlist + '').split(''), function(n) {
	  return '<img style="vertical-align:text-top;" src="http://www.mta.info/siteimages/subwaybullets/' + n.toLowerCase() + '.png">'
	});
	
	trains = trains.join('');
	//console.log(trains);
	return trains;
}
