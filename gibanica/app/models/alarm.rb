class Alarm
  include Mongoid::Document
  include Mongoid::Timestamps

  field :host, type: String
  field :message, type: String

  has_many :logs

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
