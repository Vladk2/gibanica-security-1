require 'bcrypt'

class User
  include BCrypt
  include Mongoid::Document

  field :email, type: String
  field :name, type: String
  field :last_name, type: String
  field :password, type: String

  def password_valid?(password)
    Password.new(self.password) == password
  end

  def hash_password(new_password)
    self.password = Password.create(new_password)
  end
end
