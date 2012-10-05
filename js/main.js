(function($, window){

    var self = this,
        $form = $('#uploader'),
        $clear = $('a[data-action="clear"]'),
        $dropbox = document.getElementById("dropbox"),
        $progress = $(".progress"),
        $progressNumber = $('#progressNumber'),
        files = null,
        domain = bucket + '.s3.amazonaws.com',
        acl = "public-read",
        clippy = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="110" height="14" id="clippy" ><param name="movie" value="/flash/clippy.swf"/><param name="allowScriptAccess" value="always" /><param name="quality" value="high" /><param name="scale" value="noscale" /><param NAME="FlashVars" value="text=#{text}"><param name="bgcolor" value="#EEEEEE"><embed src="/flash/clippy.swf" width="110" height="14" name="clippy" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" FlashVars="text=#{text}" bgcolor="#EEEEEE" /></object>';

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
    var makeLink = function(url) {
        url = url.replace(/\s/g, "%20");
        return "<a href=" + url.replace(/%/g, "%25") + " target='_blank'>" + url + "</a>&nbsp;" + clippy.replace(/\#\{text\}/gi, url) + "<br />";
    };
    
    var links = linkStorage.read();
    var links_out = "";
    for(var i = 0; i < links.length; i++) {
        links_out += makeLink(links[i]);
    }
    $('#filename').html(links_out);
    
    $clear.click(function(e){
        linkStorage.reset();
        $('#filename').html("");
        e.preventDefault();
        $(this).blur();
    });
    
    $form.submit(function(e){

        //console.log(e);
        var ev = e.originalEvent;
        var expiration = moment().add('days', 1).format('YYYY-MM-DD\\THH:mm:ss\\Z');

        var xhr = new XMLHttpRequest(),
            fd = new FormData(),
            exp = moment().add('days', 1).unix(),
            $file = document.getElementById('file').files[0] || files[0];
        var key = "u/" + moment().unix() + '-' + $file.name.replace(/\s/g, "%20");
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
        
        //console.log('fd', fd);
        //console.log('$file', $file);

        xhr.upload.addEventListener("progress", function(evt){
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                //console.log(percentComplete.toString());
                $progressNumber.html(percentComplete.toString() + '%');
                $progress.show().find(".bar").css({width: percentComplete.toString() + '%'});
            }
            else {
                $progressNumber.html('unable to compute');
            }
        }, false);
        
        
        xhr.addEventListener("load", function(e) {
            //console.log('done', e);
            linkStorage.add(file_url);
            $('#filename').prepend(makeLink(file_url));
            $progressNumber.html("");
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);
        xhr.addEventListener("error", function(e) {
            //console.log('failed', e);
            linkStorage.add(file_url);
            $('#filename').prepend(makeLink(file_url));
            $progressNumber.html("");
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);
        xhr.addEventListener("abort", function(e) {
            //console.log('cancelled', e);
            $progressNumber.html('cancelled');
            $($dropbox).html("Or drop here.");
            $progress.hide().find(".bar").css({width: 0});
        }, false);

        xhr.open('POST', 'https://' + domain, true); //MUST BE LAST LINE BEFORE YOU SEND
        xhr.send(fd);
        //console.log('xhr', xhr);
        
        e.preventDefault();
    });
    
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
        
        $($dropbox).html("Dropped " + files[0].name);
        
        $form.submit();
    }, false);

})(jQuery, window);
