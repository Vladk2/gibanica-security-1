require 'jwt'

class JwtUtil
  def self.encode(obj)
    {
      token: JWT.encode(user_data(obj), ENV['GIBANICA_SECRET'], 'HS256')
    }
  end

  def self.decode(header_token)
    token = header_token

    payload = JWT.decode(
      token,
      ENV['GIBANICA_SECRET'],
      true,
      algorithm: 'HS256'
    )[0]

    JSON.parse(payload)
  end

  private

  def self.user_data(user)
    {
      id: user[:_id],
      email: user[:email],
      name: user[:name],
      last_name: user[:last_name]
    }.to_json
  end
end
