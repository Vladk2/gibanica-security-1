class AlarmRule
  include Mongoid::Document
  include Mongoid::Timestamps

  field :rule_criteria, type: Array
  field :message, type: String
  field :count, type: Integer
  field :start_date, type: Time
  field :end_date, type: Time
  field :interval, type: Time

  has_many :logs

  def fire_rule
    Log.collection.aggregate(
      [
        find_match,
        find_interval
      ]
    )
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
        # logged_time: {},
        severity: /#{severity_match[:value] == '=' ? "" : severity_match[:value]}/i,
        host: /#{host_match[:value] == '=' ? "" : host_match[:value]}/i,
        process: /#{process_match[:value] == '=' ? "" : process_match[:value]}/i
      }
    }
  end

  def find_interval
    distinct_field = rule_criteria.find {|c| c[:value] == '=' }

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
                1000 * Time.parse(interval.strftime('%H:%M:%S')).seconds_since_midnight.to_i
              ]
            }
          ]
        },
        distinct_set: {
          "$addToSet": {
            id: '$_id',
            host: '$host',
            "#{distinct_field[:attribute]}": "$#{distinct_field[:attribute]}"
          }
        },
        count: {
          "$sum": 1
        }
      }
    }
  end
end
