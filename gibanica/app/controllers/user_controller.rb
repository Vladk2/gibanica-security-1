class UserController < ApplicationController
  def login
    puts request.headers['Content-Type']
    puts request.headers['X-CSRF-Token']
    puts form_authenticity_token
    puts session[:_csrf_token]
    user = User.where(email: params[:email]).first

    if user.password_valid?(params[:password])
      head :ok # send jwt
    else
      head :unauthorized
    end

    rescue NoMethodError
      head :unauthorized
  end
end
