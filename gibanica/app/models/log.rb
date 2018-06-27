class Log
  include Mongoid::Document
  include Mongoid::Timestamps

  field :logged_date, type: Date
  field :logged_time, type: Time
  field :severity, type: String
  field :host, type: String
  field :process, type: String
  field :message, type: String

  index({logged_date: 1, host: 1}, unique: false)
  index({logged_date: 1, severity: 1}, unique: false)
  index({logged_date: 1}, unique: false)

  scope :by_field, lambda {|field, pattern|
    where("#{field}": pattern)
  }

  scope :from_date, lambda {|time|
    Log.where(:logged_date.gte => time)
  }

  scope :to_date, lambda {|time|
    Log.where(:logged_date.lte => time)
  }

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      l = Log.new(log)
      l.updated_at = Time.now
      l.created_at = Time.now
      batch.push(l.attributes)
    end

    Log.collection.insert_many(batch)
  end

  def self.search(query)
    query = JSON.parse(query)

    if fields_valid?(query)
      search_with_time = time_search(query)

      return search_with_time.ascending(:logged_time) unless search_with_time.nil?

      return Log.and(transform_to_search_array(query)).ascending(:logged_time)
    end
    Log.none
  end

  def self.inserted_logs_status(filter)
    # (Date.today - 30.days..Date.today).to_a
    data = []

    if filter == 'date'
      inserted_last_30_days.each do |c|
        data.push(c)
      end
    else
      inserted_per_host_machine.each do |c|
        data.push(c)
      end
    end

    data
  end

  private

  def self.time_search(query)
    if query.any? {|e| e['filter'].start_with?('logged_time') }
      start_time = start_time_term(query)
      end_time = end_time_term(query)

      unless start_time.nil?
        unless end_time.nil?
          return Log.from_date(start_time['search'])
                    .to_date(end_time['search'])
                    .and(transform_to_search_array(query))
        end

        return Log.from_date(start_time['search'])
                  .and(transform_to_search_array(query))
      end

      return Log.to_date(end_time['search'])
                .and(transform_to_search_array(query))
    end

    nil
  end

  def self.inserted_per_host_machine
    Log.collection.aggregate(
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

  def self.inserted_last_30_days
    Log.collection.aggregate(
      [
        {
          "$match": {
            logged_date: {
              "$gte": Date.today - 30.days, "$lte": Date.today
            }
          }
        },
        {
          "$group": {
            _id: '$logged_date',
            count: {
              "$sum": 1
            }
          }
        }
      ]
    )
  end

  def self.fields_valid?(query)
    query.each do |filter|
      unless %w(
        severity
        logged_time_start
        logged_time_end
        process
        host
        message
      ).include?(filter['filter'].downcase)
        return false
      end
    end
    true
  end

  def self.start_time_term(query)
    query.find {|e| e['filter'] == 'logged_time_start' }
  end

  def self.end_time_term(query)
    query.find {|e| e['filter'] == 'logged_time_end' }
  end

  def self.transform_to_search_array(query)
    mongoid_query = []

    query.each do |e|
      next if e['filter'].start_with?('logged_time')
      mongoid_query.push("#{e['filter']}": /#{e["search"]}/i)
    end

    mongoid_query
  end
end
