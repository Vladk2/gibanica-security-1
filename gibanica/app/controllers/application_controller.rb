require_relative '../util/jwt_util'

class ApplicationController < ActionController::API
  before_action :authenticate_user
  rescue_from AccessGranted::AccessDenied do
    head :forbidden
  end
  rescue_from JWT::DecodeError, with: :deny_access

  attr_reader :current_user

  private

  def deny_access
    head :unauthorized
  end

  def authenticate_user
    cookie = request.headers['Authorization']

    # jwt secret key will be read from env var
    json = JwtUtil.decode(cookie) unless cookie.nil?

    if !json.nil?
      @current_user ||= User.find(json['id'])
    else
      head :unauthorized
    end
  end
end
