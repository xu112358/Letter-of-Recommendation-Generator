# csci-401-capstone
Repo for hosting Group 28 capstone project

## How to Run (Development)
+ Enter letterOfRecGenerator folder
+ Run `DEBUG=letterOfRecGenerator:* npm run devstart` (for debug on console) or `npm run devstart`
+ Open up a browser tab to `127.0.0.1:3000` (make sure port 3000 was not already occupied)

## How to Install MongoDB
1. Go to [this link](https://www.mongodb.com/download-center?_ga=2.34334885.546969976.1519083876-785985683.1517259025#enterprise) and download the compressed files for your respective platform.
2. Extract the files from the downloaded archive.

   On Mac, run:
   
   ```
   tar -zxvf mongodb-osx-x86_64-enterprise-3.6.2.tgz
   ```
3. Copy the extracted archive to the target directory.

   On Mac, run:
  
   ```
   mkdir -p mongodb
   cp -R -n mongodb-osx-x86_64-enterprise-3.6.2/ mongodb
   ```
4. Ensure the location of the binaries is in the **PATH** variable.

   Add the following line to `~/.bashrc` or `~/.bash_profile`:
   
   ```
   export PATH=<mongodb-install-directory>/bin:$PATH
   ```
   
   Then, run:
   
   ```
   source ~/<.bashrc or .bash_profile>
   ```
5. Run MongoDB
   1. Create the data directory.
   
      This creates the default directory to which MongoDB will write data
      
      ```
      sudo mkdir -p /data/db
      ```
   2. Set permissions for the data directory.
   
  	  MongoDB will need read and write permissions
      
      ```
      sudo chmod 755 /data/db
      ```
   3. Run the `mongod` process.
      
      If the locations of the MongoDB binaries has been added to the **PATH** variable, then run:
      
      ```
      mongod
      ```
      
      Otherwise, run:
      
      ```
      <path to binary>/mongod
      ```
   4. Verify that MongoDB has started successfully.
      
      Check the process output for the following line:
      
      ```
      [initandlisten] waiting for connections on port 27017
      ```
      
      You should now be able to begin using MongoDB.
		
   
   