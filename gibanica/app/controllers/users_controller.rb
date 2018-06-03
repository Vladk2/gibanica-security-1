require_relative '../util/jwt_util'
require 'bcrypt'

class UsersController < ApplicationController
  skip_before_action :authenticate_user, except: %w[]
  before_action :set_change_request, only: [:reset_password]
  before_action :set_user, only: [:password_reset_link]
  before_action :accept_json_only, except: %w[email_valid reset_password]
  before_action :content_type_json_only
  before_action :user_params

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

  def password_reset_link
    unless @user.nil?
      link = BCrypt::Password.create(params[:email])

      PasswordChangeRequest.new(user: @user, reset_link: link).save!

      UserMailer.with(
        email: @user.email,
        name: @user.name,
        link: link,
        host: params[:host]
      ).password_reset.deliver_later
    end

    head :ok
  end

  def reset_password
    user = User.find(@change_request.user)
    @change_request.reseted = true

    if user.hash_password(params[:password])
      head :ok if user.save! && @change_request.save!
    else
      head :not_acceptable
    end
  end

  private

    def set_change_request
      @change_request =
        PasswordChangeRequest.where(reset_link: params[:token]).first

      return head :no_content if @change_request.nil?

      unless @change_request.created_at.between?(Time.now - 30.minutes, Time.now)
        return head :not_acceptable
      end

      head :locked if @change_request.reseted
    end

    def set_user
      @user = User.where(email: params[:email]).first
    end

    def accept_json_only
      head :not_acceptable unless request.headers['Accept'] == 'application/json'
    end

    def content_type_json_only
      head :not_acceptable unless request.headers['Content-Type'] == 'application/json'
    end

    def user_params
      params.require(:user).permit(:email, :password)
    end
end
