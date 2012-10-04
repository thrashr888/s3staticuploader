import base64
import hmac
import sha
import sys

bucket = sys.argv[1]
aws_secret_key = sys.argv[2]
key = sys.argv[3]

policy_document = """{"expiration": "2020-01-01T00:00:00Z",
  "conditions": [
    ["eq", "$bucket", "%s"],
    ["starts-with", "$key", "%s"],
    {"acl": "public-read"},
    ["starts-with", "$Content-Type", ""],
    ["content-length-range", 0, 1048576]
  ]
}""" % (bucket, key)

policy = base64.b64encode(policy_document.replace('\n', ''))

signature = base64.b64encode(
    hmac.new(aws_secret_key, policy, sha).digest())

print "Usage: python policy.py <bucket-name> <aws_secret_key> <key>\n"

print "policy_document:\n" + policy_document + "\n"

print "policy:\n" + policy + "\n"

print "signature:\n" + signature + "\n"
