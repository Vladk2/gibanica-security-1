class AlarmsController < ApplicationController
  before_action :set_alarms, only: [:index]

  # GET /alarms
  def index
    authorize! :read, Alarm

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

  private

  def set_alarms
    page = params[:page].nil? ? 1 : params[:page]

    @alarms = {
      alarms: Alarm.ascending(:created_at).page(page),
      count: Alarm.count,
      page: page
    }
  end
end
