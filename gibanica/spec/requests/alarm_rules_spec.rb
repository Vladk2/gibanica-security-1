require 'rails_helper'

RSpec.describe "AlarmRules", type: :request do
  describe "GET /alarm_rules" do
    it "works! (now write some real specs)" do
      get alarm_rules_path
      expect(response).to have_http_status(200)
    end
  end
end
