class Log
  include Mongoid::Document
  # include Mongoid::Timestamps

  field :logged_time, type: DateTime
  field :severity, type: String
  field :host, type: String
  field :process, type: String
  field :message, type: Hash

  scope :by_field, lambda { |field, pattern|
    pattern = /.*#{pattern}.*/i

    case field.downcase
    when 'severity'
      where(severity: pattern)
    when 'logged_time'
      where(logged_time: pattern)
    when 'host'
      where(host: pattern)
    when 'process'
      where(process: pattern)
    when 'message'
      where(message: pattern)
    else
      all
    end
  }

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      batch.push(Log.new(log).attributes)
    end

    Log.collection.insert_many batch
  end

  def self.search(filter_by, search_by)
    Log.by_field(filter_by, search_by)
  end
end
