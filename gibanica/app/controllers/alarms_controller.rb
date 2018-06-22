class AlarmsController < ApplicationController
  before_action :set_alarm, only: [:show]

  # GET /alarms
  def index
    @alarms = Alarm.all

    render json: @alarms
  end

  # GET /alarms/1
  def show
    render json: @alarm
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_alarm
      @alarm = Alarm.find(params[:id])
    end
end
