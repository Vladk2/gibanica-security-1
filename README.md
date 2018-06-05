 - Install ruby, ruby-bundler, mongodb, yarn, redis
 - gem install rails, foreman (add gems directory to path)

 Run this in project directory:

    > bundle install --path vendor/bundle
    > cd client
    > yarn --ignore-engines
    > openssl req -x509 -sha256 -nodes -newkey rsa:2048 -days 365 -keyout cert.key -out cert.pem -subj /CN=localhost

 - RUN REDIS
    > redis-server

 - RUN SIDEKIQ (gibanica directory)
    > bundle exec sidekiq -q default -q mailers

 - RUN SERVER API (gibanica directory):
    > bundle exec rails s -b 'ssl://localhost:3000?key=cert.key&cert=cert.pem'

 - RUN FRONTEND (gibanica/client/ directory):
 	> yarn start

 Configure MongoDB user:

    > use admin
    switched to db admin
    > db.createUser({user: "gibanica", pwd: "123", roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]})

 Add this line to /etc/mongo.conf:

    auth=true

 Remove or comment 'ilogappend = true' in the same file if any errors appear.

 Restart mongod daemon or system.

 Check if user authentication works by executing this:

    > mongo --port 27017 -u "gibanica" -p "123" --authenticationDatabase "admin"

 Add to ~/.bashrc:

    export GIBANICA_SECRET=gIbanicAs3cr3t
    export MONGO_USERNAME=gibanica
    export MONGO_PASSWORD=123
    export MAIL_USERNAME=your_email@domain.com
    export MAIL_PASSWORD=your_password

 For efficient execution of commands, add these aliases to .bashrc too:

    alias mg='mongo --port 27017 -u "gibanica" -p "123" --authenticationDatabase "admin"'
    alias be='bundle exec'

 Restart terminal or execute 'source ~/.bashrc'

 For every new gem added to Gemfile, this command needs to be run inside project root ('/gibanica'):

    bundle install --path vendor/bundle

 For every new npm package, positionate to '/gibanica/client' and run:

    npm install --save 'package'
