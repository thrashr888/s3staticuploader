#! /usr/bin/env python

# Deploy tool for s3staticuploader
#
# - Creates new bucket with website, CORS and ACl settings
# - Only copies required files
#
# Copyright 2012 Paul Thrasher
# MIT License

import os
import sys

from boto.s3.connection import S3Connection
from boto.s3.cors import CORSConfiguration
from boto.s3.key import Key
from boto.s3.acl import CannedACLStrings

print "Usage: deploy.py BUCKET_NAME AWS_ACCESS_KEY AWS_SECRET_KEY\n"

if sys.argv.__len__() < 4:
    quit()

bucket_name = sys.argv[1]
aws_access_key = sys.argv[2]
aws_secret_key = sys.argv[3]
region = 's3-website-us-east-1.amazonaws.com'

# create a new bucket if not exists
conn = S3Connection(aws_access_key, aws_secret_key)

# only set up if bucket doesn't already exist
bucket = conn.get_bucket(bucket_name, False)
if not bucket:
    print "Create new bucket `%s`..." % (bucket_name)

    bucket = conn.create_bucket(bucket_name)
    bucket.configure_website('index.html')

    print "Add CORS settings..."

    cors_cfg = CORSConfiguration()
    cors_cfg.add_rule(['PUT', 'POST', 'DELETE'], 'http://' + bucket_name + '.' + region, allowed_header='*', max_age_seconds=3000, expose_header='x-amz-server-side-encryption')
    cors_cfg.add_rule('GET', '*')
    bucket.set_cors(cors_cfg)

print "Uploading site files..."

# Only upload the files we need
files = [
['./', 'index.html'],
['./css/', 'bootstrap.min.css'],
['./css/', 'bootstrap-responsive.min.css'],
['./css/', 'main.css'],
['./js/', 'main.js'],
['./js/', 'moment.min.js'],
['./js/', 'settings.js'],
['./js/vendor/', 'bootstrap.min.js'],
['./js/vendor/', 'jquery-1.8.2.min.js'],
['./js/vendor/', 'modernizr-2.6.1.min.js'],
['./flash/', 'clippy.swf'],
]

matches = []
for root, filename in files:
    file = os.path.join(root, filename)
    k = Key(bucket)
    k.key = file.replace("./", "")
    k.set_contents_from_filename(file, policy=CannedACLStrings[1])
    print k.key

website_endpoint = bucket.get_website_endpoint()
print "\nDone! Website deployed to:\n\n\033[1;32mhttp://%s/\033[0m\n" % (website_endpoint)
