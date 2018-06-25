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

  def find_interval
    Log.collection.aggregate(
      [
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
                    1000 * 60 * 60 * 24
                  ]
                }
              ]
            },
            hostSet: {
              "$addToSet": '$process'
            },
            count: {
              "$sum": 1
            }
          }
        }
      ]
    )
  end
end
