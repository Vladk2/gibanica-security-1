 - Install ruby, ruby-bundler, mongodb, yarn
 - gem install rails, foreman (add gems directory to path)
 - Run this in project directory: bundle install --path vendor/bundle && yarn --ignore-engines && foreman start -f Procfile.dev
 
 Configure MongoDB user: 
 
    > use admin
    switched to db admin
    > db.createUser({user: "gibanica", pwd: "123", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})

    Add this line to /etc/mongo.conf: 'auth=true'. Remove or comment 'ilogappend = true' if any errors appear.
    Restart mongod daemon or system.
    
 Check if user authentication works by executing this:

    > mongo --port 27017 -u "gibanica" -p "123" --authenticationDatabase "admin"
    
 Add to ~/.bashrc:

    export MONGO_USERNAME=gibanica
    export MONGO_PASSWORD=123
    
 Restart terminal or execute 'source ~/.bashrc'   
