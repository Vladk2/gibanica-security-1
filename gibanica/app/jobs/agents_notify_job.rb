require 'rest-client'

class AgentsNotifyJob < ApplicationJob
  queue_as :notify_agents

  include RestClient

  def perform(agent, address, endpoint)
    Request.execute(
      method: :patch,
      url: "https://#{address}#{endpoint}",
      payload: agent,
      headers: {
        'Content-Type': 'application/json'
      },
      # VERIFY_PEER currently fails in development mode with error:
      # certificate verify failed (self signed certificate in certificate chain)
      verify_ssl: OpenSSL::SSL::VERIFY_NONE, # change to VERIFY_PEER
      ssl_client_cert: OpenSSL::X509::Certificate.new(File.read('../certs/siem.crt')),
      ssl_client_key: OpenSSL::PKey::RSA.new(File.read('../certs/siem.key')),
      ssl_ca_file: '../certs/root_ca.crt'
    )
  end
end
