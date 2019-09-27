
# lambda function defaults

if [ -z "$CS_LAMBDA_VERSION" ]; then
	if [ -n "$TCBUILD_ASSET_FULL_NAME" ]; then
		export CS_LAMBDA_VERSION=$TCBUILD_ASSET_FULL_NAME
	else
		export CS_LAMBDA_VERSION="`get-json-property -j $CS_OUTBOUND_EMAIL_TOP/package.json -p name`-`get-json-property -j $CS_OUTBOUND_EMAIL_TOP/package.json -p version`"
	fi
fi

# CS_OUTBOUND_EMAIL_CFG_FILE is overridden for lambda functions as it will be deployed within the code's zip file
[ -n "$CS_OUTBOUND_EMAIL_CFG_FILE" -o -n "$CSSVC_CFG_FILE" ] && export CS_OUTBOUND_EMAIL_CFG_FILE=./codestream-services-config.json

[ -z "$CS_OUTBOUND_EMAIL_LAMBDA_TEMPLATE" ] && export CS_OUTBOUND_EMAIL_LAMBDA_TEMPLATE=lambda-func.generic.template.json
[ -z "$CS_OUTBOUND_EMAIL_LAMBDA_RUNTIME" ] && export CS_OUTBOUND_EMAIL_LAMBDA_RUNTIME="nodejs10.x"
[ -z "$CS_OUTBOUND_EMAIL_AWS_ACCOUNT" ] && export CS_OUTBOUND_EMAIL_AWS_ACCOUNT=564564469595
[ -z "$CS_OUTBOUND_EMAIL_LAMBDA_IAM_ROLE" ] && export CS_OUTBOUND_EMAIL_LAMBDA_IAM_ROLE=cs_LambdaDevelopment
[ -z "$CS_OUTBOUND_EMAIL_LAMBDA_DESCRIPTION" ] && export CS_OUTBOUND_EMAIL_LAMBDA_DESCRIPTION="outbound email gateway for $CS_OUTBOUND_EMAIL_ENV"
#export CS_OUTBOUND_EMAIL_LAMBDA_SUBNETS=
#export CS_OUTBOUND_EMAIL_LAMBDA_SECURITY_GROUPS=

[ -z "$CS_OUTBOUND_EMAIL_SNS_TOPIC_ARN" ] && export CS_OUTBOUND_EMAIL_SNS_TOPIC_ARN="arn:aws:sns:us-east-1:$CS_OUTBOUND_EMAIL_AWS_ACCOUNT:dev_UnprocessedOutboundEmailEvents"
[ -z "$CS_OUTBOUND_EMAIL_SQS_ARN" ] && export CS_OUTBOUND_EMAIL_SQS_ARN="arn:aws:sqs:us-east-1:$CS_OUTBOUND_EMAIL_AWS_ACCOUNT:$CS_OUTBOUND_EMAIL_SQS"
