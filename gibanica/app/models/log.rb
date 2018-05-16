class Log
  include Mongoid::Document
  # include Mongoid::Timestamps

  field :logged_time, type: DateTime
  field :severity, type: String
  field :host, type: String
  field :process, type: String
  field :message, type: String

  scope :by_field, lambda { |field, pattern|
    where("#{field}": pattern)
  }

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      batch.push(Log.new(log).attributes)
    end

    Log.collection.insert_many(batch)
  end

  def self.search(filter_by, search_by)
    filter = filter_by.downcase
    search_text = /.*#{search_by}.*/i

    return nil unless self.filter_valid?(filter)

    Log.by_field(filter, search_text)
  end

  private

  def self.filter_valid?(filter_by)
    %w(
      severity
      logged_time
      process" 
      host 
      message
    ).include?(filter_by)
  end
end
