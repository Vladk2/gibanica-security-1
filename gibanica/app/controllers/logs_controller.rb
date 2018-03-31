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
    Log.new(log_params).save!
    head :ok
  end

  private
    def disable_json
      if request.format == 'application/json'
        head :not_found
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_log
      @log = Log.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def log_params
      params.require(:log).permit(:name, :is_dir, :dir_path, :user, :agent)
    end
end
