class UserMailer < ApplicationMailer
  default from: 'password@gibanica-security.com'

  def password_reset
    @name = params[:name]
    @url = "https://#{params[:host]}/reset_password?link=#{params[:link]}"

    mail(to: params[:email], subject: 'Password reset request')
  end
end
