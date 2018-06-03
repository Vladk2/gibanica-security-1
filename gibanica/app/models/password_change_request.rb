class PasswordChangeRequest
  include Mongoid::Document
  include Mongoid::Timestamps

  field :reset_link, type: String

  belongs_to :user
end
