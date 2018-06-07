class Log
  include Mongoid::Document

  field :logged_date, type: Date
  field :logged_time, type: Time
  field :severity, type: String
  field :host, type: String
  field :process, type: String
  field :message, type: String

  index({ logged_time: 1, host: 1 }, { unique: false })
  index({ logged_time: 1, severity: 1 }, { unique: false })
  index({ logged_time: 1 }, { unique: false })

  scope :by_field, lambda { |field, pattern|
    where("#{field}" => pattern)
  }

  scope :date_range, lambda { |from, to|
    Log.where(:logged_date.gte => from, :logged_date.lte => to)
  }

  scope :time_range, lambda { |from, to|
    Log.where(:logged_time.gte => from, :logged_date.lte => to)
  }

  scope :find_any, lambda { |pattern|
    Log.or(severity: pattern).or(host: pattern).
    or(process: pattern).or(message: pattern)
  }

  def self.batch_save!(logs)
    batch = []

    logs.each do |log|
      batch.push(Log.new(log).attributes)
    end

    Log.collection.insert_many(batch)
  end

  def self.search(query)
    self.validate_query(query)
  end

  def self.inserted_logs_status(filter)
    # (Date.today - 30.days..Date.today).to_a
    data = []

    if filter == 'days'
      self.inserted_last_30_days.each do |c|
        data.push(c)
      end
    else
      self.inserted_per_host_machine.each do |c|
        data.push(c)
      end
    end

    data
  end

  #private

  def self.inserted_per_host_machine
    Log.collection.aggregate(
      [
        {
          "$group": {
            _id: "$host",
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
          },
        },
        {
          "$group":{
            _id: "$logged_date",
            count: {
              "$sum": 1
            }
          }
        }
      ]
    )
  end

  def self.field_valid?(filter_by)
    %w(
      severity
      logged_time
      process"
      host
      message
    ).include?(filter_by)
  end

  def self.validate_query(q)
    q = q.delete(' ')

    if query_valid?(q)
      search_terms = split_query(q)

      puts search_terms

      if search_terms[:or_conditions].nil?
        Log.and(search_terms[:and_conditions])
      else
        Log.and(
          Log.and(search_terms[:and_conditions]).selector,
          Log.or(search_terms[:or_conditions]).selector
        )
      end
    end
  end

  def self.query_valid?(query)
    pattern_one = /\s*({\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*)*)?(\s*or\s*\[\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*})*\s*\])?\s*$/
    pattern_two = /^(\s*or\s*\[\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*})*\s*\]\s*)(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*)*$/
    pattern_three = /^\s*({\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*)*)?(\s*or\s*\[\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*})*\s*\])\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*)*$/

    query.match?(pattern_one) || query.match?(pattern_two) || query.match?(pattern_three)
  end

  def self.has_or?(query, pattern)
    query.match?(pattern)
  end

  def self.split_query(query)
    # good, maybe? (or?[ ]*\[({[ ]*[severity|host|process|message]+[ ]*:[ ]*'[^']*'})*[ ]*,[ ]*)|([ ]*{[ ]*[severity|host|process|message]+[ ]*:[ ]*'[^']*'})
    pattern_or = /or\s*\[\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*}\s*(,\s*{\s*(severity|message|process|host)\s*:\s*[^}]*\s*})*\s*\]/
    search_term = /({[a-z]+:[^}]*})/

    query_conditions = {}

    or_conditions = []
    and_conditions = []

    if self.has_or?(query, pattern_or)
      # split by or
      tokens = query.partition(pattern_or)

      tokens.each do |t|
        if t.match?(pattern_or)
          t.scan(search_term).each do |p|
            or_conditions.push(regexify_search_terms(p[0]))
          end
        else
          and_terms = t.scan(search_term)

          and_terms.each do |and_term|
            unless and_term.blank?
              t = t.delete_prefix(',').delete_suffix(',')
              and_conditions.push(regexify_search_terms(t))
            end
          end
        end
      end
    end

    query_conditions[:and_conditions] = and_conditions
    query_conditions[:or_conditions] = or_conditions

    return query_conditions
  end

  def self.regexify_search_terms(term)
    tokens = term.split(':')
    eval("#{tokens[0]}:'#{tokens[1].delete_suffix('}')}'}").transform_values { |v| /#{v}/i }
  end
end
