require "rails_helper"

RSpec.describe AlarmRulesController, type: :routing do
  describe "routing" do

    it "routes to #index" do
      expect(:get => "/alarm_rules").to route_to("alarm_rules#index")
    end


    it "routes to #show" do
      expect(:get => "/alarm_rules/1").to route_to("alarm_rules#show", :id => "1")
    end


    it "routes to #create" do
      expect(:post => "/alarm_rules").to route_to("alarm_rules#create")
    end

    it "routes to #update via PUT" do
      expect(:put => "/alarm_rules/1").to route_to("alarm_rules#update", :id => "1")
    end

    it "routes to #update via PATCH" do
      expect(:patch => "/alarm_rules/1").to route_to("alarm_rules#update", :id => "1")
    end

    it "routes to #destroy" do
      expect(:delete => "/alarm_rules/1").to route_to("alarm_rules#destroy", :id => "1")
    end

  end
end
