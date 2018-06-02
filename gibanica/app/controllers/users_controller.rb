require_relative '../util/jwt_util'

class UsersController < ApplicationController
  skip_before_action :authenticate_user, only: %w[login email_valid]
  before_action :accept_json_only, only: [:email_valid]
  before_action :content_type_json_only, only: [:email_valid]

  def login
    user = User.where(email: params[:email]).first

    if user.nil?
      head :unauthorized
      return
    end

    if user.password_valid?(params[:password])
      render json: JwtUtil.encode(user), status: :ok
    else
      head :unauthorized
    end
  end

  def email_valid
    user = User.where(email: params[:email]).first

    if user.nil?
      head :no_content
      return
    end

    head :ok
  end

  private

    def accept_json_only
      head :not_acceptable unless request.headers['Accept'] == 'application/json'
    end

    def content_type_json_only
      head :not_acceptable unless request.headers['Content-Type'] == 'application/json'
    end
end
