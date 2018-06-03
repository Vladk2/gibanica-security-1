class PasswordChangeRequest
  include Mongoid::Document
  include Mongoid::Timestamps

  field :reset_link, type: String
  field :reseted, type: Boolean, default: false

  belongs_to :user
end
