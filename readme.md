# s3staticuploader

A HTML5, S3-hosted app for uploading files to S3 using CORS.

## Usage

1) (Create a new S3 bucket)[https://console.aws.amazon.com/s3/home] in the `US Standard` region.
1a) Click the `Properties` button, then `Add more permissions`, and add `View Permissions` to `Everyone` and `Save`.
1b) In the `Website` tab, tick the `Enabled` checkbox and set the `Index Document` to `index.html`. Click the `Save` button. The `Endpoint` url is what you will use to view your uploader site, you'll want to open that url in a new tab or window.
1c) Back in the `Permissions` tab, click on `Edit CORS Configuration` and place this config in the text area, replacing `<bucket-name>` with the name of your bucket:

    <?xml version="1.0" encoding="UTF-8"?>
    <CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
        <CORSRule>
            <AllowedOrigin>
                http://<bucket-name>.s3-website-us-east-1.amazonaws.com
            </AllowedOrigin>
            <AllowedMethod>PUT</AllowedMethod>
            <AllowedMethod>POST</AllowedMethod>
            <AllowedMethod>DELETE</AllowedMethod>
            <AllowedHeader>*</AllowedHeader>
        </CORSRule>
        <CORSRule>
            <AllowedOrigin>*</AllowedOrigin>
            <AllowedMethod>GET</AllowedMethod>
        </CORSRule>
    </CORSConfiguration>

You're done setting up S3.

2) Use the policy generator to generate the strings you will place in `index.html`.

    python policy.py <bucket-name> <aws_secret_key> <key>

3) Update the strings at the bottom of `index.html`:

    var bucket = "<bucket>",
        AWSAccessKeyId = "<AWSAccessKeyId>",
        policy = "<policy>",
        signature = "<signature>";

4) Upload `index.html` and the `css`, `img`, and `js` folders to the new S3 bucket you created. You can now view the site and upload files.

## Currently hardcoded settings

I still need to clean this up.

* `"u/"` as the key prefix or folder name.
* Uses the S3 default `US Standard` region `s3-website-us-east-1.amazonaws.com`.

## Issues & debugging S3 CORS uploads

Uploading should work fine. Post an issue on GitHub or send a pull request and I can add the fix. If you have trouble debugging S3 uploading, you can un-comment the `return;` in `main.js` to let the form POST as usual. The `s3.amazonaws.com` site can be helpful with debugging.

## TODO

* Get expiration working
* Keep history of uploads in localStorage
* Write setup script that updates the html files and pushes to S3

## MIT License

Copyright (C) 2012 Paul Thrasher

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.