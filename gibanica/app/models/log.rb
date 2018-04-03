class Log
  include Mongoid::Document
  # include Mongoid::Timestamps

  field :logged_time, type: DateTime
  field :host, type: String
  field :process, type: String
  field :message, type: Hash

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      batch.push(Log.new(log).attributes)
    end

    Log.collection.insert_many batch
  end
end
