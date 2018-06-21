require 'rest-client'

class AgentsNotifyJob < ApplicationJob
  queue_as :notify_agents

  include RestClient

  def perform(agent, address)
    Request.execute(
      method: :patch,
      url: "#{address}/update",
      payload: agent,
      headers: {
        'Content-Type': 'application/json'
      },
      ssl_ca_file: 'cert.pem'
    )
  end
end
