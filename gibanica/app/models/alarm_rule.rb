class AlarmRule
  include Mongoid::Document
  include Mongoid::Timestamps

  field :rule_criteria, type: Array
  field :message, type: String
  field :count, type: Integer
  field :start_date, type: Time
  field :end_date, type: Time
  field :interval, type: Time
  field :cycles, type: Integer, default: 0
  field :cycle_finish_time, type: Time

  def fire_rule
    return [] unless Log.count.positive?

    return Log.collection.aggregate([find_match, find_interval]) unless interval.nil?
    Log.collection.aggregate([find_match])
  end

  private

  def find_match
    process_match = rule_criteria.find {|c| c[:attribute] == 'process' }
    severity_match = rule_criteria.find {|c| c[:attribute] == 'severity' }
    host_match = rule_criteria.find {|c| c[:attribute] == 'host' }

    # set to empty string if no search criteria is provided for these attributes
    process_match ||= {value: ''}
    severity_match ||= {value: ''}
    host_match ||= {value: ''}

    {
      "$match": {
        created_at: {
          "$gte": cycle_finish_time.nil? ? Log.first.created_at : updated_at
        },
        logged_time: {
          "$gte": start_date.nil? ? Log.first.logged_time : start_date,
          "$lte": end_date.nil? ? Log.last.logged_time : end_date
        },
        severity: /#{severity_match[:value] == '=' ? "" : fix_regex(severity_match[:value])}/i,
        host: /#{host_match[:value] == '=' ? "" : fix_regex(host_match[:value])}/i,
        process: /#{process_match[:value] == '=' ? "" : fix_regex(process_match[:value])}/i
      }
    }
  end

  def find_interval
    # distinct_field = rule_criteria.find {|c| c[:value] == '=' }

    {
      "$group": {
        _id: {
          "$subtract": [
            {
              "$subtract": [
                '$logged_time',
                Date.parse('1970-01-01')
              ]
            },
            {
              "$mod": [
                {
                  "$subtract": [
                    '$logged_time',
                    Date.parse('1970-01-01')
                  ]
                },
                # interval is stored as Time object. Date doesn't matter for now.
                # argument is in milliseconds, so seconds x 1000
                1000 * Time.parse(self.interval.strftime('%H:%M:%S')).seconds_since_midnight.to_i
              ]
            }
          ]
        },
        set: {
          "$push": {
            id: '$_id',
            host: '$host',
            severity: '$severity',
            process: '$process',
            #message: '$message'
          }
        },
        count: {
          "$sum": 1
        }
      }
    }
  end

  def fix_regex(pattern)
    return '.*' if %w(. * ?).include? pattern
    pattern
  end
end
