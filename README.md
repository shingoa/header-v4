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
- 4.1.x : Minor changes and bug fixes"
- 4.x.1 : New features and larger changes"
- x.1.1 : Major new version"

### Automatic Building
Automatic building occurs on a [Jenkins server](http://usa7061vm1072.na.xerox.net:8080/), it is automatically triggered by a JSON build on LAMP.

## Merging

* First you need to [view a comparison](https://github.com/xeroxinteractive/header-v4/compare) of the branches

![Step 1](https://cloud.githubusercontent.com/assets/1090602/9384756/76c82064-474a-11e5-9382-e9e5cd58c794.PNG)

* Pick the base (destination) and compare (source). So in this case I'm merging changes from master into dev. Push "Create pull request"

![Step 2](https://cloud.githubusercontent.com/assets/1090602/9384757/76dc8180-474a-11e5-9f47-0c5a5a3e0ce6.PNG)

* Enter a basic message and conform the merge.

![Step 3](https://cloud.githubusercontent.com/assets/1090602/9384758/76e17500-474a-11e5-9fec-2c59cd557ea8.PNG)

* You will now have the ability to merge the pull request

![Step 4](https://cloud.githubusercontent.com/assets/1090602/9384759/76f2f21c-474a-11e5-9473-457ed6b8fb02.PNG)

* You can again enter a simple message, although it usually takes the message entered in step 3. Confirm the merge.

![Step 5](https://cloud.githubusercontent.com/assets/1090602/9384755/76c520d0-474a-11e5-9ffc-c8e502622fd0.PNG)

* All done. When [Jenkins](http://usa7061vm1072.na.xerox.net:8080/) next runs it will build that code for that tier. 
