class UserController < ApplicationController
  def login
    user = User.find_by_email(params[:email])

    if user.password_valid?(params[:password])
      render json: {}, status: :ok # send jwt
    else
      head :unauthorized
    end
  end
end
