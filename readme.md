# ![s3staticuploader logo](http://thrashr888-tests3upper.s3.amazonaws.com/u/d7/1349862973/s3staticuploader-logo.gif "s3staticuploader logo")

A HTML5, S3-hosted app for uploading files to S3 using [CORS](http://docs.amazonwebservices.com/AmazonS3/latest/dev/cors.html).

## Warning

This app allows anyone with access to the url to upload files to your S3 bucket. [Standard S3 charges](http://aws.amazon.com/s3/pricing/) will apply. This is **non-free**.

## Screenshot

![s3staticuploader screenshot](http://thrashr888-tests3upper.s3.amazonaws.com/u/d7/1349862986/S3%2520Static%2520Uploader%252010:10:12%25202:52%2520AM.png "s3staticuploader screenshot")

## Installation

0) Clone this repo to your computer.

    $ git clone git://github.com/thrashr888/s3staticuploader.git
    $ cd s3staticuploader

1) Use the policy generator `policy.py` in this repo to generate the strings you will place in `index.html`. `<key>` is the folder name you want to use, ex. `u/`. The script will create and update the file `js/settings.js` for you.

    $ ./policy.py BUCKET_NAME AWS_ACCESS_KEY AWS_SECRET_KEY [KEY] [MAX_MEGABYTES]

2) Use the deploy script to create and set up your new site and upload it to S3. *NOTE: This script will only copy the files included in this repo needed for the site, and overwrite existing files with the same name.*

\* Requires Python installed with [pip](http://www.pip-installer.org/en/latest/installing.html).

    $ [ -x `which pip` ] || curl https://raw.github.com/pypa/pip/master/contrib/get-pip.py | python # install pip if unavailable
    $ pip install boto # installs the `boto` package for accessing Amazon Web Services
    $ ./deploy.py BUCKET_NAME AWS_ACCESS_KEY AWS_SECRET_KEY

## Issues & debugging S3 CORS uploads

Uploading should work fine. Post an issue on GitHub or send a Pull Pequest and I can add the fix or otherwise try to help. If you have trouble debugging S3 uploading, you can un-comment the `return;` in `main.js` to let the form POST as usual. The `s3.amazonaws.com` url can be helpful with debugging when POSTing to it.

More info:

* [http://docs.amazonwebservices.com/AmazonS3/latest/dev/cors.html](http://docs.amazonwebservices.com/AmazonS3/latest/dev/cors.html)

## TODO & Contributing

TODO list in [GitHub Issues](https://github.com/thrashr888/s3staticuploader/issues). Please don't hesitate to submit an Issue or Pull Request.

## Special Thanks

Idea thanks to the defunct [senduit.com](http://senduit.com). Made possible by Amazon's S3 service. Uses code from Twitter Bootstrap and HTML5 Boilerplate, naturally. Also inspired by the idea of *Software-with-a-Service*, as mentioned in the [Skypipe CLI tool](https://github.com/progrium/skypipe), "we can now build software leveraging features of software as a service that is packaged and distributed like normal open source software."

## MIT License

Copyright (C) 2012 Paul Thrasher

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.