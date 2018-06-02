class Log
  include Mongoid::Document
  # include Mongoid::Timestamps

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

  private

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

  def self.validate_query()
    w = String.new("{host: 'pc|stefan'}")
    q = String.new("or [{message: 'ab+c'},{severity: 'error|info'}, {host:'stefan-notebook'}, {process: 'kojuma'} ], { process: 'pYthOn' }")
    q = q.delete(' ')

    if query_valid?(q)
      search_terms = split_query(q)

      if search_terms[:or_conditions].nil?
        Log.where('$and': search_terms[:and_conditions])
      else
        Log.where('$and': search_terms[:and_conditions])
           .where('$or': search_terms[:or_conditions])
      end
    end
  end

  def self.query_valid?(query)
    pattern = /or[ ]*\[[ ]*{[ ]*[severity|host|process|logged_time|message]+[ ]*:[ ]*'.*'[ ]*}[ ]*,[ ]*{[ ]*[severity|host|process|logged_time|message]+[ ]*:[ ]*'.*'[ ]*}[ ]*\]/

    query.match?(pattern)
  end

  def self.split_query(query)
    # good, maybe? (or?[ ]*\[({[ ]*[severity|host|process|message]+[ ]*:[ ]*'[^']*'})*[ ]*,[ ]*)|([ ]*{[ ]*[severity|host|process|message]+[ ]*:[ ]*'[^']*'})
    pattern_or = /\[[ ]*{[ ]*[severity|host|process|message]+[ ]*:[ ]*'.*'[ ]*}[ ]*,[ ]*{[ ]*[severity|host|process|logged_time|message]+[ ]*:[ ]*'.*'[ ]*}[ ]*\]/

    tokens = query.partition(pattern_or)

    puts 'splited ...'

    # split by this regex or brackets.
    or_fields = /,[ ]*{[ ]*[severity|host|process|message]+[ ]*:[ ]*'.*'[ ]*}/

    query_conditions = {}

    or_conditions = []
    and_conditions = []

    search_term = /{[ ]*[severity|host|process|message]+[ ]*:[ ]*'[^']*'}/

    tokens.each_with_index do |t, i|
      if t.match?(pattern_or)
        t.scan(search_term).each do |p|
          or_conditions.push(regexify_search_terms(p))
        end
      else
        if t != 'or'
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
    eval(term).transform_values { |v| /#{v}/ }
  end
end
