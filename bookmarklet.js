(function() {

	var hosting = 'https://ajax.googleapis.com/ajax/libs/',
		tabsToOpen = {
			'http://host' : [80],
			'http://another.host' : [80, 8080]
		};

	if (window.jQuery) {
		loadJQueryUi(execute);
	} else {
		loadScript(hosting + 'jquery/1/jquery.min.js', function() {
			jQuery.noConflict();
			loadJQueryUi(execute);
		});
	}

	function loadJQueryUi(callback) {
		if (jQuery.dialog) {
			callback();
		} else {
			loadStylesheet(hosting + 'jqueryui/1.8/themes/cupertino/jquery-ui.css')
			loadScript(hosting + 'jqueryui/1/jquery-ui.min.js', callback);
		}
	}

	function loadScript(url, callback) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;
		script.onload = callback;
		document.body.appendChild(script);
	}

	function loadStylesheet(url) {
		jQuery('<link>').attr({
			type : 'text/css',
			rel : 'stylesheet',
			href : url
		}).appendTo(jQuery('head'));
	}

	function execute() {
		getDialog(tabsToOpen, location.pathname + location.search)
			.dialog('open');
	}

	function getDialog(tabsToOpen, path) {
		var $dialog = jQuery('#rrb');
		if($dialog.size() == 0) {
			$dialog = jQuery('<div id="rrb" style="display:none;">');
			var $buttonset, currId, currValue, $buttonsets = jQuery([]);
			for(var hostname in tabsToOpen) {
				$buttonset = jQuery('<fieldset class="buttonset" id="rrb-buttonset-'
					+ hostname + '"><legend>' + hostname + '</legend></fieldset>');
				for(var ii = 0; ii < tabsToOpen[hostname].length; ii++) {
					currValue = hostname + ':' + tabsToOpen[hostname][ii];
					currId = 'rrb-' + currValue;
					$buttonset
						.append('<input type="checkbox" value="' + currValue + '" id="' + currId + '"/>')
						.append('<label for ="' + currId + '">' + tabsToOpen[hostname][ii] + '</label>');
				}
				$buttonsets = $buttonsets.add($buttonset);
			}
			$buttonsets.buttonset();
			jQuery('<form>').append($buttonsets).appendTo($dialog)
			$dialog.dialog({
				height : 'auto',
				width : 'auto',
				title : 'Select the URLs to open',
				buttons : {
					'Open windows' : function() {
						jQuery('fieldset.buttonset').each(function() {
							jQuery(this).find('input:checked').each(function() {
								window.open(jQuery(this).val() + path);
							});
						});
						jQuery(this).dialog('close');
					},
					Cancel : function() {
						jQuery(this).dialog('close');
					}
				}
			});
		}
		return $dialog;
	}

})();