class AlarmsController < ApplicationController
  # GET /alarms
  def index
    authorize! :read, Alarm

    @alarms = Alarm.all

    render json: @alarms
  end

  # GET /alarms/host_status
  def host_status
    authorize! :read, Alarm

    render json: Alarm.count_per_host, status: :ok
  end

  # GET /alarms/system_status
  def system_status
    authorize! :read, Alarm

    render json: Alarm.count, status: :ok
  end
end
