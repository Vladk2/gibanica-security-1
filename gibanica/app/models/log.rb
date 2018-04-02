class Log
  include Mongoid::Document
  include Mongoid::Timestamps

  field :content, type: Hash

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      batch.push(Log.new(log).attributes)
    end

    Log.collection.insert_many batch
  end
end
