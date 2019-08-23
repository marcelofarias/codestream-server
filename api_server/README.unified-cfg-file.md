# Unified Config File

We're moving our sandbox configurations from setting configuration parameters
from environment variables to reading them from a single configuration file
shared by all sandboxes.

As sandboxes are modified to support this, they should re-configured (or
installed) using the `unified-cfg-file.sh` sandbox configuration file. When we
are satisfied that all configurations work with the unified config file, this
will become the new default sandbox configuration (`default.sh`).

## Migration

### Prepare
1. Bring your development environment, including dev_tools, up to date
   (`dt-selfupdate -y`). Always keep your dev_tools installation updated.
1. Update your secrets (`dt-update-secrets`).

### Managing the Configuration Files
1. Look in your **~/.codestream/config/** directory. You'll find config files
   (ending in `.json`) and templates (ending in `.json.template`). The list of
   config files and templates will grow over time. Consider these read-only.

   Config files are fully functional and can be used directly where as templates
   must be copied to the corresponding `.json` file suffix and edited to
   replace the template variables `{{TEMPLATE_VAR}}`.

1. The default behavior for sandboxes configured with `unified-cfg-file.sh` is
   to look for a configuration file called
   **~/.codestream/config/codestream-services-config.json**. Make this a
   symbolic link to switch between the various configuration files on your
   computer.
   ```
   $ cd ~/.codestream/config
   $ ln -snf <the-config-file-you-want.json> codestream-services-config.json
   $ ls -l
   ```
1. Setup a link for the configuration file you want **_before_** loading any
   sandboxes.  If you change the link, close your sandbox shell sessions and
   re-load the sandboxes or playgrounds in new shells.


### Distributed Config Files and Templates

Files distributed via `dt-update-secrets`.

| File | Desc |
| --- | --- |
| local-cloud-development.json | for running development sandboxes natively on your computer targeted for the production configuration (pubnub, sendgrid, sqs) |
| local-onprem-development.json.template | for creating a config running development sandboxes natiely on your computer targeted for the on-prem (docker) configuration (broadcaster, nodemailer, rabbitmq) |


### Setup an API sandbox (and playground)

Follow the instructions for setting up a sandbox in the main [README](README.md)
but for now, add these options when you execute the `db-sb-new-sandbox` command.
```
-e unified-cfg-file.sh -b config_update
```