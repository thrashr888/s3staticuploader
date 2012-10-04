(function($, window){

	var $form = $('#uploader'),
		domain = bucket + '.s3.amazonaws.com',
		acl = "public-read";

	$form.submit(function(e){

		console.log(e);
		var ev = e.originalEvent;
		var expiration = moment().add('days', 1).format('YYYY-MM-DD\\THH:mm:ss\\Z');

		var xhr = new XMLHttpRequest(),
			fd = new FormData(),
			exp = moment().add('days', 1).unix(),
			$file = document.getElementById('file').files[0],
			key = "u/" + moment().unix() + '-' + file.name;
		
		var file_url = 'http://' + domain + '/' + key;

		// Populate the Post paramters.
		fd.append('key', key);
		fd.append('AWSAccessKeyId', AWSAccessKeyId);
		fd.append('acl', acl);
		fd.append('policy', policy);
		fd.append('signature',signature);
		fd.append('Content-Type', $file.type);
		fd.append('file', $file);
		
		// update the form. if there's any js errors, it will just POST as normal.
		$form.attr('action', 'https://' + domain);
		$form.find('input[name="key"]').val(key);
		$form.find('input[name="AWSAccessKeyId"]').val(AWSAccessKeyId);
		$form.find('input[name="acl"]').val(acl);
		$form.find('input[name="policy"]').val(policy);
		$form.find('input[name="signature"]').val(signature);
		$form.find('input[name="Content-Type"]').val($file.type);

		// return; // Return here to let the form POST as normal. Helps with debugging.
		
		console.log('fd', fd);
		console.log('$file', $file);

		xhr.upload.addEventListener("progress", function(evt){
			if (evt.lengthComputable) {
				var percentComplete = Math.round(evt.loaded * 100 / evt.total);
				document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
			}
			else {
				document.getElementById('progressNumber').innerHTML = 'unable to compute';
			}
		}, false);
		
		xhr.addEventListener("load", function(e) {
			console.log('done', e);
			$('#filename').html("Url: <a href=' + file_url + ' target='_blank'>" + file_url + "</a>");
		}, false);
		xhr.addEventListener("error", function(e) {
			console.log('failed', e);
			$('#filename').html("Url: " + file_url);
		}, false);
		xhr.addEventListener("abort", function(e) {
			console.log('cancelled', e);
			$('#filename').html("Url: " + file_url);
		}, false);

		xhr.open('POST', 'https://' + domain, true); //MUST BE LAST LINE BEFORE YOU SEND
		xhr.send(fd);
		console.log('xhr', xhr);
		
		e.preventDefault();
	});

})(jQuery, window);
