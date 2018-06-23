class Alarm
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :message, type: String
  
  has_many :logs

end
