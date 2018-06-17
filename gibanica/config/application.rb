require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
# require 'active_record/railtie'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'action_cable/engine'
require 'sprockets/railtie'
#require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Gibanica
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.api_only = true

    config.middleware.use Rack::Attack

    config.cache_store = :redis_store, 'redis://localhost:6379/0/cache', { expires_in: 90.minutes }

    config.active_job.queue_adapter = :sidekiq

    Mongoid::QueryCache.enabled = false

    # Rails 5

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins 'https://localhost:5000'
        resource '/users/*', headers: :any, methods: %i[post]
        resource '/logs', headers: :any, methods: %i[get]
        resource '/logs/*', headers: :any, methods: %i[get]
        resource '/agents', headers: :any, methods: %i[get]
        resource '/agents/*', headers: :any, methods: %i[put patch]
      end

      allow do
        origins '*'
        resource '/logs', headers: :any, method: %i[post]
        resource '/agents', headers: :any, method: %i[post]
      end
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.
  end
end
