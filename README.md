# SimpleVoting

## Dependencies: (My testing version)
- nodeJS : 8.1.4
- mysql: 5.5.62
- express: 4.14.0
- ejs: 2.6.2
- body-parser: 1.19.0
- md5: 2.2.1
- express-session: 1.16.2

## Setup - Ubuntu 16.04 (My testing environment)
You can test it on other OS with all dependencies installed.
### 1. Install NodeJS
Open the terminal and type:

`sudo add-apt-repository -y -r ppa:chris-lea/node.js`

`sudo rm -f /etc/apt/sources.list.d/chris-lea-node_js-*.list`

`sudo rm -f /etc/apt/sources.list.d/chris-lea-node_js-*.list.save`

`curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | sudo apt-key add -`

`VERSION=node_8.x`

`DISTRO="$(lsb_release -s -c)" `

`echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee /etc/apt/sources.list.d/nodesource.list`

`echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | sudo tee -a /etc/apt/sources.list.d/nodesource.list`

`sudo apt-get update`
 
`sudo apt-get install nodejs`
 
### 2. Install MySQL
Open the terminal and type:

`sudo apt-get install mysql-server`
### 3. Install other dependencies
Open the terninal and type:

`npm install express --save`

`npm install mysql --save`

`npm install ejs --save` 
 
`npm install body-parser --save`

`npm install md5 --save`

`npm install express-session --save`

### 4. Database setup
Please login mysql as root and follow the instruction/cmd in db setup file.

## Now go to the app folder and run it: Node index.js
