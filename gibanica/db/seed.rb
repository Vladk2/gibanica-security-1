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
  paths: ['auth.log', '/var/log/auth.log'],
  host: 'notebook'
).save!

Agent.new(
  name: 'Windows Event Log Agent',
  type: 'Windows',
  address: '192.168.0.17:5000',
  paths: ['sys32.evl'],
  host: 'dragan-pc'
).save!

Agent.new(
  name: 'Firewall Log Agent',
  type: 'Linux',
  address: '192.168.0.9:5000',
  paths: ['kernel.log'],
  host: 'notebook',
  super: true
).save!

for i in 1..400 do
  Log.new(
    logged_date: Date.today - 45.days,
    logged_time: Time.now,
    severity: (i.odd? ? 'INFO' : 'WARNING'),
    host: (i.odd? ? 'stefan-notebook' : 'stefan-pc'),
    process: i,
    message: (i.odd? ? 'CPU is burning... NOT' : 'Something is happening. I warn you it`s bad')
  ).save!
end
