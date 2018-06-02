user = User.new(email: 'g@g.com', name: 'admin', last_name: 'admin')
user.hash_password('123')
user.save!

Role.new(name: 'operater').save!
Role.new(name: 'admin').save!

for i in 1..400 do
  Log.new(
    logged_date: Date.today - 45.days,
    logged_time: Time.now,
    severity: (i.odd? ? 'INFO' : 'WARNING'),
    host: (i.odd? ? 'stefan-notebook' : 'stefan-pc'),
    process: i,
    message: (i.odd? ? 'CPU is burning... NOT': 'Something is happening. I warn you it`s bad')
  ).save!
end
