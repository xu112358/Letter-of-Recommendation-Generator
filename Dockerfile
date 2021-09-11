#Use Ubuntu 18.04 as base image
FROM ubuntu:bionic

#Install essential packages
RUN \
  apt-get update -y \
  && apt-get install build-essential -y

#Packages needed for the project and downloading repo from git
RUN \
  apt-get install nodejs -y \
  && apt-get install npm  -y\
  && apt-get install git -y \
  && apt-get install curl -y \
  && apt-get install zip -y \
  && apt-get install unzip -y \
  && apt-get install wget -y \
  && apt-get install tar -y \
  && npm install -g n \
  && n latest \
  && apt-get install iproute2 -y \
  && apt-get install network-manager -y

#Make ports visible to host OS 
EXPOSE 443
EXPOSE 27017
EXPOSE 3000


#Creating proper directory and installing MongoDB
RUN \
  cd home && mkdir cs401 && cd cs401 \ 
  && wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-5.0.2.tgz \
  && tar -xzvf mongodb-linux-x86_64-ubuntu1804-5.0.2.tgz \
  && mv mongodb-linux-x86_64-ubuntu1804-5.0.2 /usr/local/mongodb \
  && mkdir -p /data/db

#Setting environment variables
ENV MONGO_PATH=/usr/local/mongodb
ENV PATH=$PATH:$MONGO_PATH/bin
ENV EMAILUSER=letterrecommender@gmail.com
ENV EMAILPASS=USCPassword123!

#Downloading project repo
RUN \
  cd home/cs401 \
  && wget https://github.com/andyzhou1999/csci-401-capstone/archive/refs/heads/master.zip \
  && unzip master.zip \
  && cd csci-401-capstone-master/letterOfRecGenerator \
  && npm update && npm install helmet && npm install pm2 -g && npm install

#Start the program and let it run forever
ENTRYPOINT \
  /bin/sh -c cd home/cs401/csci-401-capstone-master/letterOfRecGenerator \
  && ls \
  && mongod --fork --logpath /mongodb.log \ 
  && ls \
  && pm2 start home/cs401/csci-401-capstone-master/letterOfRecGenerator/bin/www --name "letterOfRecGeneratorServer" \
  && tail -f /dev/null


 
 


  

 


  

  

  