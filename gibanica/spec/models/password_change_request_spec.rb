require 'rails_helper'

RSpec.describe PasswordChangeRequest, type: :model do
  it { is_expected.to be_mongoid_document }
end
