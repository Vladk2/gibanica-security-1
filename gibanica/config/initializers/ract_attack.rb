Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new

# Throttle requests to 5 requests per second per ip
# Rack::Attack.throttle('req/ip', limit: 2, period: 60.seconds) do |req|
#   if req.path == '/users/password_reset_link' && req.post?
#     req.ip
#   end
# end

# Rack::Attack.throttle('req/ip', limit: 1, period: 1.second) do |req|
#   if req.get?
#     req.ip
#   end
# end

# Lockout IP addresses that are hammering your login page.
# After 20 requests in 1 minute, block all requests from that IP for 1 hour.
# Rack::Attack.blocklist('allow2ban login scrapers') do |req|
#   # `filter` returns false value if request is to your login page (but still
#   # increments the count) so request below the limit are not blocked until
#   # they hit the limit.  At that point, filter will return true and block.
#   Rack::Attack::Allow2Ban.filter(req.ip, maxretry: 3, findtime: 1.minute, bantime: 1.minute) do
#     # The count for the IP is incremented if the return value is truthy.
#     req.path == '/users/login' and req.post?
#   end
# end

### Prevent Brute-Force Login Attacks ###

# The most common brute-force login attack is a brute-force password
# attack where an attacker simply tries a large number of emails and
# passwords to see if any credentials match.
#
# Another common method of attack is to use a swarm of computers with
# different IPs to try brute-forcing a password for a specific account.

# Throttle POST requests to /login by IP address
#
# Key: "rack::attack:#{Time.now.to_i/:period}:logins/ip:#{req.ip}"
Rack::Attack.throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
  if req.path == '/users/login' && req.post?
    req.ip
  end
end

# Throttle POST requests to /login by email param
#
# Key: "rack::attack:#{Time.now.to_i/:period}:logins/email:#{req.email}"
#
# Note: This creates a problem where a malicious user could intentionally
# throttle logins for another user and force their login requests to be
# denied, but that's not very common and shouldn't happen to you. (Knock
# on wood!)
Rack::Attack.throttle('logins/email', limit: 5, period: 20.seconds) do |req|
  if req.path == '/users/login' && req.post?
    # return the email if present, nil otherwise
    req.params['email'].presence
  end
end

Rack::Attack.throttled_response = lambda do |env|
  # NB: you have access to the name and other data about the matched throttle
  #  env['rack.attack.matched'],
  #  env['rack.attack.match_type'],
  #  env['rack.attack.match_data'],
  #  env['rack.attack.match_discriminator']

  # Using 503 because it may make attacker think that they have successfully
  # DOSed the site. Rack::Attack returns 429 for throttling by default
  [503, {}, ["Server Error\n"]]
end
