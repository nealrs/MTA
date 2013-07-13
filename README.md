<<<<<<< HEAD
Based on Chris Whong's <a href="https://github.com/louiedog98/nycturnstiles">original project</a>, these scripts take <a href="http://www.mta.info/developers/turnstile.html">raw MTA turnstile data files</a> and  generate plot ready data for charting turnstile traffic at any station. And yep, an online interface is next on the docket - so stay tuned!

<ul>

  <li><strong>load_db.rb</strong> takes a raw <a href="https://github.com/nealrs/MTA-Turnstile-Data/blob/master/example/turnstile_130209.txt">turnstile file</a>, strips out non-'REGULAR' audit events, and stores it in a MySQL database. Obviously - you'll want to change the db parameters to reflect your own.</li> 

	<li><strong>get_data.rb</strong> takes 3 parameters: remoteUnit code, start, and end date, (e.g './get_data.rb R021 2013-02-02 2013-02-08' for Bryant Park), queries the db, and exports two data files: 

	<ol>
		<li>A <a href="https://github.com/nealrs/MTA/blob/db/example/R021_2013-02-02_2013-02-09.csv">CSV</a> summary of the cumulative entry & exit traffic for each audit event. Paste this into the included <a href="https://github.com/nealrs/MTA-Turnstile-Data/blob/master/plot_template.xlsx">spreadsheet</a> to create charts like the one shown below.</li>
		
		<li>A <a href="https://github.com/nealrs/MTA/blob/db/example/chartdata_R021_2013-02-02_2013-02-09.csv">CSV</a> of plot ready data suitable for any charting software/API.</li>
	</ol>
	
	</li>

</ul>

<strong>Note:</strong> Because the scripts strip non-'REGULAR' & off-hour audit events, there are a few issues with the resulting data (notice how there is some data missing for Thursday?) - but I'm working on it!

![r021_13_02_09_plot](https://raw.github.com/nealrs/MTA/master/example/R021_13_02_09_plot%20copy.png)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/nealrs/MTA/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

=======
Create charts & data tables using <a href="http://www.mta.info/developers/turnstile.html" target="_blank">MTA Turnstile data</a>. 
	<br/><a href="http://nealshyam.com/mta">The live app is here</a>. Select a station code & time range to get started.
	<p>In case you're wondering, I'm <a href="nealshyam.com" target="_blank">Neal Shyam</a> and I like to make <a href="http://nealrs.github.io/LegalGrep" target="_blank">things</a>. You can find me on <a href="https://twitter.com/nealrs" target="_blank">Twitter</a> & <a href="https://github.com/nealrs/" target="_blank">Github</a>. Want this code? <a href="https://github.com/nealrs/MTA" target="_blank">It's all yours</a>.
	<p>This app is made possible by: 
	<ul>
		<li><a href="http://adstruc.com" target="_blank">Team ADstruc</a></li>
		<li><a href="https://github.com/louiedog98/nycturnstiles" target="_blank">Chris Whong's NYC Turnstile Ruby project</a></li>
		<li><a href="http://www.mta.info/developers/" target="_blank">MTA Developer Resources</a></li>
		<li><a href="http://github.com" target="_blank">Github</a></li>
		<li><a href="http://twitter.github.io/bootstrap/" target="_blank">Bootstrap</a></li> 
		<li><a href="http://momentjs.com/" target="_blank">Moment.js</a></li> 
		<li><a href="https://github.com/dangrossman/bootstrap-daterangepicker" target="_blank">Bootstrap Date Range Picker</a></li>
		<li><a href="http://d3js.org/" target="_blank">D3.js</a></li> 
		<li><a href="http://tenxer.github.io/xcharts/" target="_blank">xCharts</a></li>
		<li><a href="http://jquery.com/" target="_blank">jQuery</a></li>
		<li><a href="http://fortawesome.github.io/Font-Awesome/" target="_blank">Font-Awesome</a></li>
		<li><a href="http://mysql.com" target="_blank">MySQL</a></li>
		<li><a href="http://us.php.net" target="_blank">PHP</a></li>
		<li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript?redirectlocale=en-US&redirectslug=JavaScript" target="_blank">Javascript</a></li>
		<li><a href="http://stackoverflow.com" target="_blank">StackOverflow</a></li>
	</ul>
>>>>>>> ui
