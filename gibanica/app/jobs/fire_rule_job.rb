class FireRuleJob < ApplicationJob
  queue_as :rules

  def perform(rule_json)
    # Do something later
    # can't access fields directly in active job ... using hash annotation instead
    rule = AlarmRule.find(JSON.parse(rule_json)['_id'])

    return if rule.nil?

    logs = rule.fire_rule

    if rule.interval.nil?
      handle_without_interval(logs, rule)
    else
      handle_with_interval(logs, rule)
    end

    # start self again every minute
    FireRuleJob.set(wait: 10.seconds).perform_later(rule.to_json)
  end

  private

  def handle_without_interval(matched_logs, rule)
    uniq_hosts = matched_logs.uniq {|l| l['host'] }

    time_of_last_log_found = matched_logs.max_by {|l| l['created_at'] }

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

      if rule.count <= logs.size
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
  end

  def handle_with_interval(batches, rule)
    latest_logs = []

    batches.each do |batch|
      uniq_hosts = batch[:set].uniq {|l| l['host'] }

      uniq_hosts.each do |host_log|
        count_by_host = batch[:set].count {|l| l['host'] == host_log['host'] }

        if rule.count.nil?
          Alarm.new(host: host_log['host'], message: rule.message, logs_count: count_by_host).save!
          next
        end

        if count_by_host >= rule.count
          Alarm.new(host: host_log['host'], message: rule.message, logs_count: count_by_host).save!
        end

        latest_logs.push(batch[:set].max_by {|l| l['created_at'] })
      end
    end

    latest_log = latest_logs.max_by {|l| l['created_at'] }

    unless latest_log.nil?
      rule.cycle_finish_time = latest_log['created_at']
      rule.cycles += 1
      rule.save!
    end
  end
end
