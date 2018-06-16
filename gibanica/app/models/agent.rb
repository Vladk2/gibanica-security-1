class Agent
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name, type: String
  field :type, type: String
  field :address, type: String
  field :paths, type: Array
  field :host, type: String
  field :super, type: Boolean, default: false
end
