class Alarm
  include Mongoid::Document
  include Mongoid::Timestamps

  field :host, type: String
  field :message, type: String
  field :logs_count, type: Integer

  def self.count_per_host
    Alarm.collection.aggregate(
      [
        {
          "$group": {
            _id: '$host',
            count: {
              "$sum": 1
            }
          }
        }
      ]
    )
  end
end
