#!/bin/sh
print"Installing SigmaConverter and its dependencies\n\n"
apt-get update  # To get the latest package lists
apt-get install nodejs npm -y
#install project dependancys
npm install
#create symlink to start anywhere from console
npm link
print"Installation done!\n"