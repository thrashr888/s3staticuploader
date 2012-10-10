(function($, window, s3u){

    // localize our settings
    var bucket = s3u.bucket,
        AWSAccessKeyId = s3u.AWSAccessKeyId,
        policy = s3u.policy,
        signature = s3u.signature,
        key = s3u.key;

    // cache selectors
    var self = this,
        $form = $('#uploader'),
        $clear = $('a[data-action="clear"]'),
        $dropbox = document.getElementById("dropbox"), // uses native JS api for dragdrop
        $progress = $(".progress"),
        files = null,
        domain = bucket + '.s3.amazonaws.com',
        acl = "public-read",
        clippy = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14" id="clippy" ><param name="movie" value="/flash/clippy.swf"/><param name="allowScriptAccess" value="always" /><param name="quality" value="high" /><param name="scale" value="noscale" /><param NAME="FlashVars" value="text=#{text}"><param name="bgcolor" value="#FFFFFF"><embed src="/flash/clippy.swf" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text=#{text}" bgcolor="#FFFFFF" /></object>';

    // wrapper api for storage
    var linkStorage = {
        add: function(url) {
            var urls = this.read();
            urls.unshift(url);
            localStorage['s3uploader'] = JSON.stringify(urls);
        },
        read: function() {
            return JSON.parse(localStorage['s3uploader'] || "[]") || [];
        },
        reset: function() {
            localStorage['s3uploader'] = [];
        }
    };

    // build our html links
    var makeLink = function(url) {
        // be careful about spaces in urls
        url = url.replace(/\s/g, "%20");
        var url_name = url.replace('http://' + domain, '');
        return "<a href=" + url.replace(/%/g, "%25") + " target='_blank'>" + url_name + "</a>&nbsp;" + clippy.replace(/\#\{text\}/gi, url) + "<br />";
    };
    
    // display saved links
    var links = linkStorage.read();
    var links_out = "";
    for(var i = 0; i < links.length; i++) {
        links_out += makeLink(links[i]);
    }
    $('#filename').html(links_out);
    
    // clear out link list
    $clear.click(function(e){
        linkStorage.reset();
        $('#filename').html("");
        e.preventDefault();
        $(this).blur();
    });
    
    // uploder form submission
    $form.submit(function(e){

        // console.log(e);
        var ev = e.originalEvent,
            xhr = new XMLHttpRequest(),
            fd = new FormData(),
            $file = document.getElementById('file').files[0] || files[0];
        var exp = $('select[name="expires"]').val() || 1;
        var key = "u/d" + exp + '/' + Math.round((new Date()).getTime() / 1000) + '/' + $file.name.replace(/\s/g, "%20");
        var file_url = 'http://' + domain + '/' + key;
        
        // Populate the Post paramters.
        fd.append('AWSAccessKeyId', AWSAccessKeyId);
        fd.append('acl', acl);
        fd.append('policy', policy);
        fd.append('signature',signature);
        fd.append('key', key);
        fd.append('Content-Type', $file.type);
        fd.append('file', $file);

        // update the form. if there's any js errors, it will just POST as normal.
        $form.attr('action', 'https://' + domain);
        $form.find('input[name="AWSAccessKeyId"]').val(AWSAccessKeyId);
        $form.find('input[name="acl"]').val(acl);
        $form.find('input[name="policy"]').val(policy);
        $form.find('input[name="signature"]').val(signature);
        $form.find('input[name="key"]').val(key);
        $form.find('input[name="Content-Type"]').val($file.type);

        // var form_data = $("#uploader").serializeArray();
        // console.log(form_data);

        // return; // Return here to let the form POST as normal. Helps with debugging.
        
        //console.log('fd', fd);
        //console.log('$file', $file);

        // the progress bar
        xhr.upload.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                //console.log(percentComplete.toString());
                $progress.show().find(".bar").css({width: percentComplete.toString() + '%'});
            }
        }, false);
        
        // set up event handlers for ajax request
        xhr.addEventListener("load", function(e) {
            // success
            //console.log('done', e);
            linkStorage.add(file_url);
            $('#filename').prepend(makeLink(file_url));
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);
        xhr.addEventListener("error", function(e) {
            // sometimes S3 throws errors (303) but still works, so we create the link anyway
            //console.log('failed', e);
            linkStorage.add(file_url);
            $('#filename').prepend(makeLink(file_url));
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);
        xhr.addEventListener("abort", function(e) {
            //console.log('cancelled', e);
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);

        xhr.open('POST', 'https://' + domain, true); //MUST BE LAST LINE BEFORE YOU SEND
        xhr.send(fd);
        //console.log('xhr', xhr);
        
        e.preventDefault();
    });
    
    // enable drag and drop
    $dropbox.addEventListener("dragenter", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $($dropbox).css({backgroundColor: "#CCC"});
    }, false);
    $dropbox.addEventListener("dragover", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $($dropbox).css({backgroundColor: "#CCC"});
    }, false);
    
    $dropbox.addEventListener("drop", function(e) {
        e.stopPropagation();
        e.preventDefault();
        $($dropbox).css({backgroundColor: "#DDD"});
        
        var dt = e.dataTransfer;
        files = dt.files;
        
        //console.log('dropped', files);
        
        var file_size = Math.round(files[0].size * 10 / 1024) / 10;
        $($dropbox).html("Dropped " + files[0].name + ' ' + file_size + ' KB');
        
        $form.submit();
    }, false);

})(jQuery, window, window.s3u);
