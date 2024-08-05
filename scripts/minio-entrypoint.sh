#!/bin/bash
ALIAS="jimmodelminio"
MINIO_URL="http://minio:9000"
# server /data --console-address ":9001"  


# Set up aliases
mc alias set ${ALIAS} ${MINIO_URL} ${MINIO_ROOT_USER} ${MINIO_ROOT_PASSWORD}

# Create the bucket if doesn't exist
mc mb ${ALIAS}/${BUCKET_NAME} --ignore-existing

	

# Create the policy file for readwrite access to the bucket
cat > /tmp/readwrite-jimmodel.json <<EOF
{
 "Version": "2012-10-17",
 "Statement": [
  {
   "Effect": "Allow",
   "Action": [
    "admin:*"
   ]
  },
  {
   "Effect": "Allow",
   "Action": [
    "kms:*"
   ]
  },
  {
   "Effect": "Allow",
   "Action": [
    "s3:*"
   ],
      "Resource": [
        "arn:aws:s3:::${BUCKET_NAME}",
        "arn:aws:s3:::${BUCKET_NAME}/*"
      ]
  }
 ]
}
EOF

mc admin user svcacct add \
	--access-key ${ACCESS_KEY} \
	--secret-key ${SECRET_KEY} \
	--policy /tmp/readwrite-jimmodel.json \
	${ALIAS} \
	${MINIO_ROOT_USER} 

