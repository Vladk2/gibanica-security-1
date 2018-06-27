class FireRuleJob < ApplicationJob
  queue_as :rules

  def perform(rule_json)
    # Do something later
    # can't access fields directly in active job ... using hash annotation instead
    rule = AlarmRule.find(JSON.parse(rule_json)['_id'])

    matched_logs = rule.fire_rule
    uniq_hosts = matched_logs.uniq {|l| l['host'] }

    # Parallel.each(uniq_hosts, in_threads: 4) {|uniq_log_by_host|
    #   logs = matched_logs.select {|matched_log|
    #     matched_log['host'] == uniq_log_by_host['host']
    #   }
    #   Alarm.new(
    #     message: rule.message,
    #     logs: logs,
    #     host: uniq_log_by_host['host']
    #   ).save!
    # }

    time_of_last_log_found = matched_logs.max_by {|l| l['created_at'] }

    uniq_hosts.each do |uniq_log_by_host|
      logs = matched_logs.select {|matched_log|
        matched_log['host'] == uniq_log_by_host['host']
      }
      Alarm.new(
        message: rule.message,
        logs_count: logs.size,
        host: uniq_log_by_host['host']
      ).save!
    end

    unless time_of_last_log_found.nil?
      rule.cycle_finish_time = time_of_last_log_found['created_at']
    end

    rule.cycles += 1
    rule.save!

    puts rule.cycle_finish_time

    # start self again every minute
    FireRuleJob.set(wait: 10.seconds).perform_later(rule.to_json)
  end
end
