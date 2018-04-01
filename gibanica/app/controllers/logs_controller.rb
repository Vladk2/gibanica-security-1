require 'json'

class LogsController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_action :disable_json, except: [:create]
  before_action :set_log, only: [:show]

  # GET /logs
  def index
    @logs = { logs: Log.all }
  end

  # GET /logs/1
  def show
    @log = { log: @log }
  end

  # POST /logs
  def create
    logs = log_params

    logs.each do |log|
      Log.new(log).save!
    end

    head :ok
  end

  private

    def disable_json
      head :not_found if request.format == 'application/json'
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      params.permit(logs: { content: [:name, :action, :user, :is_dir, :dir_path, :time] }).require(:logs)
    end
end
