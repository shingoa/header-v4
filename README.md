# Xerox.com Header and Footer
The version 4.0 header and footer built using GULP

## Manual Install & Build Instructions

### Install
1. [Download](https://nodejs.org/download/) and install node
2. If you're behind a firewall such as Xerox's then you need to add some environmental variabls.
  1. On Windows: Control Panel -> System -> Advanced system settings -> Environment Variables. To your system variables you must add the following. Don't forget to update the proxy as required. Once you've added these you must reboot.
    1. `http_proxy` = `http://proxy.eur.xerox.com:8000/`
    2. `https_proxy` = `http://proxy.eur.xerox.com:8000/`
  2. On Linux....
  3. On Mac...
3. Get a copy of the source code. I use [GitHub for Windows](https://windows.github.com/)
4. Open PowerShell, Command Prompt, Terminal, whatever and navigate to the location of the source code.
5. Call `npm install`. This will install all the required node/gulp modules. It can take a bit of time but wont work at all if you haven't set the proxy as above if required by your network.

### Build
- `gulp build` - Will build a limited subset of pages into the `./built/` directory for testing
- `gulp compile` - Will build and compile all banner components; `header`, `head_section` and `footer` for all languages
- `gulp watch` - Will monitor all json, scss and mustache changes and rebuild as appropriate for immediate testing into `./built/`

#### Options
- `--tier` - Specifies the build tier. So for example `gulp build --tier prod` will perform a development build based on production data. Options `local/dev/test/prod`. Default `local`.

### Commit
When you start working with gulp I automatically install a git precommit hook which will block all commits unless you have incremented the version number. Use the following pattern.
4.1.x : Minor changes and bug fixes"
4.x.1 : New features and larger changes"
x.1.1 : Major new version"

### Automatic Building
Automatic building occurs on a [Jenkins server](http://usa7061vm1072.na.xerox.net:8080/), it is automatically triggered by a JSON build on LAMP.
