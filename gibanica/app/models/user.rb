require 'bcrypt'

class User
  include BCrypt
  include Mongoid::Document
  include Mongoid::Timestamps

  has_and_belongs_to_many :roles, inverse_of: nil

  field :email, type: String
  field :name, type: String
  field :last_name, type: String
  field :password, type: String

  index({email: 1}, unique: true)

  def password_valid?(password)
    Password.new(self.password) == password
  end

  def hash_password(new_password)
    if strong_password?(new_password)
      self.password = Password.create(new_password)
      return true
    end

    false
  end

  def admin?
    roles.any? {|r| r.name == 'admin' }
  end

  private

  def strong_password?(password)
    return false if password.empty?
    return false if contains_backslash?(password)
    return false unless size_at_least_eight?(password)
    return false unless at_least_two_digits?(password)
    return false unless at_least_one_uppercase?(password)
    return false unless at_least_one_downcase?(password)
    return false unless at_least_one_symbol?(password)
    true
  end

  def contains_backslash?(password)
    password.include?('\\')
  end

  def size_at_least_eight?(password)
    password.size >= 8
  end

  def at_least_two_digits?(password)
    !!(/(?=(.*\d){2})/ =~ password)
  end

  def at_least_one_uppercase?(password)
    !!(/(?=.*[A-Z])/ =~ password)
  end

  def at_least_one_downcase?(password)
    !!(/(?=.*[a-z])/ =~ password)
  end

  def at_least_one_symbol?(password)
    !!(/(?=.*[ !@#$%^&*+=~.,:;\/"`'?{}\[\]<>()])/ =~ password)
  end
end
