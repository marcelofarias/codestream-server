
. $DT_TOP/lib/sandbox_utils.sh

sandutil_load_options $CS_MAILIN_SANDBOX || { echo "failed to load options" >&2 && return 1; }

# node
[ -z "$CS_MAILIN_NODE_VER" ] && export CS_MAILIN_NODE_VER=12.14.1
export PATH=$CS_MAILIN_SANDBOX/node/bin:$CS_MAILIN_TOP/node_modules/.bin:$PATH

export PATH=$CS_MAILIN_TOP/bin:$PATH

# find the config file
[ -n "$CSSVC_ENV" ] && export CS_MAILIN_ENV=$CSSVC_ENV
[ -n "$CS_MAILIN_CFG_FILE" ] && configParm=$CS_MAILIN_CFG_FILE || configParm="$CSSVC_CONFIGURATION"
sandutil_get_codestream_cfg_file "$CS_MAILIN_SANDBOX" "$configParm" "$CSSVC_ENV"

# env vars required for aux scripts that don't load the config file directly
[ -z "$CS_MAILIN_ENV" ] && export CS_MAILIN_ENV=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p sharedGeneral.runTimeEnvironment)`
export CS_MAILIN_LOGS=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.logger.directory)`
export CS_MAILIN_TMP=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.tmpDirectory)`
export CS_MAILIN_ASSET_ENV=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.assetEnvironment)`
export CS_MAILIN_INBOUND_EMAIL_DIRECTORY=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.inboundEmailDirectory)`
export CS_MAILIN_TEMP_ATTACHMENT_DIRECTORY=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.tempAttachmentDirectory)`
export CS_MAILIN_PROCESS_DIRECTORY=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p inboundEmailServer.processDirectory)`

# CONSIDER MOVING THIS TO THE CONFIG FILE!!
# For the local poller service (cs_mailin-local-poller) - development only
export CS_MAILIN_REMOTE_INBOUND_MAIL_SERVER=web@localmail.codestream.us
export CS_MAILIN_REMOTE_INBOUND_MAIL_DIR=/home/web/codestream-mail/inbound/web/new
