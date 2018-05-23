require_relative '../util/jwt_util'

class ApplicationController < ActionController::Base
  before_action :authenticate_user
  protect_from_forgery # unless: -> { request.format.json? }

  # Overload handle_unverified_request to ensure that
  # exception is raised each time a request does not
  # pass validation.
  def handle_unverified_request
    head :not_acceptable
  end

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
