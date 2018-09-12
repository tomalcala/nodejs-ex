# Node Reason  

__This project is a port in Reason of the Openshift Node Container example that uses Javascript, NodeJS and Express, meant to be both a webapp and a bot.__  

## Installation  

### Docker  

1. Create the image with `$ ./bin/build.sh`.  
1. Start a container from the image with `$ ./bin/start.sh`.  
1. Start the development service with `$ ./bin/web.sh`.  

### Local  

1. Install the Node modules with `$ yarn install` (or the NPM counterpart, I recommend Yarn though.  
1. Run the Bucklescript Builder with `$ yarn start:watch`.  
1. Run the Node develepment server with `$ yarn js:start`.  

## Access  

1. Open [http://localhost:8080/](http://localhost:8080/) in your browser.  

## Deployment  

### Openshift  

You can create a new NodeJS + MongoDB project on Openshift starter V3 using this repository (or a fork of it) as base.

## Recommended Tools  

### Linters  

#### Gitlint  

##### Installation  

1. Install the Python library `$ pip install gitlint`.  
1. Add the hook `$ gitlint install-hook`.  
1. _(optional)_ Generate a custom config `$ gitlint generate-config`.  
1. _(optional)_ Install pre-commit `$ pip install pre-commit`.  
1. _(optional)_ Add a pre-commit configuration file.  

## Acknowledgements  

* Thanks to [Reason](https://reasonml.github.io) and the Reason community for making this exercise entertaining.  
