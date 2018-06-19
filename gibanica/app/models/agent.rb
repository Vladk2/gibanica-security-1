class Agent
  include Mongoid::Document
  include Mongoid::Timestamps

  belongs_to :agent, optional: true

  field :name, type: String
  field :type, type: String
  field :address, type: String
  field :paths, type: Array
  field :host, type: String

  def self.batch_update(agents)
    # find better way for batch update
    # Agent.where(ids: agents.map {|a| a[:id] }).update(agent: nil)
    # Agent.with_session(causal_consistency: true) do
    # session as transaction also not working. FIX
    agents.each do |a|
      Agent.find(a[:id]).update(agent: a[:super])
    end
    # end
  end
end
