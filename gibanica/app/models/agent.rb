class Agent
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :agent, optional: true

  field :name, type: String
  field :type, type: String
  field :address, type: String
  field :paths, type: Array
  field :host, type: String
end
