require 'rest-client'

class AgentsNotifyJob < ApplicationJob
  queue_as :notify_agents

  def perform(*args)
    response = RestClient.get 'https://github.com/rest-client/rest-client'
    puts response.body
    #puts response.status
  end
end
