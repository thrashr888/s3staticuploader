#! /usr/bin/env python

# Policy Generator for S3 CORS
#
# - Key strings passed to this file considered sensitive
# - Writes S3 policy strings to new file js/settings.js
#
# Copyright 2012 Paul Thrasher
# MIT License

import base64
import hmac
import sys
import hashlib

print(
    "Usage: policy.py BUCKET_NAME AWS_ACCESS_KEY AWS_SECRET_KEY [KEY] [MAX_MEGABYTES] [ACL]\n")

if sys.argv.__len__() < 4:
    quit()

bucket_name = sys.argv[1]
aws_access_key = sys.argv[2]
aws_secret_key = sys.argv[3]
key = sys.argv[4] if sys.argv.__len__() >= 5 else "u/"
# 5mb default. convert to bytes.
content_length_range = int(
    float(sys.argv[5]) * 1048576) if sys.argv.__len__() >= 6 else 5242880
acl = sys.argv[6] if sys.argv.__len__() >= 7 else "public-read"

# build the policy string
policy_document = """{"expiration": "2020-01-01T00:00:00Z",
  "conditions": [
    ["eq", "$bucket", "%s"],
    ["starts-with", "$key", "%s"],
    {"acl": "%s"},
    ["starts-with", "$Content-Type", ""],
    ["content-length-range", 2, %s]
  ]
}""" % (bucket_name, key, acl, content_length_range)

policy = base64.b64encode(bytes(policy_document.replace('\n', ''), 'utf-8'))

signature = base64.b64encode(
    hmac.new(bytes(aws_secret_key, 'utf-8'),
             policy,
             hashlib.sha256).digest()
)

# build JS settings to write to file
settings = """window.s3u = {};
window.s3u.bucket = "%s";
window.s3u.AWSAccessKeyId = "%s";
window.s3u.policy = "%s";
window.s3u.signature = "%s";
window.s3u.key = "%s";""" % (bucket_name, aws_access_key, policy, signature, key)

# print everything out
print("policy_document:\n" + policy_document + "\n")
print("policy:\n" + str(policy) + "\n")
print("signature:\n" + str(signature) + "\n")
print("settings:\n" + settings + "\n")

# update the file
f = open('js/settings.js', 'w')
f.write(settings)

print("Saved to js/settings.js.\n")
