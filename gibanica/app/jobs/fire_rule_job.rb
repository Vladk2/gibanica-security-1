class FireRuleJob < ApplicationJob
  queue_as :rules

  def perform(rule_json)
    # Do something later
    # can't access fields directly in active job ... using hash annotation instead
    rule = AlarmRule.find(JSON.parse(rule_json)['_id'])

    return if rule.nil?

    matched_logs = rule.fire_rule
    puts matched_logs.count
    uniq_hosts = matched_logs.uniq {|l| l['host'] }

    time_of_last_log_found = matched_logs.max_by {|l| l['created_at'] }
    puts time_of_last_log_found

    uniq_hosts.each do |uniq_log_by_host|
      logs = matched_logs.select {|matched_log|
        matched_log['host'] == uniq_log_by_host['host']
      }
      if rule.count.nil?
        Alarm.new(
          message: rule.message,
          logs_count: logs.size,
          host: uniq_log_by_host['host']
        ).save!
        next
      end

      if rule.count >= logs.size
        Alarm.new(
          message: rule.message,
          logs_count: logs.size,
          host: uniq_log_by_host['host']
        ).save!
      end
    end

    unless time_of_last_log_found.nil?
      rule.cycle_finish_time = time_of_last_log_found['created_at']
      rule.cycles += 1
      rule.save!
    end

    puts "new rule updated time"
    puts rule.updated_at

    # start self again every minute
    FireRuleJob.set(wait: 10.seconds).perform_later(rule.to_json)
  end
end
