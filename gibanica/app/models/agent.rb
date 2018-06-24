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
      agent = Agent.find(a[:id])
      agent.update(agent: a[:super])

      # bug in sending supervisor data to agent. Needs urgent FIX !
      AgentsNotifyJob.perform_later(
        agent_notify_data(agent),
        agent.address,
        '/update_supervisor'
      )
    end
    # end
  end

  private

  def self.agent_notify_data(agent)
    {
      super: {
        id: agent.agent ? agent.agent[:id] : nil,
        address: agent.agent ? agent.agent[:address] : nil
      }
    }.to_json
  end
end
