require_relative '../util/jwt_util'

class UserController < ApplicationController
  skip_before_action :authenticate_user, only: %w[login]

  def login
    user = User.where(email: params[:email]).first

    if user.nil?
      head :unauthorized
      return
    end

    if user.password_valid?(params[:password])
      redirect_to logs_path
      #render json: JwtUtil.encode(user), status: :ok
    else
      head :unauthorized
    end
  end
end
