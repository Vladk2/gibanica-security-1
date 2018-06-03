require_relative '../util/jwt_util'

class ApplicationController < ActionController::API
  include Pundit
  before_action :authenticate_user

  private

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
