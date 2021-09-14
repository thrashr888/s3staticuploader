#! /usr/bin/env python

# Deploy tool for s3staticuploader
#
# - Creates new bucket with Website, CORS, Lifecycle and ACl settings
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
from boto.s3.lifecycle import Lifecycle
from boto.s3.lifecycle import Rule
from boto.exception import S3ResponseError

print("Usage: deploy.py BUCKET_NAME AWS_ACCESS_KEY AWS_SECRET_KEY\n")

if sys.argv.__len__() < 4:
    quit()

bucket_name = sys.argv[1]
aws_access_key = sys.argv[2]
aws_secret_key = sys.argv[3]
region = 's3-website-us-east-1.amazonaws.com'  # hard-coded for now

# set up initial connection details to S3
conn = S3Connection(aws_access_key, aws_secret_key)

# only set up if bucket doesn't already exist
try:
    bucket = conn.get_bucket(bucket_name, True)
    print("Using bucket `%s`" % (bucket_name))

except S3ResponseError:
    bucket = False
    print("Bucket doesn't exist `%s`" % (bucket_name))

if not bucket:

    print("Creating new bucket `%s`..." % (bucket_name))

    bucket = conn.create_bucket(bucket_name)
    bucket.configure_website('index.html')

    print("Adding CORS settings...")

    cors_cfg = CORSConfiguration()
    cors_cfg.add_rule(['PUT', 'POST', 'DELETE'], 'http://' + bucket_name + '.' + region,
                      allowed_header='*', max_age_seconds=3000, expose_header='x-amz-server-side-encryption')
    cors_cfg.add_rule(['PUT', 'POST', 'DELETE'], 'http://localhost', allowed_header='*',
                      max_age_seconds=3000, expose_header='x-amz-server-side-encryption')
    cors_cfg.add_rule('GET', '*')
    bucket.set_cors(cors_cfg)

    print("Adding Lifecycle settings...")

    lifecycle_cfg = Lifecycle()
    lifecycle_cfg.add_rule('d1', 'u/d1/', 'Enabled', 1)
    lifecycle_cfg.add_rule('d2', 'u/d2/', 'Enabled', 2)
    lifecycle_cfg.add_rule('d3', 'u/d3/', 'Enabled', 3)
    lifecycle_cfg.add_rule('d4', 'u/d4/', 'Enabled', 4)
    lifecycle_cfg.add_rule('d5', 'u/d5/', 'Enabled', 5)
    lifecycle_cfg.add_rule('d6', 'u/d6/', 'Enabled', 6)
    lifecycle_cfg.add_rule('d7', 'u/d7/', 'Enabled', 7)
    lifecycle_cfg.add_rule('d14', 'u/d14/', 'Enabled', 14)
    lifecycle_cfg.add_rule('d30', 'u/d30/', 'Enabled', 30)
    bucket.configure_lifecycle(lifecycle_cfg)

print("Uploading site files...")

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
    print(k.key)

website_endpoint = bucket.get_website_endpoint()
print(
    "\nDone! Website deployed to:\n\n\033[1;32mhttp://%s/\033[0m\n" % (website_endpoint))
