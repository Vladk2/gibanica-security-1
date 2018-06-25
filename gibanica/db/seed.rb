user = User.new(email: 'riggy.ruter@gmail.com', name: 'admin', last_name: 'admin')
user.hash_password('aaAA11##')
user.save!

Role.new(name: 'operater').save!
Role.new(name: 'admin').save!

u = User.where(email: 'g@g.com').first
u.roles << Role.where(name: 'admin')
u.save!

Agent.new(
  name: 'OS Auth Agent',
  type: 'Linux',
  address: '192.168.2.19:5000',
  paths: [{path: 'auth.log', format: 'RFC5424'}, {path: '/var/log/auth.log', format: 'RFC5424'}],
  host: 'notebook'
).save!

agent = Agent.new(
  name: 'Firewall Log Agent',
  type: 'Linux',
  address: '192.168.0.9:5000',
  paths: [{path: 'kernel.log', format: 'RFC3464'}],
  host: 'notebook'
)

agent.save!

Agent.new(
  name: 'Windows Event Log Agent',
  type: 'Windows',
  address: '192.168.0.17:5000',
  paths: [{path: 'sys32.evl', format: 'Event Log'}],
  host: 'dragan-pc',
  agent: agent
).save!

for i in 1..100 do
  Alarm.new(host: "pc-#{i}", message: "message - #{i}").save!
end

for i in 1..400 do
  Log.new(
    logged_date: Date.today - 45.days,
    logged_time: Time.now,
    severity: (i.odd? ? 'INFO' : 'WARNING'),
    host: (i.odd? ? 'awd' : 'dwa'),
    process: i,
    message: (i.odd? ? 'CPU is burning... NOT' : 'Something is happening. I warn you it`s bad')
  ).save!
end
